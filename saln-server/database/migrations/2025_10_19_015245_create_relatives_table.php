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
		Schema::create('relatives', function (Blueprint $table) {
			$table->uuid('relativeID')->primary();
			$table->uuid('salnID');

			$table->text('name'); // ENCRYPTED
			$table->text('relationship'); // ENCRYPTED
			$table->text('position'); // ENCRYPTED
			$table->text('agency'); //ENCRYPTED

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
		Schema::dropIfExists('relatives');
	}
};
