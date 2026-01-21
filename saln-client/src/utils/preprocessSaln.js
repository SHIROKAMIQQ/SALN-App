import { v4 as uuidv4 } from "uuid";
import { namePattern, agePattern, datePattern, costPattern, commaCost, yearPattern } from "./assetTypes.ts";

function validatePersonalInformation (obj) {

	const filingType = 'filingType' in obj ? obj.filingType : "";
	const declarantFamilyName = 'declarantFamilyName' in obj ? obj.declarantFamilyName : "";
	const declarantFirstName = 'declarantFirstName' in obj ? obj.declarantFirstName : "";
	const declarantMI = 'declarantMI' in obj ? obj.declarantMI : "";
	const address = 'address' in obj ? obj.address : "";
	const position = 'position' in obj ? obj.position : "";
	const agency = 'agency' in obj ? obj.agency : "";
	const officeAddress = 'officeAddress' in obj ? obj.officeAddress : "";
	const spouseFamilyName = 'spouseFamilyName' in obj ? obj.spouseFamilyName : "";
	const spouseFirstName = 'spouseFirstName' in obj ? obj.spouseFirstName : "";
	const spouseMI = 'spouseMI' in obj ? obj.spouseMI : "";
	const spousePosition = 'spousePosition' in obj ? obj.spousePosition : "";
	const spouseAgency = 'spouseAgency' in obj ? obj.spouseAgency : "";
	const spouseOfficeAddress = 'spouseOfficeAddress' in obj ? obj.spouseOfficeAddress : "";
	
	if (!(["Not Applicable", "Joint Filing", "Separate Filing"].includes(filingType))) {
		alert("Invalid Personal Information. Filing Type is invalid/missing.");
		return false;
	}
	if (!declarantFamilyName || !declarantFirstName) {
		alert("Missing declarant name fields.");
		return false;
	}
	if (!address) {
		alert ("Invalid Personal Information. Missing address.");
		return false;
	}
	if (!position) {
		alert("Invalid Personal Information. Missing Position.");
		return false;
	}
	if (!agency) {
		alert("Invalid Personal Information. Missing Agency");
		return false;
	}
	if (!officeAddress) {
		alert("Invalid Personal Information. Missing Office Address.");
		return false;
	}

	if (!(
		(!spouseFamilyName && !spouseFirstName && !spouseMI && !spousePosition && !spouseAgency && !spouseOfficeAddress) ||
		(spouseFamilyName && spouseFirstName && spousePosition && spouseAgency && spouseOfficeAddress)
	)) {
		alert("Invalid Personal Information. If a Spouse field is filled, then all Spouse fields must be filled.");
		return false;
	}

	return true;
} 

function validateChild(obj, i) {
	const name = 'name' in obj ? obj.name : "";
	const dob = 'dob' in obj ? obj.dob : "";
	const age = 'age' in obj ? obj.age  : "";

	if (!name) {
		alert(`Invalid Child ${i}. Missing Name.`);
		return false;
	}

	if (!dob || !datePattern.test(dob)) {
		alert(`Invalid Child ${i}. Date of Birth is missing is of invalid format (YYYY-MM-DD).`);
		return false;
	}

	const todayChecker = new Date();
	const dobChecker = new Date(dob);
	let dobageChecker = todayChecker.getFullYear() - dobChecker.getFullYear();
	const m = todayChecker.getMonth() - dobChecker.getMonth();
	if (m < 0 || (m === 0 && todayChecker.getDate() < dobChecker.getDate())) dobageChecker--;
	if (dobageChecker >= 18 || todayChecker < dobChecker) {
		alert(`Invalid Child ${i}. Child with this Date of Birth can't be less than 18 years old.`);
		return false;
	}

	if (
		!age ||
		!agePattern.test(age)
	) {
		alert(`Invalid Child ${i}. Child has a missing age or age is non-numeric (XX).`);
		return false;
	}

	const ageNumber = Number(age);
	if (ageNumber >= 18) {
		alert(`Invalid Child ${i}. Child must be less than 18 years old.`);
		return false;
	}

	return true;
}

