<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ $page['props']['title'] ?? config('app.name', 'Laravel') }}</title>
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        @inertiaHead
        @routes
    </head>
    <body class="bg-background font-sans antialiased">
        @inertia
    </body>
</html>
