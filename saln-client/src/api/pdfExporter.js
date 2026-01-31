import { PDFDocument } from 'pdf-lib';

// New templates (Vite `?url` import)
import mainTemplatePDFUrl from './2015 SALN Form.pdf?url';
import as1TemplatePDFUrl from './2015 SALN Additional Sheets - AS1.pdf?url';
import as2TemplatePDFUrl from './2015 SALN Additional Sheets - AS2.pdf?url';

// formatting stuff

function parseCurrency(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  const n = parseFloat(String(value).replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function formatNumber(amount) {
  return new Intl.NumberFormat('en-PH', { minimumFractionDigits: 2 }).format(amount || 0);
}

function toISODateOnly(dateLike) {
  if (!dateLike) return new Date().toISOString().split('T')[0];
  // supports "YYYY-MM-DD ..." or ISO
  const s = String(dateLike);
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().split('T')[0];
  return new Date().toISOString().split('T')[0];
}



export function prepareSALNData(formData) {
  const pi = formData.personalInfo;
  return {
    salnID: formData.salnID,
    updatedAt: formData.updatedAt || new Date().toISOString(),
    personalInfo: {
      filingType: pi.filingType,
      declarantFamilyName: pi.declarantFamilyName,
      declarantFirstName: pi.declarantFirstName,
      declarantMI: pi.declarantMI,
      address: pi.address,
      position: pi.position,
      agency: pi.agency,
      officeAddress: pi.officeAddress,
      spouseFamilyName: pi.spouseFamilyName,
      spouseFirstName: pi.spouseFirstName,
      spouseMI: pi.spouseMI,
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
 }
}

export async function fillPDFFormFields(salnData) {
    try {
      //limits in original sheet
      const childrenMaxLen = 4;

      //these four needed in AS-1 and AS-2
      const realPropertiesMaxLen = 4;
      const personalPropertiesMaxLen = 4;
      const LiabilitiesMaxLen = 4;
      const BusinessConnectionsMaxLen = 4;

      const RelativesMaxLen = 5;


      //load main
      console.log('Loading PDF from:', mainTemplatePDFUrl);
      const existingPdfBytes = await fetch(mainTemplatePDFUrl).then(res => {
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
    
    // Updated with 'prefix' parameter
    const fillBasicDeclarantInfo = (form, prefix = "") => {
      const p = prefix;
      setTextField(form, `${p}asOf`, new Date().toISOString().split('T')[0]);
      
      // Declarant information using the dynamic prefix
      setTextField(form, `${p}declarantFamilyName`, salnData.personalInfo.declarantFamilyName);
      setTextField(form, `${p}declarantFirstName`, salnData.personalInfo.declarantFirstName);
      setTextField(form, `${p}declarantMI`, salnData.personalInfo.declarantMI);

      setTextField(form, `${p}declarantPosition`, salnData.personalInfo.position);
      setTextField(form, `${p}declarantAgency`, salnData.personalInfo.agency);
      
    };

    const pdfDocs = [];
    // Create first PDF
    const firstPdfDoc = await PDFDocument.load(existingPdfBytes);
    const firstForm = firstPdfDoc.getForm();

    // Filing type checkboxes
    setCheckbox(firstForm, 'jointFiling', salnData.personalInfo.filingType === 'Joint Filing');
    setCheckbox(firstForm, 'separateFiling', salnData.personalInfo.filingType === 'Separate Filing');
    setCheckbox(firstForm, 'notApplicable', salnData.personalInfo.filingType === 'Not Applicable');

    fillBasicDeclarantInfo(firstForm);
    setTextField(firstForm, `declarantOfficeAddress`, salnData.personalInfo.officeAddress);
    setTextField(firstForm, `declarantAddress`, salnData.personalInfo.address);
    
    // Spouse information (if applicable)
    if (salnData.personalInfo.spouseFamilyName) {
      setTextField(firstForm, 'spouseFamilyName', salnData.personalInfo.spouseFamilyName);
      setTextField(firstForm, 'spouseFirstName', salnData.personalInfo.spouseFirstName);
      setTextField(firstForm, 'spouseMI', salnData.personalInfo.spouseMI);
      setTextField(firstForm, 'spousePosition', salnData.personalInfo.spousePosition);
      setTextField(firstForm, 'spouseAgency', salnData.personalInfo.spouseAgency);
      setTextField(firstForm, 'spouseOfficeAddress', salnData.personalInfo.spouseOfficeAddress);
    }

    // Fill children (max 4)
    
    const children = salnData.children || [];
    const firstPageChildren = children.slice(0, childrenMaxLen);
    firstPageChildren.forEach((child, index) => {
      const idx = index + 1;
      setTextField(firstForm, `childName${idx}`, child.name);
      setTextField(firstForm, `childDOB${idx}`, child.dob);
      setTextField(firstForm, `childAge${idx}`, child.age.toString());
    });

  
    const allRealProps = salnData.realProperties || [];
    const allPersonalProps = salnData.personalProperties || [];
    const allLiabilities = salnData.liabilities || [];
    const allConnections = salnData.connections || [];

    
    const declarantData = {
        realProperties: allRealProps.filter(p => p.nondeclarantExclusive === "false"),
        personalProperties: allPersonalProps.filter(p => p.nondeclarantExclusive === "false"),
        liabilities: allLiabilities.filter(p => p.nondeclarantExclusive === "false"),
        connections: allConnections.filter(p => p.nondeclarantExclusive === "false")
    };

    if (declarantData.connections.length === 0) {
      setCheckbox(firstForm, 'noBusinessInterest', true);
    }
    
    const nonDeclarantData = {
        realProperties: allRealProps.filter(p => p.nondeclarantExclusive === "true"),
        personalProperties: allPersonalProps.filter(p => p.nondeclarantExclusive === "true"),
        liabilities: allLiabilities.filter(p => p.nondeclarantExclusive === "true"),
        connections: allConnections.filter(p => p.nondeclarantExclusive === "true")
    };
   
    
    const getDeclarantSheets = (list, maxLen) => {
        const count = list.length;
        const totalPages = Math.ceil(count / maxLen);
        return Math.max(0, totalPages - 1);
    };

    const getNonDeclarantSheets = (list, maxLen) => {
        return Math.ceil(list.length / maxLen);
    };

    // Calculate Max Sheets for Declarant
    const sheetsNeeded_Declarant = Math.max(
        getDeclarantSheets(declarantData.realProperties, realPropertiesMaxLen),
        getDeclarantSheets(declarantData.personalProperties, personalPropertiesMaxLen),
        getDeclarantSheets(declarantData.liabilities, LiabilitiesMaxLen),
        getDeclarantSheets(declarantData.connections, BusinessConnectionsMaxLen)
    );

    // Calculate Max Sheets for Non-Declarant
    const sheetsNeeded_NonDeclarant = Math.max(
        getNonDeclarantSheets(nonDeclarantData.realProperties, realPropertiesMaxLen),
        getNonDeclarantSheets(nonDeclarantData.personalProperties, personalPropertiesMaxLen),
        getNonDeclarantSheets(nonDeclarantData.liabilities, LiabilitiesMaxLen),
        getNonDeclarantSheets(nonDeclarantData.connections, BusinessConnectionsMaxLen)
    );

    
    console.log("Declarant Lists:", declarantData);
    console.log("Non-Declarant Lists:", nonDeclarantData);
    console.log(`Sheets to Print (Declarant): ${sheetsNeeded_Declarant}`);
    console.log(`Sheets to Print (Non-Declarant): ${sheetsNeeded_NonDeclarant}`);



    // Fill Real Properties (first page)
    const realProps = declarantData.realProperties || [];
    const firstPageRealProps = realProps.slice(0, realPropertiesMaxLen);
    let realPropSubtotal = 0;

    firstPageRealProps.forEach((prop, index) => {
      realPropSubtotal += parseCurrency(prop.acquisitionCost);
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
    const personalProps = declarantData.personalProperties || [];
    const firstPagePersonalProps = personalProps.slice(0, personalPropertiesMaxLen);
    let personalPropSubtotal = 0;
    firstPagePersonalProps.forEach((prop, index) => {
      personalPropSubtotal += parseCurrency(prop.acquisitionCost);
      const idx = index + 1;
      setTextField(firstForm, `personalPropDescription${idx}`, prop.description);
      setTextField(firstForm, `personalPropYear${idx}`, prop.yearAcquired);
      setTextField(firstForm, `personalPropCost${idx}`, prop.acquisitionCost);
    });

    // Fill Liabilities (first page)
    const liabilities = declarantData.liabilities || [];
    const firstPageLiabilities = liabilities.slice(0, LiabilitiesMaxLen);
    let liabilitiesSubtotal = 0;
    firstPageLiabilities.forEach((liab, index) => {
      liabilitiesSubtotal += parseCurrency(liab.outstandingBalance);
      const idx = index + 1;
      setTextField(firstForm, `liabilityNature${idx}`, liab.nature);
      setTextField(firstForm, `liabilityCreditor${idx}`, liab.creditors);
      setTextField(firstForm, `liabilityBalance${idx}`, liab.outstandingBalance);
    });

    const totalAssets = realPropSubtotal + personalPropSubtotal;
    const totalLiabilities = liabilitiesSubtotal;
    const netWorth = totalAssets - totalLiabilities;

    // Totals
    setTextField(firstForm, `realPropSubtotal`,formatNumber(realPropSubtotal));
    setTextField(firstForm, `personalPropSubtotal`,formatNumber(personalPropSubtotal));
    setTextField(firstForm,`totalAssets`,formatNumber(totalAssets));
    setTextField(firstForm, `totalLiabilities`,formatNumber(totalLiabilities));
    setTextField(firstForm, `netWorth`, formatNumber(netWorth));
    
    // Fill Business Interests (first page)
    const connections = declarantData.connections || [];
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

    firstForm.flatten();
    pdfDocs.push(firstPdfDoc);


    //AS-1 
    if (sheetsNeeded_Declarant > 0){
      const overflowRealProps = declarantData.realProperties.slice(realPropertiesMaxLen);
      const overflowPersonalProps = declarantData.personalProperties.slice(personalPropertiesMaxLen);
      const overflowLiabilities = declarantData.liabilities.slice(LiabilitiesMaxLen);
      const overflowConnections = declarantData.connections.slice(BusinessConnectionsMaxLen);
      
      console.log('Loading PDF from:', as1TemplatePDFUrl);
      const as1existingPdfBytes = await fetch(as1TemplatePDFUrl).then(res => {
        if (!res.ok) throw new Error(`Failed to load PDF template: ${res.statusText}`);
        return res.arrayBuffer();
      });
      while (
        overflowRealProps.length > 0 ||
        overflowPersonalProps.length > 0 ||
        overflowLiabilities.length > 0 ||
        overflowConnections.length > 0 
      ){
        const overflowPdfDoc = await PDFDocument.load(as1existingPdfBytes);
        const overflowForm = overflowPdfDoc.getForm();
        
        fillBasicDeclarantInfo(overflowForm, `as1-`);

        const currentRealProps = overflowRealProps.splice(0, realPropertiesMaxLen);
        let currentRealPropsSubtotal = 0;
        currentRealProps.forEach((prop, index) => {
          currentRealPropsSubtotal += parseCurrency(prop.acquisitionCost);
          const idx = index + 1;
          setTextField(overflowForm, `as1-realPropDescription${idx}`, prop.description);
          setTextField(overflowForm, `as1-realPropKind${idx}`, prop.kind);
          setTextField(overflowForm, `as1-realPropLocation${idx}`, prop.exactLocation);
          setTextField(overflowForm, `as1-realPropAssessedValue${idx}`, prop.assessedValue);
          setTextField(overflowForm, `as1-realPropMarketValue${idx}`, prop.currentFairMarketValue);
          setTextField(overflowForm, `as1-realPropYear${idx}`, prop.acquisitionYear);
          setTextField(overflowForm, `as1-realPropMode${idx}`, prop.acquisitionMode);
          setTextField(overflowForm, `as1-realPropCost${idx}`, prop.acquisitionCost);
        });
        


        const currentPersonalProps = overflowPersonalProps.splice(0, personalPropertiesMaxLen);
        let currentPersonalPropsSubtotal = 0;
        currentPersonalProps.forEach((prop, index) => {
          currentPersonalPropsSubtotal += parseCurrency(prop.acquisitionCost);
          const idx = index + 1;
          setTextField(overflowForm, `as1-personalPropDescription${idx}`, prop.description);
          setTextField(overflowForm, `as1-personalPropYear${idx}`, prop.yearAcquired);
          setTextField(overflowForm, `as1-personalPropCost${idx}`, prop.acquisitionCost);
        });

        

        const currentLiabilities = overflowLiabilities.splice(0, LiabilitiesMaxLen);
        let currentLiabilitiesSubtotal = 0;
        currentLiabilities.forEach((liab, index) => {
          currentLiabilitiesSubtotal += parseCurrency(liab.outstandingBalance);
          const idx = index + 1;
          setTextField(overflowForm, `as1-liabilityNature${idx}`, liab.nature);
          setTextField(overflowForm, `as1-liabilityCreditor${idx}`, liab.creditors);
          setTextField(overflowForm, `as1-liabilityBalance${idx}`, liab.outstandingBalance);
        });

        const currentAssets = currentRealPropsSubtotal + currentPersonalPropsSubtotal;

        setTextField(overflowForm, `as1-realPropSubtotal`,formatNumber(currentRealPropsSubtotal));
        setTextField(overflowForm,`as1-personalPropSubtotal`, formatNumber(currentPersonalPropsSubtotal));
        setTextField(overflowForm, `as1-totalLiabilities`, formatNumber(currentLiabilitiesSubtotal));
        setTextField(overflowForm, `as1-totalAssets`, formatNumber(currentAssets));
        
        const currentConnections = overflowConnections.splice(0, BusinessConnectionsMaxLen);
        currentConnections.forEach((business, index) => {
          const idx = index + 1;
          setTextField(overflowForm, `as1-businessEntity${idx}`, business.name);
          setTextField(overflowForm, `as1-businessAddress${idx}`, business.businessAddress);
          setTextField(overflowForm, `as1-businessNature${idx}`, business.nature);
          setTextField(overflowForm, `as1-businessDate${idx}`, business.dateOfAcquisition);
        });

        overflowForm.flatten();
        pdfDocs.push(overflowPdfDoc);
      }
    }


    //AS-2 
    if (sheetsNeeded_NonDeclarant > 0){
      const overflowRealProps = nonDeclarantData.realProperties;
      const overflowPersonalProps = nonDeclarantData.personalProperties;
      const overflowLiabilities = nonDeclarantData.liabilities;
      const overflowConnections = nonDeclarantData.connections;
      
      console.log('Loading PDF from:', as2TemplatePDFUrl);
      const as2existingPdfBytes = await fetch(as2TemplatePDFUrl).then(res => {
        if (!res.ok) throw new Error(`Failed to load PDF template: ${res.statusText}`);
        return res.arrayBuffer();
      });
      while (
        overflowRealProps.length > 0 ||
        overflowPersonalProps.length > 0 ||
        overflowLiabilities.length > 0 ||
        overflowConnections.length > 0 
      )
      {
        const overflowPdfDoc = await PDFDocument.load(as2existingPdfBytes);
        const overflowForm = overflowPdfDoc.getForm();
        
        fillBasicDeclarantInfo(overflowForm, `as2-`);

        const currentRealProps = overflowRealProps.splice(0, realPropertiesMaxLen);
        currentRealProps.forEach((prop, index) => {
          const idx = index + 1;
          setTextField(overflowForm, `as2-realPropDescription${idx}`, prop.description);
          setTextField(overflowForm, `as2-realPropKind${idx}`, prop.kind);
          setTextField(overflowForm, `as2-realPropLocation${idx}`, prop.exactLocation);
          setTextField(overflowForm, `as2-realPropAssessedValue${idx}`, prop.assessedValue);
          setTextField(overflowForm, `as2-realPropMarketValue${idx}`, prop.currentFairMarketValue);
          setTextField(overflowForm, `as2-realPropYear${idx}`, prop.acquisitionYear);
          setTextField(overflowForm, `as2-realPropMode${idx}`, prop.acquisitionMode);
          setTextField(overflowForm, `as2-realPropCost${idx}`, prop.acquisitionCost);
        });
        


        const currentPersonalProps = overflowPersonalProps.splice(0, personalPropertiesMaxLen);
        currentPersonalProps.forEach((prop, index) => {
          const idx = index + 1;
          setTextField(overflowForm, `as2-personalPropDescription${idx}`, prop.description);
          setTextField(overflowForm, `as2-personalPropYear${idx}`, prop.yearAcquired);
          setTextField(overflowForm, `as2-personalPropCost${idx}`, prop.acquisitionCost);
        });

        
        const currentLiabilities = overflowLiabilities.splice(0, LiabilitiesMaxLen);
       
        currentLiabilities.forEach((liab, index) => {
          const idx = index + 1;
          setTextField(overflowForm, `as2-liabilityNature${idx}`, liab.nature);
          setTextField(overflowForm, `as2-liabilityCreditor${idx}`, liab.creditors);
          setTextField(overflowForm, `as2-liabilityBalance${idx}`, liab.outstandingBalance);
        });
        
        const currentConnections = overflowConnections.splice(0, BusinessConnectionsMaxLen);
        currentConnections.forEach((business, index) => {
          const idx = index + 1;
          setTextField(overflowForm, `as2-businessEntity${idx}`, business.name);
          setTextField(overflowForm, `as2-businessAddress${idx}`, business.businessAddress);
          setTextField(overflowForm, `as2-businessNature${idx}`, business.nature);
          setTextField(overflowForm, `as2-businessDate${idx}`, business.dateOfAcquisition);
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
    const fullName = `${salnData.personalInfo.declarantFirstName}_${salnData.personalInfo.declarantFamilyName}`;
    link.download = `SALN_${fullName}_${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
    return { success: true, message: 'PDF exported successfully' };
    }
    catch (error) {
    console.error('Error filling PDF form:', error);
    return { 
        success: false, 
        message: error.message || 'Failed to export PDF'
    };
    }
}