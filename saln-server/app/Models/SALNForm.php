<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SALNForm extends Model
{
	use HasFactory;

	protected $table = 'salnForms';
	protected $primaryKey = 'salnID';
	public $incrementing = false;
	protected $keyType = 'string';
	public $timestamps = false;

	protected $casts = [
		'updatedAt' => 'datetime'
	];

	protected $fillable = [
		'salnID', 'employeeID',
		'filingType',
		'declarantName', 'address', 
		'position', 'agency', 'officeAddress',
		'spouseName', 'spousePosition', 'spouseAgency', 'spouseOfficeAddress',
		'updatedAt'
	];

	public function unmarriedChildren()
	{
		return $this->hasMany(UnmarriedChild::class, 'salnID');
	}

	public function realProperties() 
	{
		return $this->hasMany(RealProperty::class, 'salnID');
	}

	public function personalProperties()
	{
		return $this->hasMany(PersonalProperty::class, 'salnID');
	}

	public function liabilities()
	{
		return $this->hasMany(Liability::class, 'salnID');
	}

	public function connections()
	{
		return $this->hasMany(Connection::class, 'salnID');
	}

	public function relatives()
	{
		return $this->hasMany(Relative::class, 'salnID');
	}

	public function employee() 
	{
		return $this->belongsTo(Employee::class, 'employeeID');
	}
}
