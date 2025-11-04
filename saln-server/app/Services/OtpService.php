<?php

namespace App\Services;

use App\Models\OTP;
use App\Mail\OtpMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;

class OtpService
{
    private static array $wordBank = [];

    private function loadWordBank(): void
    {
        if (!empty(self::$wordBank)) {
            return;
        }

        $path = app_path('Services/eff_short_wordlist.txt');
        Log::info("searching {$path}");

        if (!file_exists($path)) {
            Log::error("word list not found at {$path}");
            throw new \RuntimeExpection("Word list not found");
        }

        self::$wordBank = array_filter(array_map('trim', file($path)));
        Log::info("Loaded " . count(self::$wordBank) . " words into word bank.");
    }

    private function generateOTP(): string {
        $this->loadWordBank();

        $wordCount = count(self::$wordBank);
        $selected = [];

        for ($i = 0; $i < 4; $i++) {
            // random_int() is cryptographically secure
            $wordIdx = random_int(0, $wordCount - 1);
            $selected[] = self::$wordBank[$wordIdx];
        }

        return implode('-', $selected);
    }

    /**
     * Generate a new OTP and send it to the given email address.
     */
    public function generateAndSend(string $email): void
    {
        // generate 4-word OTP
        $otp = $this->generateOTP();

        // delete any existing OTP with this email
        OTP::where('email', $email)->delete();
        
        // add new OTP entry
        OTP::create([
            'email' => $email,
            'otp_code' => $otp,
            'expires_at' => Carbon::now()->addMinutes(10),
        ]);

        // send OTP
        Mail::to($email)->send(new OtpMail($otp));
    }

    public function verify(string $email, string $otp)
    {
        $otpRecord = OTP::where('email', $email) //TODO: seems to be wrong when there are multiple OTPs for one account
                    ->latest()
                    ->first();

        if (!$otpRecord) {
            log::error('no otp found');
            return response()->json([
                'success' => false,
                'message' => 'No OTP found.'
            ], 404);
        }

        if (Carbon::parse($otpRecord->expires_at)->isPast()) {
            log::error('otp expired');
            return response()->json([
                'success' => false,
                'message' => 'OTP has expired.'
            ], 400);
        }

        if ($otp !== $otpRecord->otp_code) {
            log::error('invalid otp');
            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP.'
            ], 400);
        }

        $otpRecord->delete();
        return response()->json([
            'success' => true,
            'message' => "OTP verified!",
            'email' => $otpRecord->email,
            'employeeID' => $otpRecord->employeeID,
            'encryptionKey' => $otpRecord->encryption_key,
        ], 200);
    }
}
