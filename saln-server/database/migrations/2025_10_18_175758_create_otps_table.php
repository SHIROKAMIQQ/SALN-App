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
		Schema::create('otps', function (Blueprint $table) {
			$table->id('otpID')->primary();
			$table->string('email');
			$table->string('opt_code');
			$table->timestamp('expires_at');

			$table->foreign('email')
				->references('email')
				->on('employees')
				->onDelete('cascade');
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('otps');
	}
};
