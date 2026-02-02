const token = localStorage.getItem('token');
const formLogout = document.getElementById('formLogout');

document.addEventListener('DOMContentLoaded', async () => {
    if(localStorage.getItem('is_logged_in') === 'false'){
        window.location.href = '/login';
    }
    try {
        const response = await fetch('test-response/success/dashboard/me-admin.json');
        
        // const response = await fetch('http://192.168.43.6:8080/api/auth/me', {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': `Bearer ${token}`,
        //         'Accept': 'application/json'
        //     }
        // })

        if (!response.statusCode === 200) {
            throw new Error('Gagal load user data');
        }
    
        const resultResponse = await response.json();
        const dataUser = resultResponse.result.data;
    
        console.log('Loaded user:', dataUser);
    
        const dashboard = document.getElementById('dashboard');

        const isValid = hasValidSubscription(dataUser.subscriptions);

        if(dataUser.is_active){
            if (isValid) {
                applyUserPrivilege(dataUser);
            } else {
                dashboard.innerHTML = `<p style="color: red; font-size: 2rem; font-weight: bold; text-align: center;">403 Forbidden<br>Access denied user don't have subcription active</p>`
            }
        } else {
            dashboard.innerHTML = `<p style="color: red; font-size: 2rem; font-weight: bold; text-align: center;">403 Forbidden<br>Access denied user is not active</p>`
        }
    
    } catch (err) {
        document.getElementById('dashboard').innerHTML = `
            <p style="color:red; font-size:2rem; text-align:center;">
                ${err.message}
            </p>
        `;
    }
});

const menuPermissionMap = {
    users: {
        base: 'user',
        permissions: ['user.*', 'user.view', 'user.update']
    },
    products: {
        base: 'product',
        permissions: ['product.*', 'product.view', 'product.update']
    },
    inventories: {
        base: 'inventory',
        permissions: ['inventory.*', 'inventory.view', 'inventory.update']
    },
    transactions: {
        base: 'transaction',
        permissions: ['transaction.*']
    },
    outlets: {
        base: 'outlet',
        permissions: ['outlet.*']
    },
    reports: {
        base: 'report',
        permissions: ['report.*']
    }
};

function hasValidSubscription(subscriptions = []){
    isSubscribe = Array.isArray(subscriptions)
    if (!isSubscribe) return false;

    const now = new Date();

    return subscriptions.some(sub => {
        if (!sub.valid_to || !sub.subscription_status) return false;

        return (sub.subscription_status === "active" && 
                new Date(sub.valid_from) <= now &&
                new Date(sub.valid_to) >= now);
    });
}

function hasPermission(userPermissions, requiredPermissions) {
    return requiredPermissions.some(req => {
        if (req.endsWith('.*')) {
            const prefix = req.replace('.*', '');
            return userPermissions.some(p => p.startsWith(prefix));
        }
        return userPermissions.includes(req);
    });
}

function getMenuPermissions(userPermissions, base) {
    return userPermissions.filter(
        p => p === `${base}.*` || p.startsWith(`${base}.`)
    );
}

function formatMenuLabel(menuId, permissionBase, permissions) {
    // jika punya wildcard
    if (permissions.includes(`${permissionBase}.*`)) {
        return capitalize(menuId);
    }

    // ambil action granular
    const actions = permissions
        .map(p => p.split('.')[1])
        .filter(Boolean);

    return `${capitalize(menuId)}<br>(${actions.join(', ')})`;
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function applyUserPrivilege(user) {
    const roleUser = user.roles[0];
    const permissionUser = roleUser.permissions;
    const subUser = user.subscriptions[0];

    // Mengambil data privileges sesuai permission user
    Object.entries(menuPermissionMap).forEach(([menuId, config]) => {
        if (!hasPermission(permissionUser, config.permissions)) return;

        const el = document.getElementById(menuId);
        if (!el) return;

        const menuPerms = getMenuPermissions(permissionUser, config.base);

        el.innerHTML = formatMenuLabel(menuId, config.base, menuPerms);
        el.style.display = 'flex';
    });

    const userName = document.getElementById('name');
    const userStatus = document.getElementById('status-user');
    const subStatus = document.getElementById('status-subscription');
    const subTime = document.getElementById('time-end-subscription');
    const userSlug = document.getElementById('role');
    const userAccess = document.getElementById('access');

    const validToSub = new Date(subUser.valid_to);
    const expireSub = new Intl.DateTimeFormat('id-ID', {
        dateStyle: "long",
        timeStyle: "short",
    }).format(validToSub);
    
    // Set data info user
    userName.textContent = user.name;
    // userStatus.textContent = (user.is_active) ? "Active" : "Inactive";
    // subStatus.textContent = subUser.subscription_status;
    subTime.textContent = expireSub;
    userSlug.textContent = roleUser.slug;
    userAccess.textContent = permissionUser.join(', ');
}

formLogout.addEventListener('submit', async (e) => {
    e.preventDefault();

    await logoutUser(token);
});