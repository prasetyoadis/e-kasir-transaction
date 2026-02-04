<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('index');
});


Route::get('/dashboard', function () {
    return view('dashboard.index');
});
Route::get('/dashboard/kasir', function () {
    return view('dashboard.cashier-pos.index');
});
Route::get('/dashboard/kasir-cafe', function () {
    return view('dashboard.cashier-cafe.index');
});

