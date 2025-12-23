"use client";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2, Terminal } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function FileViewer({ owner, repo, branch = "main", selectedFilePath }) {
  const [fileContent, setFileContent] = useState("");
  const [fetchingFile, setFetchingFile] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!selectedFilePath) return;

    const fetchContent = async () => {
      setFetchingFile(true);
      try {
        const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodeURIComponent(selectedFilePath)}`;
        console.log("Fetching file:", url);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const text = await res.text();
        setFileContent(text);
      } catch (err) {
        console.error(err);
        setFileContent("// Error loading file.");
      } finally {
        setFetchingFile(false);
      }
    };

    fetchContent();
  }, [selectedFilePath, owner, repo, branch]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!selectedFilePath) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500">
        Select a file to view content
      </div>
    );
  }

  return (
    <section className="flex-1 flex flex-col bg-[#0d0d0d] overflow-hidden">
      {/* --- Sticky File Header --- */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-[#161616] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500/10 p-1 rounded">
            <Terminal size={12} className="text-blue-400" />
          </div>
          <span className="text-[11px] font-mono text-zinc-300 tracking-tight italic">
            {selectedFilePath}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-zinc-500 hover:text-white transition-colors"
          onClick={copyToClipboard}
        >
          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
        </Button>
      </div>

      {/* --- Scrollable Code Area --- */}
      <ScrollArea className="flex-1 relative overflow-auto">
        {fetchingFile && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-primary h-6 w-6" />
          </div>
        )}
        <div className="min-h-full pr-4">
          <SyntaxHighlighter
            language={selectedFilePath.split(".").pop() || "javascript"}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: "24px",
              background: "transparent",
              fontSize: "12px",
              lineHeight: "1.6",
            }}
            showLineNumbers
          >
            {fileContent || " "}
          </SyntaxHighlighter>
        </div>
      </ScrollArea>
    </section>
  );
}
