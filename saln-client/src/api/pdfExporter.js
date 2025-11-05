import { PDFDocument} from 'pdf-lib';
import templatePDFUrl from './SALN-rev-2015-template.pdf?url';

/**
 * Helper function to format number without currency
 */
function formatNumber(amount) {
  return new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: 2
  }).format(amount || 0);
}

/**
 * Helper to prepare SALN data from your form structure
 */
export function prepareSALNData(formData) {
  const pi = formData.personalInfo;
  
  // Parse currency strings to numbers (handles format "1,234,567.89")
  const parseCurrency = (value) => {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    return parseFloat(value.toString().replace(/,/g, '')) || 0;
  };
  
  // Calculate totals
  const totalRealPropertyCost = (formData.realProperties || []).reduce((sum, prop) => 
    sum + parseCurrency(prop.acquisitionCost || 0), 0
  );
  
  const totalPersonalPropertyCost = (formData.personalProperties || []).reduce((sum, prop) => 
    sum + parseCurrency(prop.acquisitionCost || 0), 0
  );
  
  const totalAssets = totalRealPropertyCost + totalPersonalPropertyCost;
  
  const totalLiabilities = (formData.liabilities || []).reduce((sum, liab) => 
    sum + parseCurrency(liab.outstandingBalance || 0), 0
  );
  
  const netWorth = totalAssets - totalLiabilities;
  
  return {
    salnID: formData.salnID,
    updatedAt: formData.updatedAt || new Date().toISOString(),
    personalInfo: {
      filingType: pi.filingType,
      declarantName: pi.declarantName,
      address: pi.address,
      position: pi.position,
      agency: pi.agency,
      officeAddress: pi.officeAddress,
      spouseName: pi.spouseName,
      spousePosition: pi.spousePosition,
      spouseAgency: pi.spouseAgency,
      spouseOfficeAddress: pi.spouseOfficeAddress
    },
    children: formData.children || [],
    realProperties: formData.realProperties || [],
    personalProperties: formData.personalProperties || [],
    liabilities: formData.liabilities || [],
    connections: formData.connections || [],
    relatives: formData.relatives || [],
    
    // Totals for calculations
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
    const childrenMaxLen = 5;
    const realPropertiesMaxLen = 4;
    const personalPropertiesMaxLen = 4;
    const LiabilitiesMaxLen = 4;
    const BusinessConnectionsMaxLen = 6;
    const RelativesMaxLen = 8;
    
    // Load the PDF template using imported URL
    console.log('Loading PDF from:', templatePDFUrl);
    const existingPdfBytes = await fetch(templatePDFUrl).then(res => {
      if (!res.ok) throw new Error(`Failed to load PDF template: ${res.statusText}`);
      return res.arrayBuffer();
    });
    
    // Helper function to safely set text field
    const setTextField = (form, fieldName, value) => {
      try {
        const field = form.getTextField(fieldName);
        if (field && value !== null && value !== undefined) {
          field.setText(String(value));
          field.setFontSize(0); 
        }
      } catch (e) {
        console.warn(`Could not set field "${fieldName}":`, e.message);
      }
    };
    
    // Helper function to safely set checkbox
    const setCheckbox = (form, fieldName, isChecked) => {
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
    
    // Fill basic info on a form
    const fillBasicInfo = (form) => {
      setTextField(form, 'asOf', new Date().toISOString().split('T')[0]);
      
      // Filing type checkboxes
      setCheckbox(form, 'jointFiling', salnData.personalInfo.filingType === 'Joint Filing');
      setCheckbox(form, 'separateFiling', salnData.personalInfo.filingType === 'Separate Filing');
      
      // Declarant information
      setTextField(form, 'declarantName', salnData.personalInfo.declarantName);
      setTextField(form, 'declarantPosition', salnData.personalInfo.position);
      setTextField(form, 'declarantAgency', salnData.personalInfo.agency);
      setTextField(form, 'declarantOfficeAddress', salnData.personalInfo.officeAddress);
      setTextField(form, 'declarantAddress', salnData.personalInfo.address);
      
      // Spouse information (if applicable)
      if (salnData.personalInfo.spouseName) {
        setTextField(form, 'spouseName', salnData.personalInfo.spouseName);
        setTextField(form, 'spousePosition', salnData.personalInfo.spousePosition);
        setTextField(form, 'spouseAgency', salnData.personalInfo.spouseAgency);
        setTextField(form, 'spouseOfficeAddress', salnData.personalInfo.spouseOfficeAddress);
      }
    };
    
    // Calculate if we need overflow pages
    const needsOverflow = 
      (salnData.children || []).length > childrenMaxLen ||
      (salnData.realProperties || []).length > realPropertiesMaxLen ||
      (salnData.personalProperties || []).length > personalPropertiesMaxLen ||
      (salnData.liabilities || []).length > LiabilitiesMaxLen ||
      (salnData.connections || []).length > BusinessConnectionsMaxLen ||
      (salnData.relatives || []).length > RelativesMaxLen;
    
    const pdfDocs = [];
    
    // Create first PDF
    const firstPdfDoc = await PDFDocument.load(existingPdfBytes);
    const firstForm = firstPdfDoc.getForm();
    
    fillBasicInfo(firstForm);
    

    // Fill children (first page)
    const children = salnData.children || [];
    const firstPageChildren = children.slice(0, childrenMaxLen);
    firstPageChildren.forEach((child, index) => {
      const idx = index + 1;
      setTextField(firstForm, `childName${idx}`, child.name);
      setTextField(firstForm, `childDOB${idx}`, child.dob);
      setTextField(firstForm, `childAge${idx}`, child.age.toString());
    });
    
    // Fill Real Properties (first page)
    const realProps = salnData.realProperties || [];
    const firstPageRealProps = realProps.slice(0, realPropertiesMaxLen);
    firstPageRealProps.forEach((prop, index) => {
      const idx = index + 1;
      setTextField(firstForm, `realPropDescription${idx}`, prop.description);
      setTextField(firstForm, `realPropKind${idx}`, prop.kind);
      setTextField(firstForm, `realPropLocation${idx}`, prop.exactLocation);
      setTextField(firstForm, `realPropAssessedValue${idx}`, prop.assessedValue);
      setTextField(firstForm, `realPropMarketValue${idx}`, prop.currentFairMarketValue);
      setTextField(firstForm, `realPropYear${idx}`, prop.acquisitionYear);
      setTextField(firstForm, `realPropMode${idx}`, prop.acquisitionMode);
      setTextField(firstForm, `realPropCost${idx}`, prop.acquisitionCost);
    });
    
    // Fill Personal Properties (first page)
    const personalProps = salnData.personalProperties || [];
    const firstPagePersonalProps = personalProps.slice(0, personalPropertiesMaxLen);
    firstPagePersonalProps.forEach((prop, index) => {
      const idx = index + 1;
      setTextField(firstForm, `personalPropDescription${idx}`, prop.description);
      setTextField(firstForm, `personalPropYear${idx}`, prop.yearAcquired);
      setTextField(firstForm, `personalPropCost${idx}`, prop.acquisitionCost);
    });
    
    // Fill Liabilities (first page)
    const liabilities = salnData.liabilities || [];
    const firstPageLiabilities = liabilities.slice(0, LiabilitiesMaxLen);
    firstPageLiabilities.forEach((liab, index) => {
      const idx = index + 1;
      setTextField(firstForm, `liabilityNature${idx}`, liab.nature);
      setTextField(firstForm, `liabilityCreditor${idx}`, liab.creditors);
      setTextField(firstForm, `liabilityBalance${idx}`, liab.outstandingBalance);
    });
    
    // Fill Business Interests (first page)
    const connections = salnData.connections || [];
    if (connections.length === 0) {
      setCheckbox(firstForm, 'noBusinessInterest', true);
    } else {
      const firstPageConnections = connections.slice(0, BusinessConnectionsMaxLen);
      firstPageConnections.forEach((business, index) => {
        const idx = index + 1;
        setTextField(firstForm, `businessEntity${idx}`, business.name);
        setTextField(firstForm, `businessAddress${idx}`, business.businessAddress);
        setTextField(firstForm, `businessNature${idx}`, business.nature);
        setTextField(firstForm, `businessDate${idx}`, business.dateOfAcquisition);
      });
    }
    
    // Fill Relatives (first page)
    const relatives = salnData.relatives || [];
    if (relatives.length === 0) {
      setCheckbox(firstForm, 'noRelatives', true);
    } else {
      const firstPageRelatives = relatives.slice(0, RelativesMaxLen);
      firstPageRelatives.forEach((relative, index) => {
        const idx = index + 1;
        setTextField(firstForm, `relativeName${idx}`, relative.name);
        setTextField(firstForm, `relativeRelationship${idx}`, relative.relationship);
        setTextField(firstForm, `relativePosition${idx}`, relative.position);
        setTextField(firstForm, `relativeAgency${idx}`, relative.agency);
      });
    }
    
    // Fill totals on first page
    setTextField(firstForm, 'realPropSubtotal', formatNumber(salnData.totals.totalRealProperty));
    setTextField(firstForm, 'personalPropSubtotal', formatNumber(salnData.totals.totalPersonalProperty));
    setTextField(firstForm, 'totalAssets', formatNumber(salnData.totals.totalAssets));
    setTextField(firstForm, 'totalLiabilities', formatNumber(salnData.totals.totalLiabilities));
    setTextField(firstForm, 'netWorth', formatNumber(salnData.totals.netWorth));
    
    firstForm.flatten();
    pdfDocs.push(firstPdfDoc);
    
    // Create overflow pages if needed
    if (needsOverflow) {
      const overflowChildren = children.slice(childrenMaxLen);
      const overflowRealProps = realProps.slice(realPropertiesMaxLen);
      const overflowPersonalProps = personalProps.slice(personalPropertiesMaxLen);
      const overflowLiabilities = liabilities.slice(LiabilitiesMaxLen);
      const overflowConnections = connections.slice(BusinessConnectionsMaxLen);
      const overflowRelatives = relatives.slice(RelativesMaxLen);
      
      while (
        overflowChildren.length > 0 ||
        overflowRealProps.length > 0 ||
        overflowPersonalProps.length > 0 ||
        overflowLiabilities.length > 0 ||
        overflowConnections.length > 0 ||
        overflowRelatives.length > 0
      ) {
        const overflowPdfDoc = await PDFDocument.load(existingPdfBytes);
        const overflowForm = overflowPdfDoc.getForm();
        
        fillBasicInfo(overflowForm);
        
      
        const currentChildren = overflowChildren.slice(0, childrenMaxLen);
        currentChildren.forEach((child, index) => {
          const idx = index + 1;
          setTextField(firstForm, `childName${idx}`, child.name);
          setTextField(firstForm, `childDOB${idx}`, child.dob);
          setTextField(firstForm, `childAge${idx}`, child.age.toString());
        });

        // Fill overflow Real Properties
        const currentRealProps = overflowRealProps.splice(0, realPropertiesMaxLen);
        currentRealProps.forEach((prop, index) => {
          const idx = index + 1;
          setTextField(overflowForm, `realPropDescription${idx}`, prop.description);
          setTextField(overflowForm, `realPropKind${idx}`, prop.kind);
          setTextField(overflowForm, `realPropLocation${idx}`, prop.exactLocation);
          setTextField(overflowForm, `realPropAssessedValue${idx}`, prop.assessedValue);
          setTextField(overflowForm, `realPropMarketValue${idx}`, prop.currentFairMarketValue);
          setTextField(overflowForm, `realPropYear${idx}`, prop.acquisitionYear);
          setTextField(overflowForm, `realPropMode${idx}`, prop.acquisitionMode);
          setTextField(overflowForm, `realPropCost${idx}`, prop.acquisitionCost);
        });
        
        // Fill overflow Personal Properties
        const currentPersonalProps = overflowPersonalProps.splice(0, personalPropertiesMaxLen);
        currentPersonalProps.forEach((prop, index) => {
          const idx = index + 1;
          setTextField(overflowForm, `personalPropDescription${idx}`, prop.description);
          setTextField(overflowForm, `personalPropYear${idx}`, prop.yearAcquired);
          setTextField(overflowForm, `personalPropCost${idx}`, prop.acquisitionCost);
        });
        
        // Fill overflow Liabilities
        const currentLiabilities = overflowLiabilities.splice(0, LiabilitiesMaxLen);
        currentLiabilities.forEach((liab, index) => {
          const idx = index + 1;
          setTextField(overflowForm, `liabilityNature${idx}`, liab.nature);
          setTextField(overflowForm, `liabilityCreditor${idx}`, liab.creditors);
          setTextField(overflowForm, `liabilityBalance${idx}`, liab.outstandingBalance);
        });
        
        // Fill overflow Business Interests
        const currentConnections = overflowConnections.splice(0, BusinessConnectionsMaxLen);
        currentConnections.forEach((business, index) => {
          const idx = index + 1;
          setTextField(overflowForm, `businessEntity${idx}`, business.name);
          setTextField(overflowForm, `businessAddress${idx}`, business.businessAddress);
          setTextField(overflowForm, `businessNature${idx}`, business.nature);
          setTextField(overflowForm, `businessDate${idx}`, business.dateOfAcquisition);
        });
        
        // Fill overflow Relatives
        const currentRelatives = overflowRelatives.splice(0, RelativesMaxLen);
        currentRelatives.forEach((relative, index) => {
          const idx = index + 1;
          setTextField(overflowForm, `relativeName${idx}`, relative.name);
          setTextField(overflowForm, `relativeRelationship${idx}`, relative.relationship);
          setTextField(overflowForm, `relativePosition${idx}`, relative.position);
          setTextField(overflowForm, `relativeAgency${idx}`, relative.agency);
        });
        
        overflowForm.flatten();
        pdfDocs.push(overflowPdfDoc);
      }
    }
    
    // Merge all PDFs
    const mergedPdf = await PDFDocument.create();
    for (const pdfDoc of pdfDocs) {
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    
    // Save and download the PDF
    const pdfBytes = await mergedPdf.save();
    
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SALN_${salnData.personalInfo.declarantName}_${new Date().toISOString().split('T')[0]}.pdf`;
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