<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test User Previlage</title>
</head>
<body>
    <div id="dashboard" class="" style="max-width: 480px; margin: 0 auto;">
        <h2>Info</h2>
        <p>
            HTTP: /api/auth/me<br>
            User: <span id="name"></span><br>
            <!-- Status User: <span id="status-user"></span><br> -->
            <!-- Status Subscription: <span id="status-subscription"></span><br> -->
            Subscription End: <span id="time-end-subscription"></span><br>
            Role: <span id="role"></span><br>
            Akses: <span id="access"></span>
        </p>
        <p>
            <form id="formLogout">
                <button type="submit">Sign Out</button>
            </form>
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:16px">
            <div id="users" class="box" style="display: none; align-items: center; justify-content: center; width:100px; height:100px; text-align: center; color:white; background:red">Users</div>
            <div id="products" class="box" style="display: none; align-items: center; justify-content: center; width:100px; height:100px; text-align: center; color:white; background:gray">Products</div>
            <div id="inventories" class="box" style="display: none; align-items: center; justify-content: center; width:100px; height:100px; text-align: center; color:white; background:orange">Products</div>
            <div id="transactions" class="box" style="display: none; align-items: center; justify-content: center; width:100px; height:100px; text-align: center; color:white; background:black">Transactions</div>
            <div id="outlets" class="box" style="display: none; align-items: center; justify-content: center; width:100px; height:100px; text-align: center; color:white; background:green">Outlets</div>
            <div id="reports" class="box" style="display: none; align-items: center; justify-content: center; width:100px; height:100px; text-align: center; color:white; background:blue">Reports</div>
        </div>
    </div>

    <script src="js/dashboard/main.js"></script>
    <script src="js/auth/logout.js"></script>
</body>
</html>