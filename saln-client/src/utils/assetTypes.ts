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
    },
    {
      label: "Date of Birth", 
      subtext: "Must be less than 18 years ago",
      inputName: "DoB", 
    },
    {
      label: "Age", 
      subtext: "Must match Date of Birth",
      inputName: "Age", 
    }
  ],
  [AssetTypes.REAL_PROPERTY]: [
    {
      label: "Description", 
      subtext: "(e.g. lot, house and lot, condominium, and improvements)", 
      inputName: "Description", 
    },
    {
      label: "Kind", 
      subtext: "(e.g. residential, commericial, industrial, agricultural and mixed used)", 
      inputName: "Kind",
    },
    {
      label: "Exact Location", 
      inputName: "ExactLocation",
    },
    {
      label: "Assessed Value", 
      subtext: "(As found in the Tax Declaration of Real Property) | At most 2 decimal places", 
      inputName: "AssessedValue",
    },
    {
      label: "Current Fair Market Value", 
      subtext: "(As found in the Tax Declaration of Real Property) | At most 2 decimal places", 
      inputName: "CurrentFairMarketValue",
    },
    {
      label: "Acquisition Year", 
      subtext: "YYYY",
      inputName: "AcquisitionYear",
    },
    {
      label: "Acquisition Mode", 
      inputName: "AcquisitionMode",
    },
    {
      label: "Acquisition Cost", 
      subtext: "At most 2 decimal places",
      inputName: "AcquisitionCost",
    }
  ],
  [AssetTypes.PERSONAL_PROPERTY]: [
    {
      label: "Description", 
      inputName: "Description",
    },
    {
      label: "Year Acquired",
      inputName: "YearAcquired",
    },
    {
      label: "Acquisition Cost/Amount",
      inputName: "AcqusitionCost",
    }
  ],
  [AssetTypes.LIABILITY]: [
    {
      label: "Nature", 
      inputName: "Nature",
    },
    {
      label: "Name of Creditors", 
      inputName: "Creditors",
    },
    {
      label: "Outstanding Balance", 
      inputName: "OutstandingBalance",
    }
  ],
  [AssetTypes.CONNECTION]: [
    {
      label: "Name of Entity/Business Enterprise", 
      inputName: "Name",
    },
    {
      label: "Business Address", 
      inputName: "BusinessAddress",
    },
    {
      label: "Nature of Business Interest & / or Financial Connection", 
      inputName: "Nature",
    },
    {
      label: "Date of Acquisition of Interest or Connection", 
      inputName: "DateOfAcquisition",
    }
  ],
  [AssetTypes.RELATIVE]: [
    {
      label: "Name of Relative", 
      inputName: "Name",
    },
    {
      label: "Relationship", 
      inputName: "Relationship",
    },
    {
      label: "Position", 
      inputName: "Position",
    },
    {
      label: "Name of Agency/Office and Address", 
      inputName: "Agency",
    }
  ]
};

export const namePattern = /^[A-Za-z]+(?:\s[A-Za-z])?,\s[A-Za-z]+(?:\s[A-Za-z])?,\s[A-Za-z]\.$/

export const agePattern = /^(0|[1-9][0-9]{0,2})$/

export const costPattern = /^(\d{1,3}(,\d{3})*|\d+)(\.\d{1,2})?$/

export function commaCost(costString: string) {
  const numericValue = parseFloat(costString.replace(/,/g, ""));
  if (isNaN(numericValue)) return "";

  return numericValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export const yearPattern = /^\d{4}$/

// Optional utility if you need a list
export const ASSET_TYPE_LIST = Object.values(AssetTypes);
