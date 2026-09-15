import { FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ExportPdfButton = ({ data }) => {
  const handleExport = () => {
    if (!data || data.length === 0) return alert("No data to export.");

    try {
      // Initialize the PDF document
      const doc = new jsPDF();
      
      // Add a title
      doc.text("Candidate Ranking Report", 14, 15);
      
      // Define table columns and map the data
      const tableColumn = ["Rank", "Name", "Email", "Match %", "Recommendation"];
      const tableRows = data.map(c => [
        c.rank,
        c.name,
        c.email,
        `${c.match}%`,
        c.recommendation
      ]);

      // Generate the table using the direct autoTable function
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [37, 99, 235] } // Tailwind blue-600
      });

      // Download the valid PDF
      doc.save("candidates_ranking.pdf");
      
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please check the browser console.");
    }
  };

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 px-4 h-[42px] bg-blue-600 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
    >
      <FileText size={16} />
      Export PDF
    </button>
  );
};

export default ExportPdfButton;