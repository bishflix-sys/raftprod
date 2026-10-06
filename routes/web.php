<?php

use App\Http\Controllers\Admin\AccessController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'portal')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (Request $request) {
        $module = (string) $request->query('module', 'overview');
        Gate::authorize("module.{$module}.view");

        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('admin/access', [AccessController::class, 'index'])
        ->middleware('can:view-access')
        ->name('admin.access.index');

    Route::patch('admin/users/{user}/role', [AccessController::class, 'update'])
        ->middleware('can:manage-access')
        ->name('admin.users.role.update');
});

require __DIR__.'/settings.php';
