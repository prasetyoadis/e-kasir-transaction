const formLogout = document.getElementById('formLogout');

formLogout.addEventListener('submit', async (e) => {
    e.preventDefault();

    await logoutUser(token);
});

async function logoutUser(token) {
    try {
        // const response = await fetch('test-response/200logoutsuccess.json');

        const response = await fetch('http://192.168.43.6:8001/api/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${token}`,
                'Accept': 'application/json'
            }
        })

        if (response.statusCode === 401) {
            throw new Error('Invalid Token');
        }

        localStorage.removeItem('current_user');
        localStorage.removeItem('token');
        localStorage.setItem('is_logged_in', 'false');

        window.location.href = 'http://127.0.0.1:8001/login';
    } catch (error) {
        console.error(error);
    }
}