<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SALNForm;
use App\Models\UnmarriedChild;
use App\Models\RealProperty;
use App\Models\PersonalProperty;
use App\Models\Liability;
use App\Models\Connection;
use App\Models\Relative;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SalnFormController extends Controller
{
	public function submit(Request $request)
	{
		$validated = $request->validate([
			'employeeID' => 'required|string',
			'form.salnID' => 'required|string',
			'form.updatedAt' => 'required|string',
		]);

		$employeeID = $validated['employeeID'];
		$form = $request->input('form');

		DB::beginTransaction();
		try {
			$saln = SALNForm::firstOrNew(['salnID' => $form['salnID']]);
			$clientUpdatedAt = Carbon::parse($form['updatedAt']);

			if ($saln->exists && $saln->updatedAt && $saln->updatedAt->gte($clientUpdatedAt)) {
				DB::rollBack();
				return response()->json([
					'status' => 'ignored',
					'message' => 'Remote version is newer or same; ignoring this update.'
				], 200);
			}

			$saln->employeeID = $employeeID;
			$saln->updatedAt = $clientUpdatedAt;

			$personalInfo = $form['personalInfo'] ?? [];
			foreach ($personalInfo as $key => $value) {
				$saln->$key = $value;
			}

			$saln->save();
			$salnID = $saln->salnID;

			UnmarriedChild::where('salnID', $salnID)->delete();
			foreach($form['children'] ?? [] as $child) {
				UnmarriedChild::create([
					'salnID' => $salnID,
					'unmarriedChildID' => $child['unmarriedChildID'],
					'name' => $child['name'],
					'dob' => $child['dob'],
					'age' => $child['age'],
				]);
			}

			RealProperty::where('salnID', $salnID)->delete();
			foreach($form['realProperties'] ?? [] as $realProperty) {
				RealProperty::create([
					'salnID' => $salnID,
					'realPropertyID' => $realProperty['realPropertyID'],
					'description' => $realProperty['description'],
					'kind' => $realProperty['kind'],
					'exactLocation' => $realProperty['exactLocation'],
					'assessedValue' => $realProperty['assessedValue'],
					'currentFairMarketValue' => $realProperty['currentFairMarketValue'],
					'acquisitionYear' => $realProperty['acquisitionYear'],
					'acquisitionMode' => $realProperty['acquisitionMode'],
					'acquisitionCost' => $realProperty['acquisitionCost'],
				]);
			}

			PersonalProperty::where('salnID', $salnID)->delete();
			foreach($form['personalProperties'] ?? [] as $personalProperty) {
				PersonalProperty::create([
					'salnID' => $salnID,
					'personalPropertyID' => $personalProperty['personalPropertyID'],
					'description' => $personalProperty['description'],
					'yearAcquired' => $personalProperty['yearAcquired'],
					'acquisitionCost' => $personalProperty['acquisitionCost'],
				]);
			}

			Liability::where('salnID', $salnID)->delete();
			foreach($form['liabilities'] ?? [] as $liability) {
				Liability::create([
					'salnID' => $salnID,
					'liabilityID' => $liability['liabilityID'],
					'nature' => $liability['nature'],
					'creditors' => $liability['creditors'],
					'outstandingBalance' => $liability['outstandingBalance'],
				]);
			}

			Connection::where('salnID', $salnID)->delete();
			foreach($form['connections'] ?? [] as $connection) {
				Connection::create([
					'salnID' => $salnID,
					'connectionID' => $connection['connectionID'],
					'name' => $connection['name'],
					'businessAddress' => $connection['businessAddress'],
					'nature' => $connection['nature'],
					'dateOfAcquisition' => $connection['dateOfAcquisition'],
				]);
			}

			Relative::where('salnID', $salnID)->delete();
			foreach($form['relatives'] ?? [] as $relative) {
				Relative::create([
					'salnID' => $salnID,
					'relativeID' => $relative['relativeID'],
					'name' => $relative['name'],
					'relationship' => $relative['relationship'],
					'position' => $relative['position'],
					'agency' => $relative['agency'],
				]);
				}

			DB::commit();
			return response()->json([
				'status' => 'success',
				'updatedAt' => $saln->updatedAt->toISOString(),
				'salnID' => $saln->salnID
			], 200);
		} catch (\Exception $e) {
			DB::rollBack();
			return response()->json([
				'status' => 'error',
				'message' => $e->getMessage()
			], 500);
		}
	}
}
