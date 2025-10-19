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
      inputName: "name", 
    },
    {
      label: "Date of Birth", 
      subtext: "Must be less than 18 years ago",
      inputName: "dob",
      placeholder: "YYYY-MM-DD",
    },
    {
      label: "Age", 
      subtext: "Must match Date of Birth",
      inputName: "age",
      placeholder: "17",
    }
  ],
  [AssetTypes.REAL_PROPERTY]: [
    {
      label: "Description", 
      subtext: "(e.g. lot, house and lot, condominium, and improvements)", 
      inputName: "description", 
    },
    {
      label: "Kind", 
      subtext: "(e.g. residential, commericial, industrial, agricultural and mixed used)", 
      inputName: "kind",
    },
    {
      label: "Exact Location", 
      inputName: "exactLocation",
    },
    {
      label: "Assessed Value", 
      subtext: "(As found in the Tax Declaration of Real Property)", 
      inputName: "assessedValue",
      placeholder: "X,XXX,XXX.XX",
    },
    {
      label: "Current Fair Market Value", 
      subtext: "(As found in the Tax Declaration of Real Property)",
      inputName: "currentFairMarketValue",
      placeholder: "X,XXX,XXX.XX",
    },
    {
      label: "Acquisition Year", 
      inputName: "acquisitionYear",
      placeholder: "YYYY"
    },
    {
      label: "Acquisition Mode", 
      inputName: "acquisitionMode",
    },
    {
      label: "Acquisition Cost", 
      inputName: "acquisitionCost",
      placeholder: "X,XXX,XXX.XX",
    }
  ],
  [AssetTypes.PERSONAL_PROPERTY]: [
    {
      label: "Description", 
      inputName: "description",
    },
    {
      label: "Year Acquired",
      inputName: "yearAcquired",
      placeholder: "YYYY",
    },
    {
      label: "Acquisition Cost/Amount",
      inputName: "acquisitionCost",
      placeholder: "X,XXX,XXX.XX",
    }
  ],
  [AssetTypes.LIABILITY]: [
    {
      label: "Nature", 
      inputName: "nature",
    },
    {
      label: "Name of Creditors", 
      inputName: "creditors",
    },
    {
      label: "Outstanding Balance", 
      inputName: "outstandingBalance",
      placeholder: "X,XXX,XXX.XX"
    }
  ],
  [AssetTypes.CONNECTION]: [
    {
      label: "Name of Entity/Business Enterprise", 
      inputName: "name",
    },
    {
      label: "Business Address", 
      inputName: "businessAddress",
    },
    {
      label: "Nature of Business Interest & / or Financial Connection", 
      inputName: "nature",
    },
    {
      label: "Date of Acquisition of Interest or Connection",
      subtext: "(Year)",
      inputName: "dateOfAcquisition",
      placeholder: "YYYY",
    }
  ],
  [AssetTypes.RELATIVE]: [
    {
      label: "Name of Relative",
      subtext: "in the government service",
      inputName: "name",
    },
    {
      label: "Relationship", 
      inputName: "relationship",
    },
    {
      label: "Position", 
      inputName: "position",
    },
    {
      label: "Name of Agency/Office and Address", 
      inputName: "agency",
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
