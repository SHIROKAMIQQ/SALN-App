<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Liability extends Model
{
	use HasFactory;

	protected $primaryKey = 'liabilityID';
	public $incrementing = false;
	protected $keyType = 'string';

	protected $fillable = [
		'liabilityID', 'salnID',
		'nature', 'creditors', 'outstandingBalance'
	];

	public function salnForm()
	{
		return $this->belongsTo(SALNForm::class, 'salnID');
	}
}
