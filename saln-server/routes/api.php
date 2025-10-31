<?php 
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;


Route::post('/register-employee', [EmployeeController::class, 'register']);

Route::post('/request-otp', [EmployeeController::class, 'requestOTP']);

Route::post('/verify-otp', [EmployeeController::class, 'verifyOTP']);