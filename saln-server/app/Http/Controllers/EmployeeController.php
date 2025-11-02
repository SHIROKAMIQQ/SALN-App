<?php

namespace App\Http\Controllers;

use App\Models\OTP;
use Illuminate\Http\Request;
use App\Services\OtpService;
use App\Models\Employee;
use Illuminate\Support\Facades\Crypt;

class EmployeeController extends Controller
{
  protected $otpService;

  public function __construct(OtpService $otpService)
  {
      $this->otpService = $otpService;
  }

  public function register(Request $request)
  {
    $validated = $request->validate([
      'employeeID' => 'required|uuid|unique:employees,employeeID',
      'email' => 'required|email|unique:employees,email',
      'encryption_key' => 'required|string'
    ]);

    $email = $validated['email'];

    // TODO: return an error if the email already exists

    // Encrypt the encryption key using APP_KEY
    $encryptedKey = Crypt::encryptString($validated['encryption_key']);

    // Save to database
    $employee = Employee::create([
      'employeeID' => $validated['employeeID'],
      'email' => $validated['email'],
      'encryption_key' => $encryptedKey
    ]);
    
    // TODO: Create OTP, Save OTP to otps table, Email OTP to Employee.email
    $this->otpService->generateAndSend($email);

    return response()->json([
      'success' => true,
      'message' => "Employee registered to database, OTP is sent.",
    ], 201);
  }

  public function login(Request $request)
  {
    $validated = $request->validate([
      'employeeID' => 'required|uuid|unique:employees,employeeID',
      'email' => 'required|email|unique:employees,email',
      'encryption_key' => 'required|string'
    ]);

    $employee = Employee::where('email', $request->email)->first();

    if (!$employee) {
        return response()->json(['message' => 'Account not found.'], 404);
    }

    $this->otpService->generateAndSend($employee->email);

    return response()->json([
      'success' => true,
      'message' => "OTP is sent.",
    ], 201);
  }

  public function verifyOTP(Request $request)
  {
    $this->otpService->verify($request->email, $request->otp);

    return response()->json([
      'success' => true,
      'message' => 'OTP verified successfully!'
    ], 201);
  }
}