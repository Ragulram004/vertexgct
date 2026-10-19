<?php

namespace App\Filament\Resources\EventResource\Widgets;

use App\Models\Event;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class EventTypeOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Technical',Event::where('type', 'Technical')->count()),
            Stat::make('Non Technical',Event::where('type', 'Non Technical')->count()),
            Stat::make('Workshops',Event::where('type', 'Workshops')->count()),
            Stat::make('Hackathons',Event::where('type', 'Hackathons')->count()),
        ];
    }
}
