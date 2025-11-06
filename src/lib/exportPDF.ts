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

  // Helper function to clean markdown formatting
  const cleanMarkdown = (text: string): string => {
    return text
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/\*/g, '') // Remove italic markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
      .replace(/`([^`]+)`/g, '$1') // Remove inline code markers
      .trim();
  };

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number, isBold: boolean = false, indent: number = 0, color: number[] = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    
    const cleanText = cleanMarkdown(text);
    const lines = doc.splitTextToSize(cleanText, maxWidth - indent);
    lines.forEach((line: string) => {
      checkPageBreak(fontSize * 0.7);
      doc.text(line, margin + indent, yPosition);
      yPosition += fontSize * 0.45;
    });
    yPosition += fontSize * 0.2;
  };

  // Helper function to draw a proper table
  const drawTable = (headers: string[], rows: string[][]) => {
    const colWidth = maxWidth / headers.length;
    const rowHeight = 8;
    const headerHeight = 10;
    
    checkPageBreak(headerHeight + (rows.length * rowHeight) + 5);
    
    // Draw header background
    doc.setFillColor(41, 128, 185);
    doc.rect(margin, yPosition, maxWidth, headerHeight, 'F');
    
    // Draw header text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    headers.forEach((header, i) => {
      const cleanHeader = cleanMarkdown(header);
      doc.text(cleanHeader, margin + (i * colWidth) + 2, yPosition + 6.5);
    });
    yPosition += headerHeight;
    
    // Draw rows
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    rows.forEach((row, rowIndex) => {
      checkPageBreak(rowHeight + 2);
      
      // Alternate row colors
      if (rowIndex % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, yPosition, maxWidth, rowHeight, 'F');
      }
      
      // Draw cell borders
      doc.setDrawColor(200, 200, 200);
      row.forEach((cell, i) => {
        doc.rect(margin + (i * colWidth), yPosition, colWidth, rowHeight, 'S');
        const cleanCell = cleanMarkdown(cell);
        const cellText = doc.splitTextToSize(cleanCell, colWidth - 4);
        doc.text(cellText[0] || '', margin + (i * colWidth) + 2, yPosition + 5.5);
      });
      
      yPosition += rowHeight;
    });
    
    yPosition += 8;
  };

  try {
    const response = await fetch('/PHASE1_REPORT.md');
    const markdown = await response.text();
    
    const lines = markdown.split('\n');
    let inCodeBlock = false;
    let skipMermaid = false;
    let tableData: { headers: string[], rows: string[][] } | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip mermaid diagrams
      if (line.includes('```mermaid')) {
        skipMermaid = true;
        continue;
      }
      if (skipMermaid && line.includes('```')) {
        skipMermaid = false;
        checkPageBreak(15);
        doc.setFillColor(240, 248, 255);
        doc.rect(margin, yPosition, maxWidth, 12, 'F');
        doc.setDrawColor(41, 128, 185);
        doc.rect(margin, yPosition, maxWidth, 12, 'S');
        addText('📊 Architecture Diagram - See Digital Version', 10, true, 0, [41, 128, 185]);
        yPosition += 5;
        continue;
      }
      if (skipMermaid) continue;

      // Handle code blocks
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        if (inCodeBlock) {
          checkPageBreak(10);
          doc.setFillColor(250, 250, 250);
          doc.setDrawColor(220, 220, 220);
        } else {
          yPosition += 3;
        }
        continue;
      }
      
      if (inCodeBlock) {
        checkPageBreak(5);
        doc.setFontSize(8);
        doc.setFont('courier', 'normal');
        doc.setTextColor(60, 60, 60);
        const cleanLine = cleanMarkdown(line);
        doc.text(cleanLine, margin + 3, yPosition);
        yPosition += 4;
        continue;
      }

      // Handle tables
      if (line.includes('|') && line.trim().startsWith('|')) {
        if (line.includes('---')) {
          continue; // Skip separator line
        }
        
        const cells = line.split('|').filter(cell => cell.trim()).map(cell => cell.trim());
        
        if (!tableData) {
          // First row - headers
          tableData = { headers: cells, rows: [] };
        } else {
          // Data row
          tableData.rows.push(cells);
        }
        continue;
      } else if (tableData) {
        // End of table - draw it
        drawTable(tableData.headers, tableData.rows);
        tableData = null;
      }

      // Skip empty lines but add small space
      if (line.trim() === '') {
        yPosition += 2;
        continue;
      }

      // Handle horizontal rules
      if (line.trim() === '---') {
        checkPageBreak(8);
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
        doc.setLineWidth(0.2);
        yPosition += 8;
        continue;
      }

      // Handle headers with color and spacing
      if (line.startsWith('# ')) {
        checkPageBreak(20);
        yPosition += 8;
        addText(line.replace(/^#\s+/, ''), 22, true, 0, [41, 128, 185]);
        doc.setDrawColor(41, 128, 185);
        doc.setLineWidth(1);
        doc.line(margin, yPosition, margin + 60, yPosition);
        doc.setLineWidth(0.2);
        yPosition += 8;
      } else if (line.startsWith('## ')) {
        checkPageBreak(15);
        yPosition += 6;
        addText(line.replace(/^##\s+/, ''), 16, true, 0, [52, 73, 94]);
        yPosition += 4;
      } else if (line.startsWith('### ')) {
        checkPageBreak(12);
        yPosition += 4;
        addText(line.replace(/^###\s+/, ''), 13, true, 0, [52, 73, 94]);
        yPosition += 3;
      } else if (line.startsWith('#### ')) {
        checkPageBreak(10);
        yPosition += 3;
        addText(line.replace(/^####\s+/, ''), 11, true, 0, [52, 73, 94]);
        yPosition += 2;
      }
      // Handle lists with proper bullets
      else if (line.match(/^[\s]*[-*]\s+/)) {
        const indent = (line.match(/^(\s*)/)?.[1].length || 0) * 3;
        const text = '• ' + line.replace(/^[\s]*[-*]\s+/, '');
        addText(text, 10, false, indent);
      }
      else if (line.match(/^[\s]*\d+\.\s+/)) {
        const indent = (line.match(/^(\s*)/)?.[1].length || 0) * 3;
        addText(line, 10, false, indent);
      }
      // Handle bold/emphasis text
      else if (line.includes('**') || line.includes('*')) {
        const isBold = line.trim().startsWith('**') || line.includes(':**');
        addText(line, 10, isBold);
      }
      // Regular paragraph
      else if (line.trim()) {
        addText(line, 10);
      }
    }
    
    // Draw final table if exists
    if (tableData) {
      drawTable(tableData.headers, tableData.rows);
    }

    // Save the PDF
    doc.save('Vision_AI_Phase1_Report.pdf');
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
