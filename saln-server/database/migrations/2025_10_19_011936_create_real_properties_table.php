<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		Schema::create('realProperties', function (Blueprint $table) {
			$table->uuid('realPropertyID')->primary();
			$table->uuid('salnID');
			
			$table->text('description'); // ENCRYPTED
			$table->text('kind'); // ENCRYPTED
			$table->text('exactLocation'); // ENCRYPTED
			$table->text('assessedValue'); // ENCRYPTED
			$table->text('currentFairMarketValue'); //ENCRYPTED
			$table->text('acquisitionYear'); // ENCRYPTED
			$table->text('acquisitionMode'); // ENCRYPTED
			$table->text('acquisitionCost'); // ENCRYPTED
			$table->text('nondeclarantExclusive'); // ENCRYPTED
			
			$table->foreign('salnID')
				->references('salnID')
				->on('salnForms')
				->onDelete('cascade');
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('realProperties');
	}
};
