import jsPDF from 'jspdf';
import { BookingRecord, B2BAgency, Agency } from '../types';
import { GuideProfile } from '../data/guidesData';
import { formatINR } from './pricing';

export interface MonthlyReportData {
  monthName: string;
  year: number;
  totalBookings: number;
  totalPackageVolume: number;
  totalPlatformCommission: number; // 5% fee
  totalAgencyAdvances: number; // ₹1,000 fee
  totalTravelerSpend: number;
  bookings: BookingRecord[];
  totalGuidesCount: number;
  totalAgenciesCount: number;
  guides: GuideProfile[];
  agencies: (B2BAgency | Agency)[];
}

/**
 * Generates an official, beautifully formatted executive PDF report for Jatingaa Tours Admin
 */
export function generateMonthlyReportPdf(data: MonthlyReportData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 18;

  // Header Background Banner
  doc.setFillColor(11, 70, 25); // #0b4619 dark emerald
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('JATINGAA TOURS PVT LTD', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('EXECUTIVE OPERATIONS & FINANCIAL AUDIT REPORT', 14, 18);
  doc.text(`REPORT PERIOD: ${data.monthName.toUpperCase()} ${data.year}`, 14, 23);

  // Top Right Meta Info
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, pageWidth - 14, 12, { align: 'right' });
  doc.text('Confidential - Admin Access Only', pageWidth - 14, 17, { align: 'right' });
  doc.text('Payment Gateway: Cashfree Payments Live', pageWidth - 14, 22, { align: 'right' });

  currentY = 36;

  // Section 1: Executive KPI Summary Box
  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. Platform KPI Overview', 14, currentY);
  currentY += 6;

  // Draw KPI Cards
  const cardWidth = (pageWidth - 28 - 9) / 4;
  const cardHeight = 20;

  const kpis = [
    { label: 'Active Native Guides', val: `${data.totalGuidesCount} Guides` },
    { label: 'Registered Agencies', val: `${data.totalAgenciesCount} Operators` },
    { label: 'Period Bookings', val: `${data.totalBookings} Completed` },
    { label: '5% Platform Earnings', val: `Rs. ${data.totalPlatformCommission.toLocaleString('en-IN')}` },
  ];

  kpis.forEach((kpi, index) => {
    const x = 14 + index * (cardWidth + 3);
    doc.setFillColor(245, 248, 245);
    doc.setDrawColor(200, 220, 200);
    doc.roundedRect(x, currentY, cardWidth, cardHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    doc.text(kpi.label, x + 3, currentY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(11, 70, 25);
    doc.text(kpi.val, x + 3, currentY + 14);
  });

  currentY += cardHeight + 8;

  // Section 2: Financial Model & Split Breakdown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text('2. Financial Breakdown & Cashfree Revenue Model', 14, currentY);
  currentY += 5;

  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(14, currentY, pageWidth - 28, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);

  const col1X = 18;
  const col2X = 85;
  const col3X = 145;

  doc.text(`Total Package GMV: Rs. ${data.totalPackageVolume.toLocaleString('en-IN')}`, col1X, currentY + 7);
  doc.text(`Total Traveler Investment: Rs. ${data.totalTravelerSpend.toLocaleString('en-IN')}`, col1X, currentY + 14);
  doc.text(`Platform Model: 5% Platform Fee + Rs. 1,000 Upfront Advance`, col1X, currentY + 21);

  doc.text(`5% Platform Fee Collected: Rs. ${data.totalPlatformCommission.toLocaleString('en-IN')}`, col2X, currentY + 7);
  doc.text(`Agency Upfront Advances: Rs. ${data.totalAgencyAdvances.toLocaleString('en-IN')}`, col2X, currentY + 14);
  doc.text(`Cashfree Instant Total Settlement: Rs. ${(data.totalPlatformCommission + data.totalAgencyAdvances).toLocaleString('en-IN')}`, col2X, currentY + 21);

  doc.text(`Agency Net Share: 100% of Base Price`, col3X, currentY + 7);
  doc.text(`Agency Deduction: 0% Platform Cut`, col3X, currentY + 14);
  doc.text(`On-Arrival Collections: Directly to Host`, col3X, currentY + 21);

  currentY += 32;

  // Section 3: Monthly Customer Bookings Ledger
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text(`3. Itemized Customer Bookings (${data.bookings.length} Records)`, 14, currentY);
  currentY += 5;

  // Table Header
  doc.setFillColor(11, 70, 25);
  doc.rect(14, currentY, pageWidth - 28, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);

  doc.text('Code / ID', 16, currentY + 4.5);
  doc.text('Customer', 45, currentY + 4.5);
  doc.text('Tour Package', 85, currentY + 4.5);
  doc.text('Agency Host', 130, currentY + 4.5);
  doc.text('Advance (CF)', 165, currentY + 4.5);
  doc.text('Arrival Bal', pageWidth - 16, currentY + 4.5, { align: 'right' });

  currentY += 7;

  if (data.bookings.length === 0) {
    doc.setFillColor(255, 255, 255);
    doc.rect(14, currentY, pageWidth - 28, 10, 'F');
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text('No bookings registered for this reporting period.', 16, currentY + 6);
    currentY += 12;
  } else {
    data.bookings.slice(0, 12).forEach((b, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 248);
      doc.rect(14, currentY, pageWidth - 28, 6.5, 'F');
      doc.setTextColor(40, 40, 40);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);

      const code = b.bookingCode || b.id;
      const cust = `${b.customerName} (${b.travelersCount} pax)`;
      const pkg = b.packageTitle.length > 25 ? b.packageTitle.substring(0, 23) + '..' : b.packageTitle;
      const agc = (b.agency?.name || 'Local Host').substring(0, 20);
      const adv = `Rs. ${(b.calculation?.totalAdvancePayable || 1500).toLocaleString('en-IN')}`;
      const bal = `Rs. ${(b.calculation?.remainingBalanceDueOnArrival || 0).toLocaleString('en-IN')}`;

      doc.text(code, 16, currentY + 4.5);
      doc.text(cust, 45, currentY + 4.5);
      doc.text(pkg, 85, currentY + 4.5);
      doc.text(agc, 130, currentY + 4.5);
      doc.text(adv, 165, currentY + 4.5);
      doc.text(bal, pageWidth - 16, currentY + 4.5, { align: 'right' });

      currentY += 6.5;
    });
  }

  currentY += 6;

  // Section 4: Verified Guides Summary Roster
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text(`4. Native Field Guides Directory (${data.totalGuidesCount} Registered)`, 14, currentY);
  currentY += 5;

  // Guides Mini Table Header
  doc.setFillColor(235, 240, 235);
  doc.rect(14, currentY, pageWidth - 28, 6, 'F');
  doc.setTextColor(11, 70, 25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);

  doc.text('Guide Name', 16, currentY + 4);
  doc.text('Govt License ID', 55, currentY + 4);
  doc.text('Specialty & Region', 100, currentY + 4);
  doc.text('Exp / Tours', 155, currentY + 4);
  doc.text('Status', pageWidth - 16, currentY + 4, { align: 'right' });

  currentY += 6;

  data.guides.slice(0, 6).forEach((g, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 252, idx % 2 === 0 ? 255 : 252, idx % 2 === 0 ? 255 : 252);
    doc.rect(14, currentY, pageWidth - 28, 5.5, 'F');
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);

    doc.text(g.name, 16, currentY + 3.8);
    doc.text(g.licenseNo, 55, currentY + 3.8);
    doc.text(`${g.region} - ${g.specialty.substring(0, 30)}`, 100, currentY + 3.8);
    doc.text(`${g.experienceYears}y / ${g.totalExpeditions} tours`, 155, currentY + 3.8);
    doc.text('Verified Active', pageWidth - 16, currentY + 3.8, { align: 'right' });

    currentY += 5.5;
  });

  currentY += 6;

  // Footer / Official Seal
  doc.setDrawColor(200, 200, 200);
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(11, 70, 25);
  doc.text('JATINGAA TOURS OFFICIAL VERIFIED AUDIT', 14, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Direct Native Tourism Escrow & Reservation Platform | 0% Agency Commission Policy', 14, currentY + 4);
  doc.text('Official Contact: +91 69135 14367 | senapatibhaskar6@gmail.com | Vercel Live Deployment', pageWidth - 14, currentY, { align: 'right' });

  // Save the PDF
  const filename = `Jatingaa_Tours_Monthly_Report_${data.monthName}_${data.year}.pdf`;
  doc.save(filename);
}
