<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use Livewire\Livewire;

// if (env('APP_ENV') != 'local') {
//     Livewire::setScriptRoute(function ($handle) {
//         $urlPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
//         $segments = explode('/', trim($urlPath, '/'));
//         $rootFolder = $segments[0] ?? 'localhost'; // Use null coalescing operator
//         return Route::get($rootFolder . '/public/livewire/livewire.js', $handle);
//     });
    
//     Livewire::setUpdateRoute(function ($handle) {
//         $urlPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
//         $segments = explode('/', trim($urlPath, '/'));
//         $rootFolder = $segments[0] ?? 'localhost'; // Use null coalescing operator
//         return Route::post($rootFolder . '/public/livewire/update', $handle);
//     });

    
// }
