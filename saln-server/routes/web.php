<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/email-otp', function () {
    $otp = "screen-ring-pen-king";
    $recipient_email = "recipient@example.com";

    Mail::to($recipient_email)->send(new OtpReceived($otp));
}); //TODO: add recipient address and variables