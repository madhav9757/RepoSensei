import { useState } from "react";
import { Folder, FileText } from "lucide-react";

export default function RepoTree({ tree }) {
  // Each folder can be expanded/collapsed
  const [expandedPaths, setExpandedPaths] = useState({});

  const toggleFolder = (path) => {
    setExpandedPaths((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  // Helper to recursively render tree structure
  const renderTree = (items, parentPath = "") => {
    return items
      .filter((item) => item.path.startsWith(parentPath))
      .map((item) => {
        const isFolder = item.type === "tree";
        const name = item.path.replace(parentPath, "").split("/")[0];
        const fullPath = parentPath ? `${parentPath}/${name}` : name;

        // Only render top-level items under current parent
        if (name.includes("/")) return null;

        if (isFolder) {
          const folderContents = tree.filter(
            (child) =>
              child.path !== fullPath &&
              child.path.startsWith(`${fullPath}/`)
          );

          return (
            <div key={fullPath} className="ml-4">
              <div
                className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded"
                onClick={() => toggleFolder(fullPath)}
              >
                <Folder className="mr-1 w-4 h-4" />
                <span>{name}</span>
              </div>
              {expandedPaths[fullPath] && folderContents.length > 0 && (
                <div className="ml-4">{renderTree(folderContents, fullPath)}</div>
              )}
            </div>
          );
        } else {
          return (
            <div
              key={fullPath}
              className="flex items-center ml-4 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FileText className="mr-1 w-4 h-4" />
              <span>{name}</span>
            </div>
          );
        }
      });
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded p-2">
      <h3 className="font-semibold mb-2">Repository Files</h3>
      {renderTree(tree)}
    </div>
  );
}
