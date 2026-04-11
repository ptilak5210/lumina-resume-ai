
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ResumeData } from '../types';

export const generateResumePDF = (data: ResumeData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPos = 20;

    // --- Header ---
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(data.fullName, pageWidth / 2, yPos, { align: "center" });
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const contactInfo = [
        data.email,
        data.phone,
        data.location,
        data.linkedin,
        data.website
    ].filter(Boolean).join(" | ");

    const splitContact = doc.splitTextToSize(contactInfo, pageWidth - (margin * 2));
    doc.text(splitContact, pageWidth / 2, yPos, { align: "center" });
    yPos += (splitContact.length * 5) + 5;

    // --- Summary ---
    if (data.summary) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Professional Summary", margin, yPos);
        yPos += 6;

        doc.setLineWidth(0.5);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 5;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const splitSummary = doc.splitTextToSize(data.summary, pageWidth - (margin * 2));
        doc.text(splitSummary, margin, yPos);
        yPos += (splitSummary.length * 5) + 10;
    }

    // --- Experience ---
    if (data.experience && data.experience.length > 0) {
        if (yPos > 250) { doc.addPage(); yPos = 20; }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Experience", margin, yPos);
        yPos += 6;
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 5;

        data.experience.forEach((exp) => {
            if (yPos > 240) { doc.addPage(); yPos = 20; }

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(exp.position, margin, yPos);

            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            const dateText = `${exp.startDate} - ${exp.endDate}`;
            doc.text(dateText, pageWidth - margin, yPos, { align: "right" });
            yPos += 5;

            doc.setFont("helvetica", "italic");
            doc.text(exp.company, margin, yPos);
            yPos += 6;

            doc.setFont("helvetica", "normal");
            const splitDesc = doc.splitTextToSize(exp.description, pageWidth - (margin * 2));
            doc.text(splitDesc, margin, yPos);
            yPos += (splitDesc.length * 5) + 5;
        });
        yPos += 5;
    }

    // --- Education ---
    if (data.education && data.education.length > 0) {
        if (yPos > 250) { doc.addPage(); yPos = 20; }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Education", margin, yPos);
        yPos += 6;
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 5;

        data.education.forEach((edu) => {
            if (yPos > 250) { doc.addPage(); yPos = 20; }

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(edu.institution, margin, yPos);

            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text(edu.graduationDate, pageWidth - margin, yPos, { align: "right" });
            yPos += 5;

            doc.setFont("helvetica", "normal");
            doc.text(`${edu.degree} in ${edu.field}`, margin, yPos);
            yPos += 8;
        });
        yPos += 5;
    }

    // --- Skills ---
    if (data.skills && data.skills.length > 0) {
        if (yPos > 250) { doc.addPage(); yPos = 20; }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Skills", margin, yPos);
        yPos += 6;
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 5;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const skillsText = data.skills.join(" • ");
        const splitSkills = doc.splitTextToSize(skillsText, pageWidth - (margin * 2));
        doc.text(splitSkills, margin, yPos);
    }

    doc.save(`${data.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
};

export const generateAuditPDF = (report: string, score: number, name: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138); // Blue 900
    doc.text("Resume Audit Report", pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

    // Score
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`ATS Score: ${score}/100`, margin, yPos);
    yPos += 10;

    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // Report Content
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const splitReport = doc.splitTextToSize(report, pageWidth - (margin * 2));

    // Simple pagination loop
    let lineHeight = 5;
    for (let i = 0; i < splitReport.length; i++) {
        if (yPos > 280) {
            doc.addPage();
            yPos = 20;
        }
        doc.text(splitReport[i], margin, yPos);
        yPos += lineHeight;
    }

    doc.save(`${name.replace(/\s+/g, '_')}_Audit_Report.pdf`);
};
