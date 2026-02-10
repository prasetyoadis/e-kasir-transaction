<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('index');
});


Route::get('/dashboard', function () {
    return view('dashboard.index', [
        'title' => 'Dashboard'
    ]);
});
Route::get('/dashboard/kasir', function () {
    return view('dashboard.cashier-pos.index', [
        'title' => 'Dashboard Kasir-POS'
    ]);
});
Route::get('/dashboard/kasir-cafe', function () {
    return view('dashboard.cashier-cafe.index', [
        'title' => 'Dashboard Kasir Cafe'
    ]);
});
