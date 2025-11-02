import { PDFDocument , rgb, StandardFonts } from 'pdf-lib';
import templatePDFUrl from './SALN-rev-2015-template.pdf?url';

/**
 * Helper function to format number without currency
 */
function formatNumber(amount) {
  return new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: 2
  }).format(amount || 0);
}

function cleanTextForPDF(text) {
  if (!text) return '';
  return String(text)
    .replace(/₱/g, 'PHP ')  // Replace peso sign with PHP
    .replace(/[^\x20-\x7E]/g, ''); // Remove any other non-ASCII characters
}
/**
 * Helper to prepare SALN data from your form structure
 */
export function prepareSALNData(formData) {
  const pi = formData.personalInfo;
  
  // Calculate totals
  const totalRealPropertyCost = (formData.realProperties || []).reduce((sum, prop) => sum + (prop.cost || 0), 0);
  const totalPersonalPropertyCost = (formData.personalProperties || []).reduce((sum, prop) => sum + (prop.acquisitionCost || 0), 0);
  const totalAssets = totalRealPropertyCost + totalPersonalPropertyCost;
  const totalLiabilities = (formData.liabilities || []).reduce((sum, liab) => sum + (liab.outstandingBalance || 0), 0);
  const netWorth = totalAssets - totalLiabilities;
  const filingTypes = ['Not Applicable', `Join`, `Separate`]
  return {
    // Date and filing type
    asOf: new Date().toISOString().split('T')[0],
    filingType: filingTypes[pi.filingType], 
    // Declarant information
    declarant: {
      familyName: pi.familyName,
      firstName: pi.firstName,
      middleInitial: pi.mi,
      position: pi.position,
      agency: pi.agency,
      officeAddress: pi.officeAddress,
      address: pi.address
    },
    
    // Spouse information
    spouse: pi.spousefirstName ? {
      familyName: pi.spousefamilyName,
      firstName: pi.spousefirstName,
      middleInitial: pi.spouseMI,
      position: pi.spousePosition,
      agency: pi.spouseAgency,
      officeAddress: pi.spouseofficeAddress
    } : null,
    
    // Children
    children: formData.children || [],
    
    // Assets
    realProperties: formData.realProperties || [],
    personalProperties: formData.personalProperties || [],
    
    // Liabilities
    liabilities: formData.liabilities || [],
    
    // Business interests
    businessInterests: formData.connections || [],
    
    // Relatives
    relatives: formData.relatives || [],
    
    // Totals
    totals: {
      totalRealProperty: totalRealPropertyCost,
      totalPersonalProperty: totalPersonalPropertyCost,
      totalAssets: totalAssets,
      totalLiabilities: totalLiabilities,
      netWorth: netWorth
    }
  };
}

/**
 * Export SALN data to filled PDF
 * @param {Object} salnData - The prepared SALN form data
 * @param {string} templatePath - Path to the blank PDF template
 */
