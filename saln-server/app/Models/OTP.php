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
	public $timestamps = true;

	protected $fillable = [
		'email',
		'otp_code',
		'expires_at'
	];

	protected static function boot()
	{
		parent::boot();
		
		static::creating(function ($otp) {
			if (!$otp->expires_at) {
				$otp->expires_at = now()->addMinutes(10);
			}
		});
	}
}
