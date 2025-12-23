"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, HardDrive } from "lucide-react";
import RepoFileTree from "./RepoFileTree";

export default function RepoSidebar({ tree, files, selectedFilePath, setSelectedFilePath }) {
  const [search, setSearch] = useState("");

  return (
    <aside className="w-64 lg:w-72 border-r flex flex-col bg-muted/5">
      <div className="p-4 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Project Files</span>
          <HardDrive size={12} className="text-muted-foreground/50" />
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find a file..." 
            className="pl-8 h-8 text-xs bg-background/50 border-border/50 focus-visible:ring-1" 
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="pb-6">
          {Object.keys(tree).sort().map(key => (
            <RepoFileTree
              key={key}
              node={tree[key]}
              name={key}
              path=""
              search={search}
              selectedFilePath={selectedFilePath}
              setSelectedFilePath={setSelectedFilePath}
            />
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
