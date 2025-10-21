<?php 
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;


Route::post('/register-employee', [EmployeeController::class, 'register']);