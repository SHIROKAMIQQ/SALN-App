<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use Illuminate\Support\Facades\Crypt;
class EmployeeController extends Controller
{
  public function register(Request $request)
  {
    echo "request: " . $request;

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

    $email = $validated['email'];
    
    // TODO: Create OTP, Save OTP to otps table, Email OTP to Employee.email
    /*
    $otp = createOTP();

    
    Otp::create([
      'email' => $email,
      'otp' => bcrypt($otp),
      'expires_at' => Carbon::now()->addMinutes(5),
    ]);

    emailOTP($email, $otp);
    */

    return response()->json([
      'success' => true,
      'message' => "Employee registered to database.",
    ], 201);
  }

  /*

  public function login(Request $request)
  {
    // TODO
  }

  public function verifyOTP(Request $request)
  {
    $validated = $request->validate([
      'email' => 'required|email|unique:employees,email',
      'otp' => 'required|string'
    ]);

    $otpRecord = Otp::where('email', $validated['email'])
                    ->latest()
                    ->first();

    if (!$otpRecord) {
        return response()->json(['message' => 'No OTP found.'], 404);
    }

    if (Carbon::parse($otpRecord->expires_at)->isPast()) {
        return response()->json(['message' => 'OTP has expired.'], 400);
    }

    if (!Hash::check($validated['otp'], $otpRecord->otp)) {
        return response()->json(['message' => 'Invalid OTP.'], 400);
    }

    // OTP is valid – delete it
    $otpRecord->delete();

    // You can now mark user as verified, log them in, etc.
    return response()->json(['message' => 'OTP verified successfully!']);
  }
  */
}

function emailOTP(String $email, String $otp)
{
  Mail::to($email)->send(new SendOTP($otp));
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