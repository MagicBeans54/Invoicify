<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="app-name" content="{{ config('app.name', 'Invoicify') }}">
        <title>Invoicify</title>
        <link rel="icon" type="image/png" href="/images/techstack_ico.png">
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        @inertiaHead
        @routes
    </head>
    <body class="bg-background font-sans antialiased">
        @inertia
    </body>
</html>
