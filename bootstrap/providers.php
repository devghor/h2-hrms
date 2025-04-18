<?php

declare(strict_types=1);

return [
    App\Providers\AppServiceProvider::class,
    // Ohter module depenedent on base module so it should be loaded first
    Modules\Base\Providers\BaseServiceProvider::class,
];
