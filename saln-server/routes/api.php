<?php 
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;


Route::post('/register-employee', [EmployeeController::class, 'register']);

Route::post('/login-employee', [EmployeeController::class, 'login']);

Route::post('/verify-otp', [EmployeeController::class, 'verifyOTP']);