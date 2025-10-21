<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class Employee extends Authenticable {
	use HasApiTokens, HasFactory;

	protected $table = 'employees';
	protected $primaryKey = 'employeeID';
	public $incrementing = false;
	protected $keyType = 'string'

	protected $fillable = [
		'employeeID',
		'email', 
		'encryption_key'
	];

	public function otps() {
		return $this->hasMany(OTP::class, 'employeeID', 'employeeID');
	}
}
