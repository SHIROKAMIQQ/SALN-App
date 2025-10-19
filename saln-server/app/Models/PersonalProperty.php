<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PersonalProperty extends Model
{
	use HasFactory;

	protected $primaryKey = 'personalPropertyID';
	public $incrementing = false;
	protected $keyType = 'string';

	protected $fillable = [
		'personalPropertyID', 'salnID',
		'description', 'yearAcquired', 'acquisitionCost'
	];

	public function salnForm()
	{
		return $this->belongsTo(SALNForm::class, 'salnID');
	}
}
