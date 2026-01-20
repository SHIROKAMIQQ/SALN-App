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
		Schema::create('salnForms', function (Blueprint $table) {
			$table->uuid('salnID')->primary();
			$table->uuid('employeeID');

			$table->text('filingType'); // ENCRYPTED
			$table->text('declarantFamilyName'); // ENCRYPTED
			$table->text('declarantFirstName'); // ENCRYPTED
			$table->text('declarantMI'); // ENCRYPTED
			$table->text('address'); // ENCRYPTED
			$table->text('position'); // ENCRYPTED
			$table->text('agency'); // ENCRYPTED
			$table->text('officeAddress'); // ENCRYPTED
			$table->text('spouseFamilyName'); // ENCRYPTED
			$table->text('spouseFirstName'); // ENCRYPTED
			$table->text('spouseMI'); // ENCRYPTED
			$table->text('spousePosition'); // ENCRYPTED
			$table->text('spouseAgency'); // ENCRYPTED
			$table->text('spouseOfficeAddress'); // ENCRYPTED

			$table->timestamp('updatedAt');

			$table->foreign('employeeID')
				->references('employeeID')
				->on('employees')
				->onDelete('cascade');
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('salnForms');
	}
};
