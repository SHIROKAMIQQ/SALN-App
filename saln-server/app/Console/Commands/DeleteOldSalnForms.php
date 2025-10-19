<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DeleteOldSalnForms extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'saln:cleanup';
	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Delete SALN Forms older than 5 days since their latest update';

	/**
	 * Execute the console command.
	 */
	public function handle()
	{
		DB::table('salnForms')
			->where('updatedAt', '<', now()->subDays(5))
			->delete();
	
		$this->info("Old SALN Forms cleaned up");
	}
}
