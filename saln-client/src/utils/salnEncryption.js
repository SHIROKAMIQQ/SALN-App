import { getCryptoKeyFromBase64, encryptStringWithCryptoKey, decryptStringWithCryptoKey,  } from "./subtleCrypto.js";
// import { salnFormData, personalInfo, child, realProperty, personalProperty, liability, connection, relative } from "./assetTypes.ts";

/** 
 * @param { personalInfo } personalInfo 
 * @param { CryptoKey } key 
 * @returns { personalInfo } encryptedPersonalInfo
 */
async function encryptPersonalInfo(personalInfo, key) {
  const out = {...personalInfo};
  out.filingType = await encryptStringWithCryptoKey(out.filingType, key);
  out.declarantName = await encryptStringWithCryptoKey(out.declarantName, key);
  out.address = await encryptStringWithCryptoKey(out.address, key);
  out.position = await encryptStringWithCryptoKey(out.position, key);
  out.agency = await encryptStringWithCryptoKey(out.agency, key);
  out.officeAddress = await encryptStringWithCryptoKey(out.officeAddress, key);
  out.spouseName = await encryptStringWithCryptoKey(out.spouseName, key);
  out.spousePosition = await encryptStringWithCryptoKey(out.spousePosition, key);
  out.spouseAgency = await encryptStringWithCryptoKey(out.spouseAgency, key);
  out.spouseOfficeAddress = await encryptStringWithCryptoKey(out.spouseOfficeAddress, key);
  return out;
}

/** 
 * @param { child } child 
 * @param { CryptoKey } key
 * @returns { child } encryptedChild 
 */
async function encryptChild(child, key) {
  const out = {...child};
  out.name = await encryptStringWithCryptoKey(out.name, key);
  out.dob = await encryptStringWithCryptoKey(out.dob, key);
  out.age = await encryptStringWithCryptoKey(out.age, key);
  return out;
}

/** 
 * @param { realProperty } realProperty 
 * @param { CryptoKey } key 
 * @returns { realProperty } encryptedRealProperty
 */
async function encryptRealProperty(realProperty, key) {
  const out = {...realProperty};
  out.description = await encryptStringWithCryptoKey(out.description, key);
  out.kind = await encryptStringWithCryptoKey(out.kind, key);
  out.exactLocation = await encryptStringWithCryptoKey(out.exactLocation, key);
  out.assessedValue = await encryptStringWithCryptoKey(out.assessedValue, key);
  out.currentFairMarketValue = await encryptStringWithCryptoKey(out.currentFairMarketValue, key);
  out.acquisitionYear = await encryptStringWithCryptoKey(out.acquisitionYear, key);
  out.acquisitionMode = await encryptStringWithCryptoKey(out.acquisitionMode, key);
  out.acquisitionCost = await encryptStringWithCryptoKey(out.acquisitionCost, key);
  return out;
}

/** 
 * @param { personalProperty } personalProperty 
 * @param { CryptoKey } key
 * @returns { personalProperty } encryptedPersonalProperty 
 */
async function encryptPersonalProperty(personalProperty, key) {
  const out = {...personalProperty};
  out.description = await encryptStringWithCryptoKey(out.description, key);
  out.yearAcquired = await encryptStringWithCryptoKey(out.yearAcquired, key);
  out.acquisitionCost = await encryptStringWithCryptoKey(out.acquisitionCost, key);
  return out;
}

/** 
 * @param { liability } liability 
 * @param { CryptoKey } key 
 * @returns { liability } encryptedLiability
 */
async function encryptLiability(liability, key) {
  const out = {...liability};
  out.nature = await encryptStringWithCryptoKey(out.nature, key);
  out.creditors = await encryptStringWithCryptoKey(out.creditors, key);
  out.outstandingBalance = await encryptStringWithCryptoKey(out.outstandingBalance, key);
  return out;
}

/**
 * @param { connection } connection 
 * @param { CryptoKey } key 
 * @returns { connection } encryptedConnection
 */