function validateRealProperty(obj, i) {

	const description = 'description' in obj ? obj.description : "";
	const kind = 'kind' in obj ? obj.kind : "";
	const exactLocation = 'exactLocation' in obj ? obj.exactLocation : "";
	const assessedValue = 'assessedValue' in obj ? obj.assessedValue : "";
	const currentFairMarketValue = 'currentFairMarketValue' in obj ? obj.currentFairMarketValue : "";
	const acquisitionYear = 'acquisitionYear' in obj ? obj.acquisitionYear : "";
	const acquisitionMode = 'acquisitionMode' in obj ? obj.acquisitionMode : "";
	const acquisitionCost = 'acquisitionCost' in obj ? obj.acquisitionCost : "";

	if (!description) {
		alert(`Invalid Real Property ${i}. Missing Description.`);
		return false;
	}

	if (!kind) {
		alert(`Invalid Real Property ${i}. Missing Kind.`);
		return false;
	}

	if (!exactLocation) {
		alert(`Invalid Real Property ${i}. Missing Exact Location.`);
		return false;
	}
	
	if (
		!assessedValue || 
		!costPattern.test(assessedValue)
	) {
		alert(`Invalid Real Property ${i}. Assessed Value is missing or is not of proper format (X,XXX,XXX.XX)`);
		return false; 
	}
	obj.assessedValue = commaCost(assessedValue);

	if (
		!currentFairMarketValue ||
		!costPattern.test(currentFairMarketValue)
	) {
		alert(`Invalid Real Property ${i}. Current Fair Market Value is missing or is not of proper format (X,XXX,XXX.XX)`);
		return false;
	}
	obj.currentFairMarketValue = commaCost(currentFairMarketValue);

	if (
		!acquisitionYear ||
		!yearPattern.test(acquisitionYear)
	) {
		alert(`Invalid Real Property ${i}. Acquisition Year is missing or is not of proper format (YYYY)`);
		return false;
	}

	const today = new Date();
	const acqyear = new Date(obj.acquisitionYear);
	if (acqyear.getFullYear() > today.getFullYear()) {
		alert(`Invalid Real Property ${i}. Acquisition Year is after this year`);
		return false;
	}

	if (!acquisitionMode) {
		alert(`Invalid Real Property ${i}. Acquisition Mode is missing.`);
		return false; 
	}

	if (
		!acquisitionCost ||
		!costPattern.test(acquisitionCost)
	) {
		alert(`Invalid Real Property ${i}. Acquisition Cost is missing or is not of proper format (X,XXX,XXX.XX)`);
		return false;
	}
	obj.acquisitionCost = commaCost(acquisitionCost);

	return true;
}

function validatePersonalProperty(obj, i) {
	const description = 'description' in obj ? obj.description : "";
	const yearAcquired = 'yearAcquired' in obj ? obj.yearAcquired : "";
	const acquisitionCost = 'acquisitionCost' in obj ? obj.acquisitionCost : "";

	if (!description) {
		alert(`Invalid Personal Property ${i}. Missing Description.`);
		return false;
	}

	if (
		!yearAcquired ||
		!yearPattern.test(yearAcquired)
	) {
		alert(`Invalid Personal Property ${i}. Year Acquired is missing or is of improper format (YYYY).`);
		return false;
	}

	const today = new Date();
	const acqyear = new Date(yearAcquired);
	if (acqyear.getFullYear() > today.getFullYear()) {
		alert(`Invalid Personal Property ${i}. Year Acquired is after this year.`);
		return false;
	}

	if (
		!acquisitionCost ||
		!costPattern.test(acquisitionCost)
	) {
		alert(`Invalid Personal Property ${i}. Acquisition Cost is missing or is of improper format (X,XXX,XXX.XX).`);
		return false;
	}
	obj.acquisitionCost = commaCost(acquisitionCost);

	return true;
}

function validateLiability(obj, i) {
	const nature = 'nature' in obj ? obj.nature : "";
	const creditors = 'creditors' in obj ? obj.creditors : "";
	const outstandingBalance = 'outstandingBalance' in obj ? obj.outstandingBalance : "";

	if (!nature) {
		alert(`Invalid Liability ${i}. Missing Nature.`);
		return false;
	}

	if (!creditors) {
		alert(`Invalid Liability ${i}. Missing Creditors.`);
		return false;
	}

	if (
		!outstandingBalance ||
		!costPattern.test(outstandingBalance)
	) {
		alert(`Invalid Liability ${i}. Outstanding Balance is missing or is of improper format (X,XXX,XXX.XX).`);
		return false;
	}
	obj.outstandingBalance = commaCost(outstandingBalance);

	return true;
}

