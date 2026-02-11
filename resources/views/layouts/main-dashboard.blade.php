<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kassia - {{ $title }}</title>
    <link rel="stylesheet" href="{{ asset('css/navbar.css') }}">
    <link rel="stylesheet" href="{{ asset('css/header.css') }}">
    @yield ('css')
</head>

<body>
    <header>
        @include('partials.dashboard.header')
    </header>
    <nav>
        @include('partials.dashboard.navbar')
    </nav>
    <!-- Main Konten -->
    <main class="pos-container">
        @yield ('content')
    </main>
    <!-- JS -->
    <script src="{{ asset('js/header.js') }}"></script>
    <script src="{{ asset('js/auth/logout.js') }}"></script>
    @yield('js')
</body>

</html>
