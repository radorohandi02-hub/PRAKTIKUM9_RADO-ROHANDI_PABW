<?php

use Illuminate\Support\Facades\Route;
use Modules\UserManagement\Http\Controllers\UserManagementController;

// Hanya admin
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::resource('users', UserManagementController::class)->except('show');
});
