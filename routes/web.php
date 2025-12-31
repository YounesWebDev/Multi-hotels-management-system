<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HotelController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class,'index'])->name('dashboard');
    Route::resource('hotels', HotelController::class)->only(['index','store','update','destroy']);
});

require __DIR__.'/settings.php';
