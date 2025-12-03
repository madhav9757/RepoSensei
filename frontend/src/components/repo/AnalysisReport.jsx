export default function AnalysisReport({ report }) {
  if (!report || Object.keys(report).length === 0) {
    return <p className="text-gray-500">No analysis data available.</p>;
  }

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Analysis Report</h2>

      {Object.keys(report).map((section, index) => (
        <div key={index} className="mb-4">
          <h3 className="font-semibold">{section}</h3>
          <p className="text-sm text-gray-700">{report[section]}</p>
        </div>
      ))}
    </div>
  );
}
