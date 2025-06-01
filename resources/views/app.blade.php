<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="Sistem Informasi Prestasi Mahasiswa Politeknik Caltex Riau" />
    <meta property="og:title" content="SIPRESMA PCR" />
    <meta name="description"
        content="SIPRESMA adalah sistem informasi prestasi mahasiswa Politeknik Caltex Riau." />
    <meta name="keywords" content="sipresma pcr, politeknik, caltex, riau, politeknik caltex, pcr, mahasiswa, sipresma,"/>
    <meta property="og:site_name" content="Sistem Informasi Prestasi Mahasiswa PCR" />
    <meta property="google-site-verification" content="XazmPdrKVRB5VlJijgnjPkW2ExIL-55HcQ6oE21LSlU" />

    <meta property="og:url" content="https://sipresma.pocari.id" />
    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
