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
		Schema::create('personalProperties', function (Blueprint $table) {
			$table->uuid('personalPropertyID')->primary();
			$table->uuid('salnID');

			$table->text('description'); // ENCRYPTED
			$table->text('yearAcquired'); // ENCRYPTED 
			$table->text('acquisitionCost'); // ENCRYPTED

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
		Schema::dropIfExists('personalProperties');
	}
};
