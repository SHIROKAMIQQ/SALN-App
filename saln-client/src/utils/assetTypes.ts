// Enum-like pattern for asset categories in the SALN app

export enum AssetTypes {
  UNMARRIED_CHILDREN = "Unmarried Children",
  REAL_PROPERTY = "Real Properties",
  PERSONAL_PROPERTY = "Personal Properties",
  LIABILITY = "Liabilities",
  CONNECTION = "Connections",
  RELATIVE = "Relatives"
};

export const AssetFields = {
  [AssetTypes.UNMARRIED_CHILDREN]: [
    {label: "Name", inputName: "Name"},
    {label: "Date of Birth", inputName: "DoB"},
    {label: "Age", inputName: "Age"}
  ],
  [AssetTypes.REAL_PROPERTY]: [
    {label: "Description", subtext: "(e.g. lot, house and lot, condominium, and improvements)", inputName: "Description"},
    {label: "Kind", subtext: "(e.g. residential, commericial, industrial, agricultural and mixed used)", inputName: "Kind"},
    {label: "Exact Location", inputName: "ExactLocation"},
    {label: "Assessed Value", subtext: "(As found in the Tax Declaration of Real Property)", intputName: "AssessedValue"},
    {label: "Current Fair Market Value", subtext: "(As found in the Tax Declaration of Real Property)", inputName: "CurrentFairMarketValue"},
    {label: "Acquisition Year", inputName: "AcquisitionYear"},
    {label: "Acquisition Mode", inputName: "AcquisitionMode"},
    {label: "Acquisition Cost", inputName: "AcquisitionCost"}
  ],
  [AssetTypes.PERSONAL_PROPERTY]: [
    {label: "Description", inputName: "Description"},
    {label: "Year Acquired", inputName: "YearAcquired"},
    {label: "Acquisition Cost/Amount", inputName: "AcqusitionCost"}
  ],
  [AssetTypes.LIABILITY]: [
    {label: "Nature", inputName: "Nature"},
    {label: "Name of Creditors", inputName: "Creditors"},
    {label: "Outstanding Balance", inputName: "OutstandingBalance"}
  ],
  [AssetTypes.CONNECTION]: [
    {label: "Name of Entity/Business Enterprise", inputName: "Name"},
    {label: "Business Address", inputName: "BusinessAddress"},
    {label: "Nature of Business Interest & / or Financial Connection", inputName: "Nature"},
    {label: "Date of Acquisition of Interest or Connection", inputName: "DateOfAcquisition"}
  ],
  [AssetTypes.RELATIVE]: [
    {label: "Name of Relative", inputName: "Name"},
    {label: "Relationship", inputName: "Relationship"},
    {label: "Position", inputName: "Position"},
    {label: "Name of Agency/Office and Address", inputName: "Agency"}
  ]
};

// Optional utility if you need a list
export const ASSET_TYPE_LIST = Object.values(AssetTypes);
