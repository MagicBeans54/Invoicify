<!DOCTYPE html>
<html lang="en" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="app-name" content="{{ config('app.name', 'Invoicify') }}">
        <title>Invoicify</title>
        <link rel="icon" type="image/svg+xml" href="/images/techstack_logo.svg">
        <script>
            try {
                document.documentElement.classList.toggle(
                    'dark',
                    (localStorage.getItem('invoicify-theme') || 'dark') === 'dark'
                );
            } catch (e) {
                document.documentElement.classList.add('dark');
            }
        </script>
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        @inertiaHead
        @routes
    </head>
    <body class="bg-background font-sans antialiased">
        @inertia
    </body>
</html>
