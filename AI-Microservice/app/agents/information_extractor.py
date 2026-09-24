"""
AI Agent 01 – Information Extractor

Reads a CV PDF and produces an ExtractedCandidate: name, contact info,
education, experience, skills, projects, certifications, and links.

This agent is the only one that touches the filesystem; the other two
agents work purely on Pydantic objects.
"""

import logging

import pdfplumber

from app.agents.base import GeminiAgentBase
from app.schemas.candidate import ExtractedCandidate

logger = logging.getLogger(__name__)


class InformationExtractorAgent(GeminiAgentBase):

    # ---------- PDF ----------
    def extract_text_from_pdf(self, file_path: str) -> str:
        """
        Extract text from a PDF using pdfplumber.

        x_tolerance=1 (default is 3) prevents pdfplumber from inserting
        phantom spaces between letters whose kerning is slightly wide —
        e.g. "Rashaan" getting mangled into "Ras haan".

        Raises RuntimeError if the PDF has no readable text (e.g. a
        scanned image needing OCR) so the caller can mark the candidate
        as processingStatus='Failed'.
        """
        raw_text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text(
                        x_tolerance=1,
                        y_tolerance=3,
                    )
                    if page_text:
                        raw_text += page_text + "\n"

            if not raw_text.strip():
                raise ValueError(
                    "PDF contains no readable text "
                    "(possible scanned image requiring OCR)."
                )

            logger.info("Extracted %d chars from %s", len(raw_text), file_path)
            return raw_text

        except Exception as e:
            raise RuntimeError(f"Failed to extract text from PDF: {e}")

    # ---------- Prompt ----------
    @staticmethod
    def _build_prompt(raw_text: str) -> str:
        # CHANGED: rules 2 and 3 are new and much more detailed. They tell
        # the model to look at the WHOLE document for skills (not just a
        # "Skills" section) and to normalise near-duplicate names.
        return f"""
        You are an expert HR Information Extractor.
        Analyze the following CV text and extract the candidate's details
        into the requested JSON schema.

        RULES:
        1. Never invent or hallucinate skills. Only list skills explicitly
           mentioned in the CV.
        2. Skills come from the WHOLE document, not just a section labelled
           "Skills". Extract from all of the following:
           - Sections labelled "Skills", "Technologies", "Techniques",
             "Tools", "Frameworks", "Languages", "Proficiencies"
           - Work-experience bullets (e.g. "Designed APIs" -> "REST APIs",
             "built microservices with Node.js" -> "Node.js", "Microservices")
           - Project descriptions (e.g. "SmartKuppi - React & Node.js app"
             -> "React.js", "Node.js")
        3. Normalise skill names to canonical form and remove duplicates:
           - "NodeJS" and "Node.js" -> output only "Node.js"
           - "React.js" and "ReactJS" and "React" -> output only "React.js"
           - "REST API", "RESTful API", "REST APIs" -> output "REST APIs"
           - "JS" -> "JavaScript"
           - "TS" -> "TypeScript"
           - "Postgres" -> "PostgreSQL"
           - "Mongo" -> "MongoDB"
           - "Spring" alone -> "Spring Boot"
           Output each skill at most once.
        4. Differentiate between 'skills' (Python, React, SQL) and
           'certifications' (MAAT, CA Sri Lanka, AWS SAA).
        5. Capture all academic and professional projects as separate entries.
        6. If a field is not present in the CV, return an empty list or null —
           never fabricate a plausible-looking value.
        7. Preserve the candidate's original spelling for names and companies.
        8. The CV text may contain spurious spaces from PDF extraction
           (e.g. "Ras haan" instead of "Rashaan"). When you see a proper
           noun with an unnatural single-letter split, join the fragments
           into the correct spelling.

        CV TEXT:
        {raw_text}
        """

    # ---------- Entry point ----------
    def run(self, file_path: str) -> ExtractedCandidate:
        """
        Single-pass extraction: PDF text -> structured ExtractedCandidate.

        Retry/fallback/schema handling is provided by GeminiAgentBase;
        this method just prepares the input and delegates.
        """
        raw_text = self.extract_text_from_pdf(file_path)
        prompt = self._build_prompt(raw_text)

        candidate: ExtractedCandidate = self.generate_structured(
            prompt, ExtractedCandidate
        )

        logger.info(
            "Extracted candidate: name=%r, %d skills, %d experience entries",
            candidate.full_name,
            len(candidate.skills),
            len(candidate.experience),
        )
        return candidate