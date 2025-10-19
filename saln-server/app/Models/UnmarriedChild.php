<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UnmarriedChild extends Model
{
	use HasFactory;

	protected $primaryKey = 'unmarriedChildID';
	public $incrementing = false;
	protected $keyType = 'string';

	protected $fillable = [
		'unmarriedChildID', 'salnID',
		'name', 'dob', 'age'
	];

	public function salnForm()
	{
		return $this->belongsTo(SALNForm::class, 'salnID');
	}
}