async function encryptConnection(connection, key) {
  const out = {...connection};
  out.name = await encryptStringWithCryptoKey(out.name, key);
  out.businessAddress = await encryptStringWithCryptoKey(out.businessAddress, key);
  out.nature = await encryptStringWithCryptoKey(out.nature, key);
  out.dateOfAcquisition = await encryptStringWithCryptoKey(out.dateOfAcquisition, key);
  return out;
}

/**
 * @param { relative } relative 
 * @param { CryptoKey } key 
 * @returns { relative } encryptedRelative 
 */
async function encryptRelative(relative, key) {
  const out = {...relative};
  out.name = await encryptStringWithCryptoKey(out.name, key);
  out.relationship = await encryptStringWithCryptoKey(out.relationship, key);
  out.position = await encryptStringWithCryptoKey(out.position, key);
  out.agency = await encryptStringWithCryptoKey(out.agency, key);
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
    const encryptedChild = await encryptChild(child, key);
    out.children.push(encryptedChild);
  }

  out.realProperties = [];
  for (const realProperty of formData.realProperties) {
    const encryptedRealProperty = await encryptRealProperty(realProperty, key);
    out.realProperties.push(encryptedRealProperty);
  }

  out.personalProperties = [];
  for (const personalProperty of formData.personalProperties) {
    const encryptedPersonalProperty = await encryptPersonalProperty(personalProperty, key);
    out.personalProperties.push(encryptedPersonalProperty);
  }

  out.liabilities = [];
  for (const liability of formData.liabilities) {
    const encryptedLiability = await encryptLiability(liability, key);
    out.liabilities.push(encryptedLiability);
  }

  out.connections = [];
  for (const connection of formData.connections) {
    const encryptedConnection = await encryptConnection(connection, key);
    out.connections.push(encryptedConnection);
  }

  out.relatives = [];
  for (const relative of formData.relatives) {
    const encryptedRelative = await encryptRelative(relative, key);
    out.relatives.push(encryptedRelative);
  }

  return out;
}

/** 
 * @param { personalInfo } personalInfo 
 * @param { CryptoKey } key 
 * @returns { personalInfo } decryptedPersonalInfo
 */
async function decryptPersonalInfo(personalInfo, key) {
  const out = {...personalInfo};
  out.filingType = await decryptStringWithCryptoKey(out.filingType, key);
  out.declarantName = await decryptStringWithCryptoKey(out.declarantName, key);
  out.address = await decryptStringWithCryptoKey(out.address, key);
  out.position = await decryptStringWithCryptoKey(out.position, key);
  out.agency = await decryptStringWithCryptoKey(out.agency, key);
  out.officeAddress = await decryptStringWithCryptoKey(out.officeAddress, key);
  out.spouseName = await decryptStringWithCryptoKey(out.spouseName, key);
  out.spousePosition = await decryptStringWithCryptoKey(out.spousePosition, key);
  out.spouseAgency = await decryptStringWithCryptoKey(out.spouseAgency, key);
  out.spouseOfficeAddress = await decryptStringWithCryptoKey(out.spouseOfficeAddress, key);
  return out;
}

/** 
 * @param { child } child 
 * @param { CryptoKey } key
 * @returns { child } decryptedChild 
 */
async function decryptChild(child, key) {
  const out = {...child};
  out.name = await decryptStringWithCryptoKey(out.name, key);
  out.dob = await decryptStringWithCryptoKey(out.dob, key);
  out.age = await decryptStringWithCryptoKey(out.age, key);
  return out;
}

/** 
 * @param { realProperty } realProperty 
 * @param { CryptoKey } key 
 * @returns { realProperty } decryptedRealProperty
 */
async function decryptRealProperty(realProperty, key) {
  const out = {...realProperty};
  out.description = await decryptStringWithCryptoKey(out.description, key);
  out.kind = await decryptStringWithCryptoKey(out.kind, key);
  out.exactLocation = await decryptStringWithCryptoKey(out.exactLocation, key);
  out.assessedValue = await decryptStringWithCryptoKey(out.assessedValue, key);
  out.currentFairMarketValue = await decryptStringWithCryptoKey(out.currentFairMarketValue, key);
  out.acquisitionYear = await decryptStringWithCryptoKey(out.acquisitionYear, key);
  out.acquisitionMode = await decryptStringWithCryptoKey(out.acquisitionMode, key);
  out.acquisitionCost = await decryptStringWithCryptoKey(out.acquisitionCost, key);
  return out;
}

