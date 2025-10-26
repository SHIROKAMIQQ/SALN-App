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

    // TODO: Check if email already exists
    // If so, return a failed response. 

    // Save to database
    $employee = Employee::create([
      'employeeID' => $validated['employeeID'],
      'email' => $validated['email'],
      'encryption_key' => $encryptedKey
    ]);

    return response()->json([
      'success' => true,
      'message' => "Employee registered to database.",
    ], 201);
  }

  // TODO: Create OTP, Save OTP to otps table, Email OTP to Employee.email
}