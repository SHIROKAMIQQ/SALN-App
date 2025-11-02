<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use Illuminate\Support\Facades\Crypt;

class EmployeeController extends Controller
{
  public function register(Request $request)
  {
    $validated = $request->validate([
      'employeeID' => 'required|uuid|unique:employees,employeeID',
      'email' => 'required|email|unique:employees,email',
      'encryption_key' => 'required|string'
    ]);

    // Encrypt the encryption key using APP_KEY
    $encryptedKey = Crypt::encryptString($validated['encryption_key']);

    // Save to database
    $employee = Employee::create([
      'employeeID' => $validated['employeeID'],
      'email' => $validated['email'],
      'encryption_key' => $encryptedKey
    ]);
    
    // TODO: Create OTP, Save OTP to otps table, Email OTP to Employee.email

    return response()->json([
      'success' => true,
      'message' => "Employee registered to database.",
    ], 201);
  }
}