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
    $otp = createOTP();

    return response()->json([
      'success' => true,
      'message' => "Employee registered to database.",
    ], 201);
  }

  public function requestOTP(Request $request)
  {
    //
  }

  public function verifyOTP(Request $request)
  {
    //
  }
}

function emailOTP(String $email, String $otp)
{
  $details = [
      'title' => 'Your OTP for the SALN App.',
      'body' => 'Hello. Your OTP is ' . ($otp)
  ];

  Mail::to($email)->send(new TestEmail($details));
}

$WORD_BANK = null;
function loadWordBank(): array {
  global $WORD_BANK;
  if ($WORD_BANK === null) { //TODO: Store word directory somewhere
    $WORD_BANK = file(__DIR__ . '/eff-short_word_list.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  }
  return $WORD_BANK;
}

function createOTP(): string {
  $words = [];
  $word_bank = loadWordBank();
  $word_bank_size = count($word_bank);

  for ($i = 0; $i < 4; $i++) {
    $word_idx = random_int(0, $word_bank_size);
    $words[] = $word_bank[$word_idx];
  }

  return implode('-', $words);
}