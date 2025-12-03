export default function RepoTree({ tree }) {
  return (
    <div className="border p-4 rounded-lg bg-gray-50">
      <h2 className="font-semibold mb-2">Repository Structure</h2>

      <ul className="text-sm">
        {tree.map((file, index) => (
          <li key={index} className="py-1">
            📄 {file}
          </li>
        ))}
      </ul>
    </div>
  );
}
