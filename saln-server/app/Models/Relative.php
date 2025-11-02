<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Relative extends Model
{
	use HasFactory;

	protected $table = 'relatives';
	protected $primaryKey = 'relativeID';
	public $incrementing = false;
	protected $keyType = 'string';
	public $timestamps = false;

	protected $fillable = [
		'relativeID', 'salnID',
		'name', 'relationship', 'position', 'agency'
	];

	public function salnForm()
	{
		return $this->belongsTo(SALNForm::class, 'salnID');
	}
}
