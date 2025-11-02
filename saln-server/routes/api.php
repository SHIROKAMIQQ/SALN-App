<?php 
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\SalnFormController;
use App\Services\OtpService;

Route::post('/register-employee', [EmployeeController::class, 'register']);

Route::post('/login-employee', [EmployeeController::class, 'login']);

Route::post('/submit-saln', [SalnFormController::class, 'submit']);

Route::post('/verify-otp', [EmployeeController::class, 'verifyOTP']);

