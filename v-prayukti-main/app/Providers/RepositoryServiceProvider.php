<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Interfaces\EventRepositoryInterface;
use App\Interfaces\RegistrationRepositoryInterface;
use App\Repositories\EventRepository;
use App\Repositories\RegistrationRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(EventRepositoryInterface::class, EventRepository::class);
        $this->app->bind(RegistrationRepositoryInterface::class, RegistrationRepository::class);

    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