/** 
 * @param { personalProperty } personalProperty 
 * @param { CryptoKey } key
 * @returns { personalProperty } decryptedPersonalProperty 
 */
async function decryptPersonalProperty(personalProperty, key) {
  const out = {...personalProperty};
  out.description = await decryptStringWithCryptoKey(out.description, key);
  out.yearAcquired = await decryptStringWithCryptoKey(out.yearAcquired, key);
  out.acquisitionCost = await decryptStringWithCryptoKey(out.acquisitionCost, key);
  return out;
}

/** 
 * @param { liability } liability 
 * @param { CryptoKey } key 
 * @returns { liability } decryptedLiability
 */
async function decryptLiability(liability, key) {
  const out = {...liability};
  out.nature = await decryptStringWithCryptoKey(out.nature, key);
  out.creditors = await decryptStringWithCryptoKey(out.creditors, key);
  out.outstandingBalance = await decryptStringWithCryptoKey(out.outstandingBalance, key);
  return out;
}

/**
 * @param { connection } connection 
 * @param { CryptoKey } key 
 * @returns { connection } decryptedConnection
 */
async function decryptConnection(connection, key) {
  const out = {...connection};
  out.name = await decryptStringWithCryptoKey(out.name, key);
  out.businessAddress = await decryptStringWithCryptoKey(out.businessAddress, key);
  out.nature = await decryptStringWithCryptoKey(out.nature, key);
  out.dateOfAcquisition = await decryptStringWithCryptoKey(out.dateOfAcquisition, key);
  return out;
}

/**
 * @param { relative } relative 
 * @param { CryptoKey } key 
 * @returns { relative } decryptedRelative 
 */
async function decryptRelative(relative, key) {
  const out = {...relative};
  out.name = await decryptStringWithCryptoKey(out.name, key);
  out.relationship = await decryptStringWithCryptoKey(out.relationship, key);
  out.position = await decryptStringWithCryptoKey(out.position, key);
  out.agency = await decryptStringWithCryptoKey(out.agency, key);
  return out;
}

/**
 * @param { salnFormData } formData 
 * @param { string } keyBase64 
 * @returns { salnFormData } decryptedFormData
 */
export async function decryptSalnForm(formData, keyBase64){
  if (!keyBase64) throw new Error("No base64 key provided for encryptFields");
  const key = await getCryptoKeyFromBase64(keyBase64);
  const out = {...formData};

  out.personalInfo = await decryptPersonalInfo(formData.personalInfo, key);
  
  out.children = [];
  for (const child of formData.children) {
    const decryptedChild = await decryptChild(child, key);
    out.children.push(decryptedChild);
  }

  out.realProperties = [];
  for (const realProperty of formData.realProperties) {
    const decryptedRealProperty = await decryptRealProperty(realProperty, key);
    out.realProperties.push(decryptedRealProperty);
  }

  out.personalProperties = [];
  for (const personalProperty of formData.personalProperties) {
    const decryptedPersonalProperty = await decryptPersonalProperty(personalProperty, key);
    out.personalProperties.push(decryptedPersonalProperty);
  }

  out.liabilities = [];
  for (const liability of formData.liabilities) {
    const decryptedLiability = await decryptLiability(liability, key);
    out.liabilities.push(decryptedLiability);
  }

  out.connections = [];
  for (const connection of formData.connections) {
    const decryptedConnection = await decryptConnection(connection, key);
    out.connections.push(decryptedConnection);
  }

  out.relatives = [];
  for (const relative of formData.relatives) {
    const decryptedRelative = await decryptRelative(relative, key);
    out.relatives.push(decryptedRelative);
  }

  return out;
}