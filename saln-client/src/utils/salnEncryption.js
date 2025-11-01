import { getCryptoKeyFromBase64, encryptStringWithCryptoKey, decryptStringWithCryptoKey,  } from "./subtleCrypto";
import { salnFormData, personalInfo, child, realProperty, personalProperty, liability, connection, relative } from "./assetTypes.ts";

/** 
 * @param { personalInfo } personalInfo 
 * @param { CryptoKey } key 
 * @returns { personalInfo } encryptedPersonalInfo
 */
async function encryptPersonalInfo(personalInfo, key) {
  const out = {...personalInfo};
  out.filingType = encryptStringWithCryptoKey(out.filingType, key);
  out.declarantName = encryptStringWithCryptoKey(out.declarantName, key);
  out.address = encryptStringWithCryptoKey(out.address, key);
  out.position = encryptStringWithCryptoKey(out.position, key);
  out.officeAddress = encryptStringWithCryptoKey(out.officeAddress, key);
  out.spouseName = encryptStringWithCryptoKey(out.spouseName, key);
  out.spousePosition = encryptStringWithCryptoKey(out.spousePosition, key);
  out.spouseAgency = encryptStringWithCryptoKey(out.spouseAgency, key);
  out.spouseOfficeAddress = encryptStringWithCryptoKey(out.spouseOfficeAddress, key);
  return out;
}

/** 
 * @param { child } child 
 * @param { CryptoKey } key
 * @returns { child } encryptedChild 
 */
async function encryptChildren(child, key) {
  const out = {...child};
  out.name = encryptStringWithCryptoKey(out.name, key);
  out.dob = encryptStringWithCryptoKey(out.dob, key);
  out.age = encryptStringWithCryptoKey(out.age, key);
  return out;
}

/** 
 * @param { realProperty } realProperty 
 * @param { CryptoKey } key 
 * @returns { realProperty } encryptedRealProperty
 */
async function encryptRealProperty(realProperty, key) {
  const out = {...realProperty};
  out.description = encryptStringWithCryptoKey(out.description, key);
  out.kind = encryptStringWithCryptoKey(out.kind, key);
  out.exactLocation = encryptStringWithCryptoKey(out.exactLocation, key);
  out.assessedValue = encryptStringWithCryptoKey(out.assessedValue, key);
  out.currentFairMarketValue = encryptStringWithCryptoKey(out.currentFairMarketValue, key);
  out.acquisitionYear = encryptStringWithCryptoKey(out.acquisitionYear, key);
  out.acquisitionMode = encryptStringWithCryptoKey(out.acquisitionMode, key);
  out.acquisitionCost = encryptStringWithCryptoKey(out.acquisitionCost, key);
  return out;
}

/** 
 * @param { personalProperty } personalProperty 
 * @param { CryptoKey } key
 * @returns { personalProperty } encryptedPersonalProperty 
 */
async function encryptPersonalProperty(personalProperty, key) {
  const out = {...personalProperty};
  out.description = encryptStringWithCryptoKey(out.description, key);
  out.yearAcquired = encryptStringWithCryptoKey(out.yearAcquired, key);
  out.acquisitionCost = encryptStringWithCryptoKey(out.acquisitionCost, key);
  return out;
}

/** 
 * @param { liability } liability 
 * @param { CryptoKey } key 
 * @returns { liability } encryptedLiability
 */
async function encryptLiability(liability, key) {
  const out = {...liability};
  out.nature = encryptStringWithCryptoKey(out.nature, key);
  out.creditors = encryptStringWithCryptoKey(out.creditors, key);
  out.outstandingBalance = encryptStringWithCryptoKey(out.outstandingBalance, key);
  return out;
}

/**
 * @param { connection } connection 
 * @param { CryptoKey } key 
 * @returns { connection } encryptedConnection
 */
async function encryptConnection(connection, key) {
  const out = {...connection};
  out.name = encryptStringWithCryptoKey(out.name, key);
  out.businessAddress = encryptStringWithCryptoKey(out.businessAddress, key);
  out.nature = encryptStringWithCryptoKey(out.nature, key);
  out.dateOfAcquisition = encryptStringWithCryptoKey(out.dateOfAcquisition, key);
  return out;
}

/**
 * @param { relative } relative 
 * @param { CryptoKey } key 
 * @returns { relative } encryptedRelative 
 */
async function encryptRelative(relative, key) {
  const out = {...relative};
  out.name = encryptStringWithCryptoKey(out.name, key);
  out.relationship = encryptStringWithCryptoKey(out.relationship, key);
  out.position = encryptStringWithCryptoKey(out.position, key);
  out.agency = encryptStringWithCryptoKey(out.agency, key);
  return out;
}

/**
 * @param { salnFormData } formData 
 * @param { string } keyBase64
 * @returns { salnFormData } encrypted fields
 */
export async function encryptSalnForm(formData, keyBase64) {
  if (!keyBase64) throw new Error("No base64 key provided for encryptFields");
  const key = await getCryptoKeyFromBase64(keyBase64);
  const out = {...formData};

  out.personalInfo = await encryptPersonalInfo(formData.personalInfo, key);
  
  out.children = [];
  for (const child of formData.children) {
    encryptedChild = await encryptChild(child, key);
    out.children.push(encryptedChild);
  }

  out.realProperties = [];
  for (const realProperty of formData.realProperties) {
    encryptedRealProperty = await encryptRealProperty(realProperty, key);
    out.realProperties.push(encryptedRealProperty);
  }

  out.personalProperties = [];
  for (const personalProperty of formData.personalProperties) {
    encryptedPersonalProperty = await encryptPersonalProperty(personalProperty, key);
    out.personalProperties.push(encryptedPersonalProperty);
  }

  out.liabilities = [];
  for (const liability of formData.liabilities) {
    encryptedLiability = await encryptLiability(liability, key);
    out.liabilities.push(encryptedLiability);
  }

  out.connections = [];
  for (const connection of formData.connections) {
    encryptedConnection = await encryptConnection(connection, key);
    out.connections.push(encryptedConnection);
  }

  out.relatives = [];
  for (const relative of formData.relatives) {
    encryptedRelative = await encryptRelative(relative, key);
    out.relatives.push(encryptedRelative);
  }

  return out;
}