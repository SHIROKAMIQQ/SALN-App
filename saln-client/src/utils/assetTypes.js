// Enum-like pattern for asset categories in the SALN app

export const AssetTypes = Object.freeze({
  REAL_PROPERTY: "Real Property",
  PERSONAL_PROPERTY: "Personal Property",
  LIABILITY: "Liability",
  CONNECTION: "Connection",
  RELATIVE: "Relative"
});

// Optional utility if you need a list
export const ASSET_TYPE_LIST = Object.values(AssetTypes);
