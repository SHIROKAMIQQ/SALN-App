<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Connection extends Model
{
	use HasFactory;

	protected $primaryKey = 'connectionID';
	public $incrementing = false;
	protected $keyType = 'string';

	protected $fillable = [
		'connectionID', 'salnID',
		'name', 'businessAddress', 'nature', 'dateOfAcquisition'
	];

	public function salnForm() {
		return $this->belongsTo(SALNForm::class, 'salnID');
	}
}
