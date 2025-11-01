<?php

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use App\Mail\SendOTP;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-sendOTP', function () {
    $otp = "screen-ring-pen-king";
    $recipient_email = "recipient@example.com";

    Mail::to($recipient_email)->send(new SendOTP($otp));
});