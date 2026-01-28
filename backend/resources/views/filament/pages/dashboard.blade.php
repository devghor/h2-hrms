<x-filament-panels::page>
    <div class="space-y-6">
        <!-- Welcome Section -->
        <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {{ auth()->user()->name }}! 👋
            </h2>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
                Here's what's happening with your HRMS today.
            </p>
        </div>

        <!-- Stats Overview -->
        <div>
            @if ($this->getHeaderWidgets())
                <x-filament-widgets::widgets
                    :columns="$this->getHeaderWidgetsColumns()"
                    :widgets="$this->getHeaderWidgets()"
                />
            @endif
        </div>

        <!-- Charts and Tables -->
        <div>
            @if ($this->getFooterWidgets())
                <x-filament-widgets::widgets
                    :columns="$this->getFooterWidgetsColumns()"
                    :widgets="$this->getFooterWidgets()"
                />
            @endif
        </div>
    </div>
</x-filament-panels::page>
