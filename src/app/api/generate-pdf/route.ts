import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';

export async function POST(req: NextRequest) {
  try {
    const { uniqueCode, userName, subscriptionsCount } = await req.json();

    if (!uniqueCode) {
      return NextResponse.json(
        { error: 'Codice univoco richiesto' },
        { status: 400 }
      );
    }

    // Crea un nuovo documento PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Impostazioni base
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // Header con logo simulato (usando testo)
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246); // Blue-600
    doc.text('CONSIGLIO CITTADINO', pageWidth / 2, 30, { align: 'center' });

    // Sottotitolo
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128); // Gray-500
    doc.text('Certificato di Adesione al Progetto', pageWidth / 2, 40, { align: 'center' });

    // Linea divisoria
    doc.setDrawColor(229, 231, 235); // Gray-200
    doc.setLineWidth(0.5);
    doc.line(margin, 50, pageWidth - margin, 50);

    // Contenuto principale
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39); // Gray-900
    doc.text('Certificato di Adesione', pageWidth / 2, 70, { align: 'center' });

    // Testo di benvenuto
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99); // Gray-600

    const welcomeText = `Questo documento certifica la tua adesione come sostenitore fondatore del progetto Consiglio Cittadino. Il tuo contributo è fondamentale per la realizzazione di una piattaforma democratica innovativa.`;

    const welcomeLines = doc.splitTextToSize(welcomeText, pageWidth - 2 * margin);
    doc.text(welcomeLines, margin, 90);

    // Box per il codice univoco
    const boxY = 120;
    const boxHeight = 25;
    doc.setFillColor(239, 246, 255); // Blue-50
    doc.setDrawColor(219, 234, 254); // Blue-200
    doc.rect(margin, boxY, pageWidth - 2 * margin, boxHeight, 'FD');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175); // Blue-800
    doc.text('CODICE UNIVOCO DI ACCESSO', pageWidth / 2, boxY + 8, { align: 'center' });

    doc.setFontSize(18);
    doc.setFont('courier', 'bold');
    doc.setTextColor(30, 64, 175); // Blue-800
    doc.text(uniqueCode, pageWidth / 2, boxY + 18, { align: 'center' });

    // Informazioni aggiuntive
    let currentY = boxY + boxHeight + 20;

    if (userName) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      doc.text(`Intestatario: ${userName}`, margin, currentY);
      currentY += 8;
    }

    if (subscriptionsCount && parseInt(subscriptionsCount) > 1) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(180, 83, 9); // Orange-700
      doc.text(`⭐ FOUNDER PLUS - ${subscriptionsCount} abbonamenti attivi`, margin, currentY);
      currentY += 8;
    }

    // Data di emissione
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    const today = new Date().toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    doc.text(`Data di emissione: ${today}`, margin, currentY + 10);

    // Istruzioni per l'uso
    currentY += 30;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('Importante:', margin, currentY);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);

    const instructions = [
      '• Conserva questo codice in un luogo sicuro',
      '• Ti servirà per accedere alla piattaforma al lancio',
      '• In caso di smarrimento, potrai recuperarlo su consigliocittadino.it/recovery',
      '• Il codice è legato al tuo codice fiscale e non può essere trasferito'
    ];

    instructions.forEach((instruction, index) => {
      doc.text(instruction, margin, currentY + 10 + (index * 6));
    });

    // Footer
    const footerY = pageHeight - 30;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Consiglio Cittadino - Piattaforma Democratica Innovativa', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Per maggiori informazioni: www.consigliocittadino.it', pageWidth / 2, footerY + 5, { align: 'center' });

    // Firma digitale simulata
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Documento generato digitalmente - Firma non richiesta', pageWidth / 2, footerY + 15, { align: 'center' });

    // Genera il PDF come buffer
    const pdfBuffer = doc.output('arraybuffer');

    // Restituisci il PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificato-consiglio-cittadino-${uniqueCode}.pdf"`
      }
    });

  } catch (error) {
    console.error('Errore generazione PDF:', error);
    return NextResponse.json(
      { error: 'Errore nella generazione del PDF' },
      { status: 500 }
    );
  }
}