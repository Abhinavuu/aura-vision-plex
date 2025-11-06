import jsPDF from 'jspdf';

export const exportDocumentationToPDF = async () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number = 10) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number, isBold: boolean = false, indent: number = 0) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    const lines = doc.splitTextToSize(text, maxWidth - indent);
    lines.forEach((line: string) => {
      checkPageBreak();
      doc.text(line, margin + indent, yPosition);
      yPosition += fontSize * 0.5;
    });
    yPosition += 2;
  };

  try {
    const response = await fetch('/PHASE1_REPORT.md');
    const markdown = await response.text();
    
    const lines = markdown.split('\n');
    let inCodeBlock = false;
    let inTable = false;
    let skipMermaid = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip mermaid diagrams
      if (line.includes('```mermaid')) {
        skipMermaid = true;
        continue;
      }
      if (skipMermaid && line.includes('```')) {
        skipMermaid = false;
        yPosition += 10;
        addText('[Architecture Diagram - See Digital Version]', 10, true);
        yPosition += 5;
        continue;
      }
      if (skipMermaid) continue;

      // Handle code blocks
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        if (!inCodeBlock) yPosition += 5;
        continue;
      }
      
      if (inCodeBlock) {
        checkPageBreak();
        doc.setFontSize(9);
        doc.setFont('courier', 'normal');
        doc.text(line, margin + 5, yPosition);
        yPosition += 4;
        continue;
      }

      // Skip empty lines but add small space
      if (line.trim() === '') {
        yPosition += 3;
        continue;
      }

      // Handle horizontal rules
      if (line.trim() === '---') {
        checkPageBreak(10);
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
        continue;
      }

      // Handle headers
      if (line.startsWith('# ')) {
        checkPageBreak(15);
        yPosition += 5;
        addText(line.replace(/^#\s+/, ''), 20, true);
        yPosition += 5;
      } else if (line.startsWith('## ')) {
        checkPageBreak(12);
        yPosition += 3;
        addText(line.replace(/^##\s+/, ''), 16, true);
        yPosition += 3;
      } else if (line.startsWith('### ')) {
        checkPageBreak(10);
        yPosition += 2;
        addText(line.replace(/^###\s+/, ''), 14, true);
        yPosition += 2;
      } else if (line.startsWith('#### ')) {
        checkPageBreak(8);
        addText(line.replace(/^####\s+/, ''), 12, true);
        yPosition += 1;
      }
      // Handle lists
      else if (line.match(/^[\s]*[-*]\s+/)) {
        const indent = (line.match(/^(\s*)/)?.[1].length || 0) * 2;
        const text = line.replace(/^[\s]*[-*]\s+/, '• ');
        addText(text, 10, false, indent);
      }
      else if (line.match(/^[\s]*\d+\.\s+/)) {
        const indent = (line.match(/^(\s*)/)?.[1].length || 0) * 2;
        addText(line, 10, false, indent);
      }
      // Handle bold text in lines
      else if (line.includes('**')) {
        const cleanLine = line.replace(/\*\*/g, '');
        const isBold = line.startsWith('**') || line.includes(':**');
        addText(cleanLine, 10, isBold);
      }
      // Handle tables
      else if (line.includes('|') && !inTable) {
        inTable = true;
        checkPageBreak(15);
        doc.setFontSize(9);
        const cells = line.split('|').filter(cell => cell.trim());
        cells.forEach((cell, idx) => {
          doc.text(cell.trim(), margin + (idx * 40), yPosition);
        });
        yPosition += 5;
      }
      else if (line.includes('|') && inTable) {
        if (line.includes('---')) {
          doc.setDrawColor(200, 200, 200);
          doc.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 5;
        } else {
          checkPageBreak();
          const cells = line.split('|').filter(cell => cell.trim());
          cells.forEach((cell, idx) => {
            doc.text(cell.trim(), margin + (idx * 40), yPosition);
          });
          yPosition += 5;
        }
      } else {
        inTable = false;
        // Regular paragraph
        if (line.trim()) {
          const cleanLine = line.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove markdown links
          addText(cleanLine, 10);
        }
      }
    }

    // Save the PDF
    doc.save('Vision_AI_Phase1_Report.pdf');
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
