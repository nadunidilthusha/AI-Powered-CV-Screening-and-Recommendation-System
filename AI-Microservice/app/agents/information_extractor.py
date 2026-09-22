"""
AI Agent 01 – Information Extractor

Takes a candidate's CV (PDF) and produces a structured ExtractedCandidate
object. Each checklist item below has its own method so the actual AI/LLM
implementation can be filled in independently, method by method.
"""

from app.schemas.candidate import ExtractedCandidate


class InformationExtractorAgent:
    def extract_text_from_pdf(self, file_path: str) -> str:
        """
        PDF text extraction.
        TODO: use pdfplumber or PyPDF2 (already in requirements.txt) to pull
        raw text out of the CV PDF at `file_path`. Handle scanned/image-only
        PDFs as a known edge case (may need OCR, or should raise a clear
        error the caller can turn into processingStatus='Failed').
        """
        raise NotImplementedError("extract_text_from_pdf not implemented yet")

    def extract_candidate_name(self, raw_text: str) -> str | None:
        """
        Extract candidate name.
        TODO: identify the candidate's full name from the raw CV text
        (typically the first prominent line/heading).
        """
        raise NotImplementedError("extract_candidate_name not implemented yet")

    def extract_contact_info(self, raw_text: str) -> dict:
        """
        Extract contact information.
        TODO: pull email and phone number from the raw CV text.
        Return shape: {"email": str | None, "phone": str | None}
        """
        raise NotImplementedError("extract_contact_info not implemented yet")

    def extract_education(self, raw_text: str) -> list[str]:
        """
        Extract education.
        TODO: pull degrees/institutions/years into a list of strings
        (or richer structured entries, if the team prefers).
        """
        raise NotImplementedError("extract_education not implemented yet")

    def extract_experience(self, raw_text: str) -> list[str]:
        """
        Extract experience.
        TODO: pull work history entries (role, company, duration) into a list.
        """
        raise NotImplementedError("extract_experience not implemented yet")

    def extract_technical_skills(self, raw_text: str) -> list[str]:
        """
        Extract technical skills.
        TODO: pull a list of technical skills mentioned in the CV.
        REL-2 (SRS): must only extract skills actually present in the text —
        never invent skills the candidate didn't list.
        """
        raise NotImplementedError("extract_technical_skills not implemented yet")

    def run(self, file_path: str) -> ExtractedCandidate:
        """
        Generate structured candidate JSON.
        Orchestrates the methods above into one ExtractedCandidate object.
        This is the only method the pipeline orchestrator calls directly —
        implement the methods above first, then wire them together here.
        """
        raw_text = self.extract_text_from_pdf(file_path)
        contact = self.extract_contact_info(raw_text)

        return ExtractedCandidate(
            full_name=self.extract_candidate_name(raw_text),
            email=contact.get("email"),
            phone=contact.get("phone"),
            education=self.extract_education(raw_text),
            experience=self.extract_experience(raw_text),
            skills=self.extract_technical_skills(raw_text),
        )
