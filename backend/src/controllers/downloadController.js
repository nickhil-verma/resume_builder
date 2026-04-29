const prisma = require('../config/db');
const puppeteer = require('puppeteer');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, Link, ExternalHyperlink } = require('docx');

exports.downloadPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await prisma.resume.findFirst({
      where: { id, userId: req.userId }
    });

    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Basic HTML Template for PDF
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; padding: 40px; }
            h1 { color: #2c3e50; margin-bottom: 5px; }
            h2 { border-bottom: 2px solid #eee; padding-bottom: 5px; margin-top: 20px; color: #34495e; }
            .contact { font-size: 12px; color: #7f8c8d; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .project { margin-bottom: 15px; }
            .project-name { font-weight: bold; font-size: 16px; }
            .project-url { font-size: 12px; color: #3498db; text-decoration: none; }
            .highlights { font-size: 13px; color: #555; }
            .achievement { margin-bottom: 5px; font-size: 13px; }
            .cert { margin-bottom: 5px; font-size: 13px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>${resume.personalInfo.name}</h1>
          <div className="contact">
            ${resume.personalInfo.email} | ${resume.personalInfo.phone || ''} | ${resume.personalInfo.address || ''}
          </div>
          
          <div className="section">
            <p>${resume.summary || resume.tailoredSummary || ''}</p>
          </div>

          <h2>Projects</h2>
          ${(resume.projects || []).map(p => `
            <div className="project">
              <div className="project-name">${p.name} <a href="${p.url}" className="project-url">${p.url}</a></div>
              <p className="highlights">${p.desc}</p>
            </div>
          `).join('')}

          ${resume.achievements && resume.achievements.length > 0 ? `
            <h2>Achievements</h2>
            ${resume.achievements.map(a => `<div className="achievement">• ${a.text} ${a.link ? `<a href="${a.link}" style="font-size: 10px; color: #3498db;">[Link]</a>` : ''}</div>`).join('')}
          ` : ''}

          ${resume.certifications && resume.certifications.length > 0 ? `
            <h2>Certifications</h2>
            ${resume.certifications.map(c => `<div className="cert">✓ ${c.name} - ${c.issuer}</div>`).join('')}
          ` : ''}

          <h2>Skills</h2>
          <p>${(resume.skills || []).join(', ')}</p>
        </body>
      </html>
    `;

    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    res.contentType('application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF ERROR:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};

exports.downloadDOCX = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await prisma.resume.findFirst({
      where: { id, userId: req.userId }
    });

    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: resume.personalInfo.name,
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun(`${resume.personalInfo.email} | ${resume.personalInfo.phone || ''} | ${resume.personalInfo.address || ''}`),
            ],
          }),
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({
            text: "Summary",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: resume.summary || resume.tailoredSummary || '',
          }),
          new Paragraph({ text: "Projects", heading: HeadingLevel.HEADING_2 }),
          ... (resume.projects || []).flatMap(p => [
            new Paragraph({
              children: [
                new TextRun({ text: p.name, bold: true }),
                new TextRun({ text: ` (${p.url})`, color: "3498db" }),
              ],
            }),
            new Paragraph({ text: p.desc }),
          ]),
          new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: (resume.skills || []).join(', ') }),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=${resume.title || 'resume'}.docx`);
    res.send(buffer);
  } catch (error) {
    console.error('DOCX ERROR:', error);
    res.status(500).json({ message: 'Error generating DOCX' });
  }
};
