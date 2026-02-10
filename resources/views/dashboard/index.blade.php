@extends('layouts.main-dashboard')
@section('css')
    <link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
@endsection
@section('content')

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
                <div id="users" class="box"
                    style="display: none; align-items: center; justify-content: center; width:100px; height:100px; text-align: center; color:white; background:red">
                    Users</div>
                <div id="products" class="box"
                    style="display: none; align-items: center; justify-content: center; width:100px; height:100px; text-align: center; color:white; background:gray">
                    Products</div>
                <div id="inventories" class="box"
                    style="display: none; align-items: center; justify-content: center; width:100px; height:100px; text-align: center; color:white; background:orange">
                    Products</div>
                <div id="transactions" class="box"
                    style="display: none; align-items: center; justify-content: center; width:100px; height:100px; text-align: center; color:white; background:black">
                    Transactions</div>
                <div id="outlets" class="box"
                    style="display: none; align-items: center; justify-content: center; width:100px; height:100px; text-align: center; color:white; background:green">
                    Outlets</div>
                <div id="reports" class="box"
                    style="display: none; align-items: center; justify-content: center; width:100px; height:100px; text-align: center; color:white; background:blue">
                    Reports</div>
            </div>
        </div>
    @endsection
    <!-- JS -->
    @section('js')
        <script src="{{ asset('js/dashboard/main.js') }}"></script>
        <script src="{{ asset('js/auth/logout.js') }}"></script>
    @endsection
</body>

</html>
