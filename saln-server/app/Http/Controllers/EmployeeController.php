<?php

namespace App\Http\Controllers;

use App\Models\OTP;
use Illuminate\Http\Request;
use App\Services\OtpService;
use App\Models\Employee;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EmployeeController extends Controller
{
  protected $otpService;

  public function __construct(OtpService $otpService)
  {
      $this->otpService = $otpService;
  }

  public function login(Request $request)
  {
    DB::beginTransaction();

    $validated = $request->validate([
      'employeeID' => 'required|uuid|unique:employees,employeeID',
      'email' => 'required|email'
    ]);

    // If email does not exist, insert it into database 
    if (!Employee::where('email', $request->email)->first()) {
      $email = $validated['email'];
      $employee = Employee::create([
        'employeeID' => $validated['employeeID'],
        'email' => $validated['email']
      ]);
    }

    // Login logic
    $this->otpService->generateAndSend($validated['email']);

    DB::commit();
    return response()->json([
      'success' => true,
      'message' => "OTP is sent.",
    ], 201);
  }

  public function verifyOTP(Request $request)
  {
    return $this->otpService->verify($request->email, $request->otp);
  }

  public function destroy($employeeID)
  {
    DB::beginTransaction();
    try {
      $employee = Employee::where('employeeID', $employeeID)->first();
      if (!$employee) {
        return response()->json([
          'status' => 'Employee not found'
        ], 404);
      }
      $employee->delete(); 
      DB::commit();
      return response()->json(['status' => 'success'], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json([
        'status' => 'error',
        'message' => $e->getMessage()
      ], 500);
    }
  }
}