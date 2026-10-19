<?php

use App\Http\Controllers\RegistrationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;




Route::apiResource('/events', EventController::class)->only(['index','show']);
Route::apiResource('/register',RegistrationController::class)->only(['store','show']);
Route::get('/combos', [EventController::class, 'combos']);