function validateConnection(obj, i) {
	const name = 'name' in obj ? obj.name : "";
	const businessAddress = 'businessAddress' in obj ? obj.businessAddress : "";
	const nature = 'nature' in obj ? obj.nature : "";
	const dateOfAcquisition = 'dateOfAcquisition' in obj ? obj.dateOfAcquisition : "";

	if (!name) {
		alert(`Invalid Connection ${i}. Missing Name.`);
		return false;
	}

	if (!businessAddress) {
		alert(`Invalid Connection ${i}. Missing Business Address.`);
		return false;
	}

	if (!nature) {
		alert(`Invalid Connection ${i}. Missing Nature.`);
		return false;
	}
	
	if(
			!dateOfAcquisition ||
			!yearPattern.test(dateOfAcquisition)
	) {
		alert(`Invalid Connection ${i}. Date of Acquisition is missing or is of improper format (YYYY).`);
		return false;
	}

	const today = new Date();
	const acqyear = new Date(dateOfAcquisition);
	if (acqyear.getFullYear() > today.getFullYear()) {
		alert(`Invalid Connection ${i}. Date of Acquisition after this year.`);
		return false;
	}

	return true;
}

function validateRelative(obj, i) {
	const name = 'name' in obj ? obj.name : "";
	const relationship = 'relationship' in obj ? obj.relationship : "";
	const position = 'position' in obj ? obj.position : "";
	const agency = 'agency' in obj ? obj.agency : "";
	
	if (!name) {
		alert(`Invalid Relative ${i}. Missing Name`);
		return false;
	}

	if (!relationship) {
		alert(`Invalid Relative ${i}. Missing Relationship`);
		return false;
	}

	if (!position) {
		alert(`Invalid Relative ${i}. Missing Position`);
		return false;
	}

	if (!agency) {
		alert(`Invalid Relative ${i}. Missing Agency`);
		return false;
	}

	return true;
}

export function preprocessJSON(obj) {
	console.log("OBJ", obj);
	// Clone obj with a new salnID and updatedAt field
	obj = {
			...obj,
			salnID: uuidv4(),
			updatedAt: new Date().toISOString().replace('T', ' ').replace('Z', '').split('.')[0]
	}

	// Check if personalInformation is valid.
	obj.personalInfo ||= {};
	if (!validatePersonalInformation(obj.personalInfo)) throw new Error("Invalid Personal Information.");
	obj.personalInfo.spouseName ||= "";
	obj.personalInfo.spousePosition ||= "";
	obj.personalInfo.spouseAgency ||= "";
	obj.personalInfo.spouseOfficeAddress ||= "";

	// Check if each child is valid.
	obj.children ||= [];
	for (const [index, child] of obj.children.entries()) {
		obj.children[index] = {...child, unmarriedChildID: uuidv4()};
		if (!validateChild(child, index)) throw new Error(`Invalid Child at Index ${index}.`);
	}

	// Check if each realProperty is valid.
	obj.realProperties ||= [];
	for (const [index, realProperty] of obj.realProperties.entries()) {
		obj.realProperties[index] = {...realProperty, realPropertyID: uuidv4()};
		if (!validateRealProperty(realProperty, index)) throw new Error(`Invalid Real Property at Index ${index}.`);
	}

	// Check if each personalProperty is valid.
	obj.personalProperties ||= [];
	for (const [index, personalProperty] of obj.personalProperties.entries()) {
		obj.personalProperties[index] = {...personalProperty, personalPropertyID: uuidv4()};
		if (!validatePersonalProperty(personalProperty, index)) throw new Error(`Invalid Personal Property at Index ${index}.`);
	}

	// Check if each liability is valid.
	obj.liabilities ||= [];
	for (const [index, liability] of obj.liabilities.entries()) {
		obj.liabilities[index] = {...liability, liabilityID: uuidv4()};
		if (!validateLiability(liability, index)) throw new Error(`Invalid Liability at Index ${index}.`);
	}

	// Check if each connection is valid.
	obj.connections ||= [];
	for (const [index, connection] of obj.connections.entries()) {
		obj.connections[index] = {...connection, connectionID: uuidv4()};
		if (!validateConnection(connection, index)) throw new Error(`Invalid Connection at Index ${index}`);
	}

	obj.relatives ||= [];
	for (const [index, relative] of obj.relatives.entries()) {
		obj.relatives[index] = {...relative, relativeID: uuidv4()};
		if (!validateRelative(relative, index)) throw new Error(`Invalid Relative at Index ${index}`);
	}

	return obj;
}