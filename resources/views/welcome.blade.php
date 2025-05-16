<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome | API Portal</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net" />
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <!-- Custom Animation -->
    <style>
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
            animation: fade-in 0.6s ease-out;
        }
    </style>
</head>
<body class="bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 font-sans">

    <main class="w-full max-w-2xl text-center space-y-6 animate-fade-in">
        <h1 class="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            Welcome to the <span class="text-[#1b1b18] dark:text-white">API Portal</span>
        </h1>

        <p class="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Access developer tools, view API documentation, and manage your client dashboard.
        </p>

        <div class="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <a href="{{ url('/docs/api') }}"
               class="inline-block px-6 py-3 rounded-lg text-sm font-semibold bg-[#1b1b18] text-white dark:bg-white dark:text-[#0a0a0a] hover:opacity-90 transition duration-200 shadow-md">
                API Documentation
            </a>

            <a href="{{ url('http://localhost:3000') }}"
               class="inline-block px-6 py-3 rounded-lg text-sm font-semibold border border-[#1b1b18] dark:border-[#EDEDEC] text-[#1b1b18] dark:text-[#EDEDEC] hover:bg-[#1b1b18] hover:text-white dark:hover:bg-[#EDEDEC] dark:hover:text-[#0a0a0a] transition duration-200 shadow-md">
                Client Area
            </a>
        </div>
    </main>
</body>
</html>
