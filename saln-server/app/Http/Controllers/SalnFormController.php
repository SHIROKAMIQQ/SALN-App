<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\SALNForm;
use App\Models\UnmarriedChild;
use App\Models\RealProperty;
use App\Models\PersonalProperty;
use App\Models\Liability;
use App\Models\Connection;
use App\Models\Relative;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

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
				$saln->$key = Crypt::encryptString($value);
			}

			$saln->save();
			$salnID = $saln->salnID;

			UnmarriedChild::where('salnID', $salnID)->delete();
			foreach($form['children'] ?? [] as $child) {
				UnmarriedChild::create([
					'salnID' => $salnID,
					'unmarriedChildID' => $child['unmarriedChildID'],
					'name' => Crypt::encryptString($child['name']),
					'dob' => Crypt::encryptString($child['dob']),
					'age' => Crypt::encryptString($child['age']),
				]);
			}

			RealProperty::where('salnID', $salnID)->delete();
			foreach($form['realProperties'] ?? [] as $realProperty) {
				RealProperty::create([
					'salnID' => $salnID,
					'realPropertyID' => $realProperty['realPropertyID'],
					'description' => Crypt::encryptString($realProperty['description']),
					'kind' => Crypt::encryptString($realProperty['kind']),
					'exactLocation' => Crypt::encryptString($realProperty['exactLocation']),
					'assessedValue' => Crypt::encryptString($realProperty['assessedValue']),
					'currentFairMarketValue' => Crypt::encryptString($realProperty['currentFairMarketValue']),
					'acquisitionYear' => Crypt::encryptString($realProperty['acquisitionYear']),
					'acquisitionMode' => Crypt::encryptString($realProperty['acquisitionMode']),
					'acquisitionCost' => Crypt::encryptString($realProperty['acquisitionCost']),
					'nondeclarantExclusive' => Crypt::encryptString($realProperty['nondeclarantExclusive']),
				]);
			}

			PersonalProperty::where('salnID', $salnID)->delete();
			foreach($form['personalProperties'] ?? [] as $personalProperty) {
				PersonalProperty::create([
					'salnID' => $salnID,
					'personalPropertyID' => $personalProperty['personalPropertyID'],
					'description' => Crypt::encryptString($personalProperty['description']),
					'yearAcquired' => Crypt::encryptString($personalProperty['yearAcquired']),
					'acquisitionCost' => Crypt::encryptString($personalProperty['acquisitionCost']),
					'nondeclarantExclusive' => Crypt::encryptString($personalProperty['nondeclarantExclusive']),
				]);
			}

			Liability::where('salnID', $salnID)->delete();
			foreach($form['liabilities'] ?? [] as $liability) {
				Liability::create([
					'salnID' => $salnID,
					'liabilityID' => $liability['liabilityID'],
					'nature' => Crypt::encryptString($liability['nature']),
					'creditors' => Crypt::encryptString($liability['creditors']),
					'outstandingBalance' => Crypt::encryptString($liability['outstandingBalance']),
					'nondeclarantExclusive' => Crypt::encryptString($liability['nondeclarantExclusive']),
				]);
			}

			Connection::where('salnID', $salnID)->delete();
			foreach($form['connections'] ?? [] as $connection) {
				Connection::create([
					'salnID' => $salnID,
					'connectionID' => $connection['connectionID'],
					'name' => Crypt::encryptString($connection['name']),
					'businessAddress' => Crypt::encryptString($connection['businessAddress']),
					'nature' => Crypt::encryptString($connection['nature']),
					'dateOfAcquisition' => Crypt::encryptString($connection['dateOfAcquisition']),
					'nondeclarantExclusive' => Crypt::encryptString($connection['nondeclarantExclusive']),
				]);
			}

			Relative::where('salnID', $salnID)->delete();
			foreach($form['relatives'] ?? [] as $relative) {
				Relative::create([
					'salnID' => $salnID,
					'relativeID' => $relative['relativeID'],
					'name' => Crypt::encryptString($relative['name']),
					'relationship' => Crypt::encryptString($relative['relationship']),
					'position' => Crypt::encryptString($relative['position']),
					'agency' => Crypt::encryptString($relative['agency']),
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

	public function deleteSaln(Request $request)
	{
		$validated = $request->validate([
			'salnID' => 'required|string',
			'employeeID' => 'required|string',
		]);

		$salnID = $validated['salnID'];
		$employeeID = $validated['employeeID'];

		DB::beginTransaction();
		try {
			$saln = SALNForm::where('salnID', $salnID)
				->where('employeeID', $employeeID)
				->first();

			if (!$saln) {
				return response()->json([
					'status' => 'not_found'
				], 404);
			}

			$saln->delete(); // Should cascade into assets

			DB::commit();

			return response()->json([
				'status' => 'success'
			], 200);
		} catch (\Exception $e) {
			DB::rollBack();
			return response()->json([
				'status' => 'error',
				'message' => $e->getMessage(),
			], 500);
		}
	}

	public function getEmployeeSalns(Request $request)
	{
		$validated = $request->validate([
			'employeeID' => 'required|string',
		]);

		$employeeID = $validated['employeeID'];

		try {
			$employee = Employee::where('employeeID', $employeeID)
				->with([
					'salnForms.unmarriedChildren',
					'salnForms.realProperties',
					'salnForms.personalProperties',
					'salnForms.liabilities',
					'salnForms.relatives',
					'salnForms.connections',
						])
				->first();

			if (!$employee) {
				return response()->json([
					'status' => 'error',
					'message' => 'Employee not found'
				], 404);
			}

			$salnData = $employee->salnForms->map(function ($saln) {

				// helper closure (kept inside map for clarity)
				$decrypt = function ($value) {
					if (empty($value)) {
						return "";
					}

					try {
						return Crypt::decryptString($value);
					} catch (\Exception $e) {
						return "";
					}
				};

				$salnJSON = $saln->toArray();

				/**
				 * PERSONAL INFORMATION
				 */
				$salnJSON['personalInfo'] = [
					'filingType' => $decrypt($salnJSON['filingType'] ?? ""),
					'declarantFamilyName' => $decrypt($salnJSON['declarantFamilyName'] ?? ""),
					'declarantFirstName' => $decrypt($salnJSON['declarantFirstName'] ?? ""),
					'declarantMI' => $decrypt($salnJSON['declarantMI'] ?? ""),
					'address' => $decrypt($salnJSON['address'] ?? ""),
					'agency' => $decrypt($salnJSON['agency'] ?? ""),
					'position' => $decrypt($salnJSON['position'] ?? ""),
					'officeAddress' => $decrypt($salnJSON['officeAddress'] ?? ""),
					'spouseFamilyName' => $decrypt($salnJSON['spouseFamilyName'] ?? ""),
					'spouseFirstName' => $decrypt($salnJSON['spouseFirstName'] ?? ""),
					'spouseMI' => $decrypt($salnJSON['spouseMI'] ?? ""),
					'spousePosition' => $decrypt($salnJSON['spousePosition'] ?? ""),
					'spouseAgency' => $decrypt($salnJSON['spouseAgency'] ?? ""),
					'spouseOfficeAddress' => $decrypt($salnJSON['spouseOfficeAddress'] ?? ""),
				];

				unset(
					$salnJSON['filingType'],
					$salnJSON['declarantFamilyName'],
					$salnJSON['declarantFirstName'],
					$salnJSON['declarantMI'],
					$salnJSON['address'],
					$salnJSON['agency'],
					$salnJSON['position'],
					$salnJSON['officeAddress'],
					$salnJSON['spouseFamilyName'],
					$salnJSON['spouseFirstName'],
					$salnJSON['spouseMI'],
					$salnJSON['spousePosition'],
					$salnJSON['spouseAgency'],
					$salnJSON['spouseOfficeAddress']
				);

					/**
					 * CHILDREN
					 */
					$salnJSON['children'] = collect($salnJSON['unmarried_children'] ?? [])
						->map(function ($child) use ($decrypt) {
							return [
								'name' => $decrypt($child['name'] ?? ""),
								'dob' => $decrypt($child['dob'] ?? ""),
								'age' => $decrypt($child['age'] ?? ""),
							];
						})
						->toArray();

					unset($salnJSON['unmarried_children']);

					/**
					 * REAL PROPERTIES
					 */
					$salnJSON['realProperties'] = collect($salnJSON['real_properties'] ?? [])
						->map(function ($property) use ($decrypt) {
							return [
								'description' => $decrypt($property['description'] ?? ""),
								'kind' => $decrypt($property['kind'] ?? ""),
								'exactLocation' => $decrypt($property['exactLocation'] ?? ""),
								'assessedValue' => $decrypt($property['assessedValue'] ?? ""),
								'currentFairMarketValue' => $decrypt($property['currentFairMarketValue'] ?? ""),
								'acquisitionYear' => $decrypt($property['acquisitionYear'] ?? ""),
								'acquisitionMode' => $decrypt($property['acquisitionMode'] ?? ""),
								'acquisitionCost' => $decrypt($property['acquisitionCost'] ?? ""),
								'nondeclarantExclusive' => $decrypt($property['nondeclarantExclusive'] ?? ""),
							];
						})
						->toArray();

					unset($salnJSON['real_properties']);

					/**
					 * PERSONAL PROPERTIES
					 */
					$salnJSON['personalProperties'] = collect($salnJSON['personal_properties'] ?? [])
						->map(function ($property) use ($decrypt) {
							return [
								'description' => $decrypt($property['description'] ?? ""),
								'yearAcquired' => $decrypt($property['yearAcquired'] ?? ""),
								'acquisitionCost' => $decrypt($property['acquisitionCost'] ?? ""),
								'nondeclarantExclusive' => $decrypt($property['nondeclarantExclusive'] ?? ""),
							];
						})
						->toArray();

					unset($salnJSON['personal_properties']);

					/**
					 * LIABILITIES
					 */
					$salnJSON['liabilities'] = collect($salnJSON['liabilities'] ?? [])
						->map(function ($liability) use ($decrypt) {
							return [
								'nature' => $decrypt($liability['nature'] ?? ""),
								'creditors' => $decrypt($liability['creditors'] ?? ""),
								'outstandingBalance' => $decrypt($liability['outstandingBalance'] ?? ""),
								'nondeclarantExclusive' => $decrypt($liability['nondeclarantExclusive'] ?? ""),
							];
						})
						->toArray();

					/**
					 * RELATIVES
					 */
					$salnJSON['relatives'] = collect($salnJSON['relatives'] ?? [])
						->map(function ($relative) use ($decrypt) {
							return [
								'name' => $decrypt($relative['name'] ?? ""),
								'relationship' => $decrypt($relative['relative'] ?? ""),
								'position' => $decrypt($relative['position'] ?? ""),
								'agency' => $decrypt($relative['agency'] ?? ""),
							];
						})
						->toArray();

					/**
					 * CONNECTIONS
					 */
					$salnJSON['connections'] = collect($salnJSON['connections'] ?? [])
						->map(function ($connection) use ($decrypt) {
							return [
								'name' => $decrypt($connection['name'] ?? ""),
								'businessAddress' => $decrypt($connection['businessAddress'] ?? ""),
								'nature' => $decrypt($connection['nature'] ?? ""),
								'dateOfAcquisition' => $decrypt($connection['dateOfAcquisition'] ?? ""),
								'nondeclarantExclusive' => $decrypt($connection['nondeclarantExclusive'] ?? ""),
							];
						})
						->toArray();

					return $salnJSON;
			});

			return response()->json([
					'status' => 'success',
					'employeeID' => $employeeID,
					'salnForms' => $salnData,
			], 200);

		} catch (\Exception $e) {
				return response()->json([
						'status' => 'error',
						'message' => $e->getMessage()
				], 500);
		}
	}
}
