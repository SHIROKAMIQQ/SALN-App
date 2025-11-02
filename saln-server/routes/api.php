<?php 
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;
use App\Http\Services\OtpService;

Route::post('/register-employee', [EmployeeController::class, 'register']);

Route::post('/login-employee', [EmployeeController::class, 'login']);

Route::post('/verify-otp', [OtpService::class, 'verifyOTP']);