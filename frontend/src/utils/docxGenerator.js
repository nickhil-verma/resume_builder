import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export const generateDocx = async (data) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: data.personalInfo?.name || 'RESUME',
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `${data.personalInfo?.email} | ${data.personalInfo?.phone} | ${data.personalInfo?.address || ''}`,
                size: 18,
                color: "666666",
              }),
            ],
          }),

          // Summary
          new Paragraph({
            text: "PROFESSIONAL SUMMARY",
            heading: HeadingLevel.HEADING_1,
            border: { bottom: { color: "auto", space: 1, value: BorderStyle.SINGLE, size: 6 } },
          }),
          new Paragraph({
            text: data.summary || data.tailoredSummary || "",
            spacing: { before: 200, after: 300 },
          }),

          // Experience
          new Paragraph({
            text: "WORK EXPERIENCE",
            heading: HeadingLevel.HEADING_1,
            border: { bottom: { color: "auto", space: 1, value: BorderStyle.SINGLE, size: 6 } },
          }),
          ...(data.experience?.flatMap(exp => [
            new Paragraph({
              spacing: { before: 200 },
              children: [
                new TextRun({ text: exp.role.toUpperCase(), bold: true, size: 24 }),
                new TextRun({ text: ` | ${exp.company}`, size: 24 }),
              ],
            }),
            new Paragraph({
              text: exp.desc,
              spacing: { after: 200 },
            }),
          ]) || []),

          // Skills
          new Paragraph({
            text: "SKILLS & EXPERTISE",
            heading: HeadingLevel.HEADING_1,
            border: { bottom: { color: "auto", space: 1, value: BorderStyle.SINGLE, size: 6 } },
          }),
          new Paragraph({
            spacing: { before: 200 },
            children: [
              new TextRun({
                text: data.skills?.join(" • ") || "",
                bold: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.title || 'resume'}.docx`);
};
