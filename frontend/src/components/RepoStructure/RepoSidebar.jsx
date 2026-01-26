"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, HardDrive, Filter } from "lucide-react";
import RepoFileTree from "./RepoFileTree";
import { Separator } from "@/components/ui/separator";

export default function RepoSidebar({ tree, selectedFilePath, setSelectedFilePath }) {
  const [search, setSearch] = useState("");

  return (
    <aside className="w-64 lg:w-72 border-r flex flex-col bg-muted/5 backdrop-blur-sm overflow-hidden h-full">
      <div className="p-4 space-y-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive size={14} className="text-primary/70" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Explorer</span>
          </div>
          <Filter size={12} className="text-muted-foreground/50 hover:text-primary cursor-pointer transition-colors" />
        </div>

        <div className="relative group">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="pl-8 h-8 text-xs bg-background/50 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/30"
          />
        </div>
      </div>

      <Separator className="opacity-50" />

      <ScrollArea className="flex-1">
        <div className="p-3 pb-6">
          {Object.keys(tree).length > 0 ? (
            Object.keys(tree).sort((a, b) => {
              const aIsFolder = typeof tree[a] === "object";
              const bIsFolder = typeof tree[b] === "object";
              if (aIsFolder && !bIsFolder) return -1;
              if (!aIsFolder && bIsFolder) return 1;
              return a.localeCompare(b);
            }).map(key => (
              <RepoFileTree
                key={key}
                node={tree[key]}
                name={key}
                path=""
                search={search}
                selectedFilePath={selectedFilePath}
                setSelectedFilePath={setSelectedFilePath}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center opacity-50">
              <Search size={24} className="mb-2" />
              <p className="text-[10px] font-medium uppercase tracking-tighter">No files found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
