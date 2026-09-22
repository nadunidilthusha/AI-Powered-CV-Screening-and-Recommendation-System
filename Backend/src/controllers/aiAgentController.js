const asyncHandler = require('../utils/asyncHandler');
const fs = require('fs');
const ApiError = require('../utils/ApiError');

// @route  POST /api/ai/extract
// @access Private (HR/Admin)
const extractCVText = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload a PDF CV file');
  }

  // 1. Read the saved PDF file from the disk
  const dataBuffer = fs.readFileSync(req.file.path);

  // 2. Extract raw text – handle both pdf-parse v1 and v2
  let rawText = '';

  try {
    const pdfModule = require('pdf-parse');

    // --- v2 API (class-based) ---
    if (pdfModule && typeof pdfModule.PDFParse === 'function') {
      const { PDFParse } = pdfModule;
      const uint8Array = new Uint8Array(
        dataBuffer.buffer,
        dataBuffer.byteOffset,
        dataBuffer.byteLength
      );
      const parser = new PDFParse({ data: uint8Array });
      const result = await parser.getText();
      rawText = result.text || '';
    }
    // --- v1 API (function-based) ---
    else if (typeof pdfModule === 'function') {
      const pdfData = await pdfModule(dataBuffer);
      rawText = pdfData.text || '';
    }
    // --- some builds export the function as .default ---
    else if (pdfModule && typeof pdfModule.default === 'function') {
      const pdfData = await pdfModule.default(dataBuffer);
      rawText = pdfData.text || '';
    }
    else {
      throw new Error('Unsupported pdf-parse export shape');
    }
  } catch (parseErr) {
    console.error('PDF parsing failed:', parseErr);
    throw new ApiError(500, 'Failed to extract text from the PDF file.');
  }

  // 3. Mock AI Response (replace with real AI later)
  const extractedData = {
    name: 'Mock Candidate Name',
    email: 'candidate@email.com',
    phone: '0771234567',
    education: 'BSc in Information Technology',
    experience: 'Software Engineer Intern',
    technicalSkills: ['JavaScript', 'Node.js', 'MongoDB', 'Express']
  };

  // 4. Final response
  const structuredCandidateJSON = {
    extractedData,
    rawText: rawText,
    cvUrl: req.file.path
  };

  res.success(structuredCandidateJSON, 'CV text extracted successfully (AI Mocked)');
});

module.exports = { extractCVText };