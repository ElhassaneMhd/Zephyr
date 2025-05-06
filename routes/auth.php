
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
    
    // Electricite
    Route::get('/electricite', function () {
        return redirect('/electricite/general');
    });
    Route::get('/electricite/general', [TableController::class ,'getGenerale'])->name('electricite.general');
    Route::get('/electricite/divisional', [TableController::class ,'getDivisional'])->name('electricite.divisional');
    Route::post('/electricite/store', [TableController::class ,'store'])->name('electricite.row.store');
    Route::put('/electricite/update/{id}', [TableController::class ,'update'])->name('electricite. row.update');
    Route::delete('/electricite/destroy/{id}', [TableController::class ,'destroy'])->name('electricite.row.destroy');
    Route::post('/electricite/multiple/destroy', [TableController::class ,'multipleDestroy'])->name('electricite.row.multiple.destroy');

    // Eau
    Route::get('/eau', function () {
        return redirect('/eau/general');
    });
    Route::get('/eau/general', [TableController::class ,'getGenerale'])->name('eau.general');
    Route::get('/eau/divisional', [TableController::class ,'getDivisional'])->name('eau.divisional');
    Route::post('/eau/store', [TableController::class ,'store'])->name('eau.row.store');
    Route::put('/eau/update/{id}', [TableController::class ,'update'])->name('eau. row.update');
    Route::delete('/eau/destroy/{id}', [TableController::class ,'destroy'])->name('eau.row.destroy');
    Route::post('/eau/multiple/destroy', [TableController::class ,'multipleDestroy'])->name('eau.row.multiple.destroy');


    Route::get('/row/{counter}/{id}/history', [HistoricController::class ,'index'])->name('history');
    Route::delete('/row/{id}/history/delete', [HistoricController::class ,'destroy'])->name('history.destroy');

    // Route::get('/eau', [TableController::class ,'notFound'])->name('eau');
    Route::get('/carburan', [TableController::class ,'notFound'])->name('carburan');
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


