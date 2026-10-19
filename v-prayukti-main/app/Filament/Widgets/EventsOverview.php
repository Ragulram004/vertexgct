<?php

namespace App\Filament\Widgets;

use App\Models\Event;
use App\Models\Registration;
use App\Models\Role;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Spatie\Permission\Models\Role as ModelsRole;

class EventsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Events',Event::where('status', 'Active')->count())->chart([3, 5, 8, 1, 11, 7, 15])->color('success'),
            Stat::make('Users',User::count())->chart([3, 5, 8, 1, 11, 7, 15])->color('success'),
            Stat::make('Registrations',Registration::count())->chart([3, 5, 8, 1, 11, 7, 15])->color('success'),


        ];
    }
}
