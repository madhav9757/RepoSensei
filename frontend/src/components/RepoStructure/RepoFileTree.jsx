"use client";
import { useState } from "react";
import { Folder, FolderOpen, File, ChevronDown, ChevronRight } from "lucide-react";

export default function RepoFileTree({ node, name, path = "", search, selectedFilePath, setSelectedFilePath, level = 0 }) {
  const currentPath = path ? `${path}/${name}` : name;
  const [open, setOpen] = useState(level < 1);
  const isFolder = node && typeof node === "object";
  const isSelected = selectedFilePath === currentPath;

  if (search && !name.toLowerCase().includes(search.toLowerCase()) && !isFolder) return null;

  return (
    <div className="w-full">
      <div
        className={`group flex items-center justify-between cursor-pointer rounded-md px-2 py-1 transition-colors
          ${isSelected ? "bg-primary/10 text-primary" : "hover:bg-accent/40"}`}
        onClick={() => isFolder ? setOpen(!open) : setSelectedFilePath(currentPath)}
      >
        <div className="flex items-center flex-1 min-w-0">
          {isFolder ? (
            <span className="mr-1 text-muted-foreground/50 group-hover:text-foreground">
              {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </span>
          ) : <span className="w-4" />}

          {isFolder ? (
            open ? <FolderOpen size={14} className="mr-2 text-blue-500/80" /> : <Folder size={14} className="mr-2 text-blue-400/80" />
          ) : (
            <File size={14} className={`mr-2 ${isSelected ? "text-primary" : "text-muted-foreground/60"}`} />
          )}
          <span className={`text-[13px] truncate ${isFolder ? "font-semibold text-foreground/80" : "text-foreground/70"}`}>
            {name}
          </span>
        </div>
      </div>

      {isFolder && open && (
        <div className="ml-3 border-l border-border/60 pl-1 mt-0.5">
          {Object.keys(node).sort().map(key => (
            <RepoFileTree
              key={key}
              node={node[key]}
              name={key}
              path={currentPath}
              search={search}
              selectedFilePath={selectedFilePath}
              setSelectedFilePath={setSelectedFilePath}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
