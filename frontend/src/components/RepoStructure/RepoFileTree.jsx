"use client";

import { useState, useEffect } from "react";
import {
  Folder,
  FolderOpen,
  File,
  ChevronDown,
  ChevronRight,
  FileCode,
  FileJson,
  FileText,
  Terminal,
  Hash
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Enhanced file icon mapping for visual hierarchy
 */
const getFileIcon = (fileName, isSelected) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const iconProps = {
    size: 14,
    className: cn("mr-2.5 shrink-0 transition-colors",
      isSelected ? "text-primary" : "text-muted-foreground/60 group-hover:text-muted-foreground")
  };

  switch (extension) {
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
      return <FileCode {...iconProps} className={cn(iconProps.className, !isSelected && "text-blue-500/70")} />;
    case "json":
      return <FileJson {...iconProps} className={cn(iconProps.className, !isSelected && "text-amber-500/70")} />;
    case "md":
      return <FileText {...iconProps} />;
    case "sh":
      return <Terminal {...iconProps} />;
    case "css":
    case "scss":
      return <Hash {...iconProps} className={cn(iconProps.className, !isSelected && "text-pink-500/70")} />;
    default:
      return <File {...iconProps} />;
  }
};

export default function RepoFileTree({
  node,
  name,
  path = "",
  search,
  selectedFilePath,
  setSelectedFilePath,
  level = 0,
}) {
  const currentPath = path ? `${path}/${name}` : name;

  const isSelected = selectedFilePath === currentPath;
  const isFolder = node && typeof node === "object";

  // Check if this folder contains the selected file
  const containsSelectedFile = isFolder && selectedFilePath && selectedFilePath.startsWith(currentPath + "/");

  // Helper to check if this node or any children match the search
  const hasMatch = (n, term) => {
    if (!term) return true;
    // Check current node name (if it's a file or folder)
    // NOTE: In this recursive structure, we don't have the name of *this* node easily available inside the recursion for children without passing it.
    // Actually, 'name' prop is the name of THIS node.
    // So we check our name.
    if (name.toLowerCase().includes(term.toLowerCase())) return true;

    // If folder, check children
    if (n && typeof n === "object") {
      return Object.keys(n).some(key => {
        // We need to check if the child node has a match. 
        // We can't easily reuse 'hasMatch' here because 'hasMatch' logic assumes it's 'name' + 'node'.
        // Let's make a recursive static helper or use a simpler approach.

        // Simpler recursive approach for children:
        const childNode = n[key];
        const childName = key;

        // Check child name
        if (childName.toLowerCase().includes(term.toLowerCase())) return true;

        // Recurse if child is folder
        if (childNode && typeof childNode === "object") {
          // We need a standalone recursive function for the raw object tree
          return checkTreeMatch(childNode, term);
        }
        return false;
      });
    }
    return false;
  };

  // Standalone recursive helper for the object tree
  function checkTreeMatch(treeNode, term) {
    if (!treeNode || typeof treeNode !== 'object') return false;
    return Object.keys(treeNode).some(key => {
      if (key.toLowerCase().includes(term.toLowerCase())) return true;
      return checkTreeMatch(treeNode[key], term);
    });
  }

  const matchesInfo = hasMatch(node, search);

  // If search is active and this node (or descendants) doesn't match, hide it.
  if (search && !matchesInfo) {
    return null;
  }

  // Auto-expand if search is active and we have matches inside (but we are not the direct match)
  // i.e., I am a folder, and my name might NOT match, but my children DO match.
  const childrenMatch = search && node && typeof node === 'object' && checkTreeMatch(node, search);

  const [open, setOpen] = useState(level < 1 || containsSelectedFile);

  useEffect(() => {
    if (childrenMatch) {
      setOpen(true);
    }
  }, [childrenMatch, search]);

  // Auto-expand if the selected file is inside this folder
  useEffect(() => {
    if (containsSelectedFile) {
      setOpen(true);
    }
  }, [containsSelectedFile]);

  return (
    <div className="w-full select-none">
      <div
        className={cn(
          "group flex items-center justify-between cursor-pointer rounded-md px-2 py-1.5 transition-all duration-200",
          isSelected
            ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(var(--primary),0.1)]"
            : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
        )}
        onClick={() => (isFolder ? setOpen(!open) : setSelectedFilePath(currentPath))}
      >
        <div className="flex items-center flex-1 min-w-0">
          {/* Chevron container - fixed width to align items */}
          <div className="w-4 flex items-center justify-center mr-1">
            {isFolder && (
              <span className="text-muted-foreground/40 group-hover:text-muted-foreground transition-transform">
                {open ? <ChevronDown size={12} strokeWidth={3} /> : <ChevronRight size={12} strokeWidth={3} />}
              </span>
            )}
          </div>

          {/* Folder/File Icon */}
          {isFolder ? (
            open ? (
              <FolderOpen size={14} className="mr-2.5 text-blue-500 fill-blue-500/10 shrink-0" />
            ) : (
              <Folder size={14} className="mr-2.5 text-blue-400/80 fill-blue-400/5 shrink-0" />
            )
          ) : (
            getFileIcon(name, isSelected)
          )}

          {/* Label */}
          <span
            className={cn(
              "text-[13px] truncate tracking-tight",
              isFolder ? "font-semibold opacity-90" : "font-medium opacity-80",
              isSelected && "opacity-100 font-bold"
            )}
          >
            {name}
          </span>
        </div>

        {/* Subtle Indicator for Active File */}
        {isSelected && (
          <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
        )}
      </div>

      {/* Recursive Children */}
      {isFolder && open && (
        <div className="relative ml-[11px] mt-0.5 border-l border-border/40 pl-2">
          {Object.keys(node)
            .sort((a, b) => {
              // Sort folders first, then files alphabetically
              const aIsFolder = typeof node[a] === "object";
              const bIsFolder = typeof node[b] === "object";
              if (aIsFolder && !bIsFolder) return -1;
              if (!aIsFolder && bIsFolder) return 1;
              return a.localeCompare(b);
            })
            .map((key) => (
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