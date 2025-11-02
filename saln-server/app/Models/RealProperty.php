<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RealProperty extends Model
{
	use HasFactory;

	protected $table = 'realProperties';
	protected $primaryKey = 'realPropertyID';
	public $incrementing = false;
	protected $keyType = 'string';
	public $timestamps = false;

	protected $fillable = [
		'realPropertyID', 'salnID',
		'description', 'kind', 'exactLocation',
		'assessedValue', 'currentFairMarketValue',
		'acquisitionYear', 'acquisitionMode', 'acquisitionCost'
	];

	public function salnForm()
	{
		return $this->belongsTo(SALNForm::class, 'salnID');
	}
}