export async function fillPDFFormFields(salnData) {
  try {
    // Load the PDF template using imported URL
    console.log('Loading PDF from:', templatePDFUrl);
    const existingPdfBytes = await fetch(templatePDFUrl).then(res => {
      if (!res.ok) throw new Error(`Failed to load PDF template: ${res.statusText}`);
      return res.arrayBuffer();
    });
    
     const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    
    // Get all form fields for debugging
    const fields = form.getFields();
    console.log('Available PDF form fields:', fields.map(f => ({
      name: f.getName(),
      type: f.constructor.name
    })));
    const fontSize = 10;
    
    // Helper function to safely set text field
    const setTextField = (fieldName, value) => {
      try {
        const field = form.getTextField(fieldName);
        if (field && value !== null && value !== undefined) {
          field.setText(String(value));
          field.setFontSize(fontSize); 
        }
      } catch (e) {
        console.warn(`Could not set field "${fieldName}":`, e.message);
      }
    };
    
    // Helper function to safely set checkbox
    const setCheckbox = (fieldName, isChecked) => {
      try {
        const field = form.getCheckBox(fieldName);
        if (field) {
          if (isChecked) {
            field.check();
          } else {
            field.uncheck();
          }
        }
      } catch (e) {
        console.warn(`Could not set checkbox "${fieldName}":`, e.message);
      }
    };
    
    // Fill basic information
    setTextField('asOf', salnData.asOf);
    
    // Filing type checkboxes
    setCheckbox('jointFiling', salnData.filingType === 'Joint');
    setCheckbox('separateFiling', salnData.filingType === 'Separate');
    
    // Declarant information
    setTextField('declarantFamilyName', salnData.declarant.familyName);
    setTextField('declarantFirstName', salnData.declarant.firstName);
    setTextField('declarantMI', salnData.declarant.middleInitial);
    setTextField('declarantPosition', salnData.declarant.position);
    setTextField('declarantAgency', salnData.declarant.agency);
    setTextField('declarantOfficeAddress', salnData.declarant.officeAddress);
    setTextField('declarantAddress', salnData.declarant.address);
    
    // Spouse information (if applicable)
    if (salnData.spouse) {
      setTextField('spouseFamilyName', salnData.spouse.familyName);
      setTextField('spouseFirstName', salnData.spouse.firstName);
      setTextField('spouseMI', salnData.spouse.middleInitial);
      setTextField('spousePosition', salnData.spouse.position);
      setTextField('spouseAgency', salnData.spouse.agency);
      setTextField('spouseOfficeAddress', salnData.spouse.officeAddress);
    }
    
    // Children information
    salnData.children.forEach((child, index) => {
      setTextField(`childName${index + 1}`, child.name);
      setTextField(`childDOB${index + 1}`, child.dateOfBirth);
      setTextField(`childAge${index + 1}`, child.age.toString());
    });
    
    // Real Properties
    salnData.realProperties.forEach((prop, index) => {
      const idx = index + 1;
      setTextField(`realPropDescription${idx}`, prop.description);
      setTextField(`realPropKind${idx}`, prop.kind);
      setTextField(`realPropLocation${idx}`, prop.exactLocation);
      setTextField(`realPropAssessedValue${idx}`, formatNumber(prop.assessedValue));
      setTextField(`realPropMarketValue${idx}`, formatNumber(prop.marketValue));
      setTextField(`realPropYear${idx}`, prop.yearAcquired.toString());
      setTextField(`realPropMode${idx}`, prop.modeOfAcquisition);
      setTextField(`realPropCost${idx}`, formatNumber(prop.cost));
    });
    
    // Real property subtotal
    setTextField('realPropSubtotal', formatNumber(salnData.totals.totalRealProperty));
    
    // Personal Properties
    salnData.personalProperties.forEach((prop, index) => {
      const idx = index + 1;
      setTextField(`personalPropDescription${idx}`, prop.description);
      setTextField(`personalPropYear${idx}`, prop.yearAcquired.toString());
      setTextField(`personalPropCost${idx}`, formatNumber(prop.acquisitionCost));
    });
    
    // Personal property subtotal
    setTextField('personalPropSubtotal', formatNumber(salnData.totals.totalPersonalProperty));
    
    // Liabilities
    salnData.liabilities.forEach((liab, index) => {
      const idx = index + 1;
      setTextField(`liabilityNature${idx}`, liab.nature);
      setTextField(`liabilityCreditor${idx}`, liab.creditor);
      setTextField(`liabilityBalance${idx}`, formatNumber(liab.outstandingBalance));
    });
    
    // Business Interests
    if (salnData.businessInterests.length === 0) {
      setCheckbox('noBusinessInterest', true);
    } else {
      salnData.businessInterests.forEach((business, index) => {
        const idx = index + 1;
        setTextField(`businessEntity${idx}`, business.entityName);
        setTextField(`businessAddress${idx}`, business.businessAddress);
        setTextField(`businessNature${idx}`, business.natureOfConnection);
        setTextField(`businessDate${idx}`, business.dateAcquired);
      });
    }
    
    // Relatives in Government
    if (salnData.relatives.length === 0) {
      setCheckbox('noRelatives', true);
    } else {
      salnData.relatives.forEach((relative, index) => {
        const idx = index + 1;
        setTextField(`relativeName${idx}`, relative.name);
        setTextField(`relativeRelationship${idx}`, relative.relationship);
        setTextField(`relativePosition${idx}`, relative.position);
        setTextField(`relativeAgency${idx}`, relative.agency);
      });
    }
    
    // Totals
    setTextField('totalAssets', formatNumber(salnData.totals.totalAssets));
    setTextField('totalLiabilities', formatNumber(salnData.totals.totalLiabilities));
    setTextField('netWorth', formatNumber(salnData.totals.netWorth));
    
    // Flatten the form to make it non-editable (optional)
    // form.flatten();
    form.flatten();
    // Save and download the PDF
    const pdfBytes = await pdfDoc.save();
    
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SALN_${salnData.declarant.familyName}_${salnData.asOf}.pdf`;
    link.click();
    
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    return { success: true, message: 'PDF exported successfully' };
   
    
  } catch (error) {
    console.error('Error filling PDF form:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to export PDF'
    };
  }
} 