<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class OTP extends Model {
	use HasFactory;

	protected $table = 'otps';
	protected $primaryKey = 'otpID';
	public $incrementing = true;
	protected $keyType = 'int';

	protected $fillable = [
		'employeeID',
		'otp_code',
		'expires_at'
	];
}
