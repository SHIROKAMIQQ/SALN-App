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
    {
      label: "Name", 
      subtext: "Unmarried child below eighteen (18) years of age living in declarant's household", 
      inputName: "Name", 
      type: "text"
    },
    {
      label: "Date of Birth", 
      subtext: "Must be less than 18 years ago",
      inputName: "DoB", 
      type: "date"
    },
    {
      label: "Age", 
      subtext: "Must match Date of Birth",
      inputName: "Age", 
      type:"number"
    }
  ],
  [AssetTypes.REAL_PROPERTY]: [
    {
      label: "Description", 
      subtext: "(e.g. lot, house and lot, condominium, and improvements)", 
      inputName: "Description", 
      type:"text"
    },
    {
      label: "Kind", 
      subtext: "(e.g. residential, commericial, industrial, agricultural and mixed used)", 
      inputName: "Kind",
      type:"text"
    },
    {
      label: "Exact Location", 
      inputName: "ExactLocation",
      type: "text"
    },
    {
      label: "Assessed Value", 
      subtext: "(As found in the Tax Declaration of Real Property)", 
      inputName: "AssessedValue",
      type: "number"
    },
    {
      label: "Current Fair Market Value", 
      subtext: "(As found in the Tax Declaration of Real Property)", 
      inputName: "CurrentFairMarketValue",
      type: "number"
    },
    {
      label: "Acquisition Year", 
      inputName: "AcquisitionYear",
      type: "text"
    },
    {
      label: "Acquisition Mode", 
      inputName: "AcquisitionMode",
      type: "text"
    },
    {
      label: "Acquisition Cost", 
      inputName: "AcquisitionCost",
      type: "number"
    }
  ],
  [AssetTypes.PERSONAL_PROPERTY]: [
    {
      label: "Description", 
      inputName: "Description",
      type: "text"
    },
    {
      label: "Year Acquired",
      inputName: "YearAcquired",
      type: "number"
    },
    {
      label: "Acquisition Cost/Amount",
      inputName: "AcqusitionCost",
      type: "number"
    }
  ],
  [AssetTypes.LIABILITY]: [
    {
      label: "Nature", 
      inputName: "Nature",
      type: "text"
    },
    {
      label: "Name of Creditors", 
      inputName: "Creditors",
      type: "text"
    },
    {
      label: "Outstanding Balance", 
      inputName: "OutstandingBalance",
      type: "number"
    }
  ],
  [AssetTypes.CONNECTION]: [
    {
      label: "Name of Entity/Business Enterprise", 
      inputName: "Name",
      type: "text"
    },
    {
      label: "Business Address", 
      inputName: "BusinessAddress",
      type: "text"
    },
    {
      label: "Nature of Business Interest & / or Financial Connection", 
      inputName: "Nature",
      type: "text"
    },
    {
      label: "Date of Acquisition of Interest or Connection", 
      inputName: "DateOfAcquisition",
      type: "number"
    }
  ],
  [AssetTypes.RELATIVE]: [
    {
      label: "Name of Relative", 
      inputName: "Name",
      type: "text"
    },
    {
      label: "Relationship", 
      inputName: "Relationship",
      type: "text"
    },
    {
      label: "Position", 
      inputName: "Position",
      type: "text"
    },
    {
      label: "Name of Agency/Office and Address", 
      inputName: "Agency",
      type: "text"
    }
  ]
};

export const namePattern = /^[A-Za-z]+(?:\s[A-Za-z])?,\s[A-Za-z]+(?:\s[A-Za-z])?,\s[A-Za-z]\.$/

export const costPattern = /^(\d{1,3}(,\d{3})*|\d+)(\.\d{1,2})?$/

// Optional utility if you need a list
export const ASSET_TYPE_LIST = Object.values(AssetTypes);
