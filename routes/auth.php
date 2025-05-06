<?php
use App\Http\Controllers\CentreController;
use App\Http\Controllers\HistoricController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\CheckSuperAdmin;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'formLogin'])->name('formLogin');
    Route::POST('/login', [AuthController::class, 'login'])->name('login');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
    foreach (['electricite','eau'] as $category) {
        Route::get('/'.$category, function () use ($category) {
            return redirect( $category.'/general');
        });
    }
   
    Route::get('/{category}/{type}', [TableController::class ,'getCounter'])->name('category.type');
    Route::post('/{category}/store', [TableController::class ,'store'])->name('{category}.row.store');
    Route::put('/{category}/update/{id}', [TableController::class ,'update'])->name('{category}. row.update');
    Route::delete('/{category}/destroy/{id}', [TableController::class ,'destroy'])->name('{category}.row.destroy');
    Route::post('/{category}/multiple/destroy', [TableController::class ,'multipleDestroy'])->name('{category}.row.multiple.destroy');


    Route::get('/row/{category}/{counter}/{id}/history', [HistoricController::class ,'index'])->name('history');
    Route::delete('/row/{id}/history/delete', [HistoricController::class ,'destroy'])->name('history.destroy');

    Route::get('/carburant', [TableController::class ,'notFound'])->name('carburant');
    Route::get('/gaz', [TableController::class ,'notFound'])->name('gaz');
    Route::get('/biomasse', [TableController::class ,'notFound'])->name('biomasse');


 });

Route::middleware(['auth', CheckSuperAdmin::class])->group(function () {
     Route::get('/settings', function () {
        return redirect('/settings/users');
    });
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/update/{id}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/destroy/{id}', [UserController::class, 'destroy'])->name('users.destroy');


    Route::get('/centres', [CentreController::class, 'index'])->name('centres.index');
    Route::post('/centres', [CentreController::class, 'store'])->name('centres.store');
    Route::put('/centres/{centre}', [CentreController::class, 'update'])->name('centres.update');
    Route::delete('/centres/{centre}', [CentreController::class, 'destroy'])->name('centres.destroy');
    Route::post('/centres/{id}/access', [CentreController::class, 'getAccess'])->name('centres.access');

});


