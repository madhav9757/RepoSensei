import api from "@/api/api";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2, Terminal, Sparkles, X, ChevronRight, AlertTriangle, Lightbulb } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import useFileAnalysisStore from "@/store/useFileAnalysisStore";

export default function FileViewer({ owner, repo, branch = "main", selectedFilePath }) {
  const [fileContent, setFileContent] = useState("");
  const [fetchingFile, setFetchingFile] = useState(false);
  const [copied, setCopied] = useState(false);

  // Store Integration
  const { analyzeFile, getCachedAnalysis, loading: analyzing } = useFileAnalysisStore();
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Derived state from store cache
  // We use a key to lookup the specific analysis for this file version
  const cachedAnalysis = getCachedAnalysis(owner, repo, selectedFilePath);

  useEffect(() => {
    if (!selectedFilePath) return;

    // Reset view state when file changes
    setShowAnalysis(false);

    const fetchContent = async () => {
      setFetchingFile(true);
      try {
        console.log("Fetching file via API:", selectedFilePath);
        const res = await api.get(`/repos/${owner}/${repo}/content`, {
          params: {
            path: selectedFilePath,
            ref: branch
          }
        });

        setFileContent(res.data.data || "// Empty file");
      } catch (err) {
        console.error("Failed to fetch file content:", err);
        setFileContent(`// Error loading file: ${err.response?.data?.message || err.message}`);
      } finally {
        setFetchingFile(false);
      }
    };

    fetchContent();
  }, [selectedFilePath, owner, repo, branch, getCachedAnalysis]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleAnalyze = async () => {
    if (!fileContent || fileContent.startsWith("// Error")) return;

    setShowAnalysis(true);

    // If we already have cached results, we don't need to do anything else (UI updates automatically via getCachedAnalysis)
    // But we check just in case we want to force refresh? For now, assume cache is good until cleared.
    if (!cachedAnalysis) {
      await analyzeFile(owner, repo, selectedFilePath, fileContent);
    }
  };

  if (!selectedFilePath) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500">
        Select a file to view content
      </div>
    );
  }

  return (
    <section className="flex-1 flex flex-col bg-[#0d0d0d] overflow-hidden relative">
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

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAnalyze}
            disabled={analyzing || fetchingFile}
            className={`h-7 text-[10px] gap-1.5 border-purple-500/20 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 ${cachedAnalysis ? "border-purple-500/50 bg-purple-500/20" : ""}`}
          >
            {analyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            {cachedAnalysis ? "View Analysis" : "Analyze"}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-500 hover:text-white transition-colors"
            onClick={copyToClipboard}
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </Button>
        </div>
      </div>

      <div className="flex-1 relative flex overflow-hidden">
        {/* --- Scrollable Code Area --- */}
        <ScrollArea className={`flex-1 relative overflow-auto transition-all duration-300 ${showAnalysis ? 'w-2/3' : 'w-full'}`}>
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

        {/* --- Analysis Panel --- */}
        <AnimatePresence>
          {showAnalysis && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-1/3 min-w-[300px] border-l border-white/10 bg-[#111] shadow-2xl z-20 flex flex-col"
            >
              <div className="flex items-center justify-between p-3 border-b border-white/5 bg-[#161616]">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">AI Insights</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-zinc-500 hover:text-white"
                  onClick={() => setShowAnalysis(false)}
                >
                  <X size={14} />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4">
                {analyzing ? (
                  <div className="flex flex-col items-center justify-center h-40 space-y-3">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                    <p className="text-xs text-zinc-500 animate-pulse">Analyzing code structure...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cachedAnalysis?.map((item, idx) => (
                      <div key={idx} className="rounded-lg border border-white/5 bg-white/5 p-3 space-y-2 hover:border-white/10 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {item.type === 'bug' && <AlertTriangle className="h-3.5 w-3.5 text-red-400" />}
                            {item.type === 'optimization' && <Lightbulb className="h-3.5 w-3.5 text-amber-400" />}
                            {!['bug', 'optimization'].includes(item.type) && <Sparkles className="h-3.5 w-3.5 text-blue-400" />}
                            <span className="text-[11px] font-bold text-zinc-200">{item.suggestion}</span>
                          </div>
                          <Badge variant="outline" className={`text-[9px] px-1.5 py-0 border-0 uppercase ${item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              item.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-blue-500/20 text-blue-400'
                            }`}>
                            {item.priority}
                          </Badge>
                        </div>

                        <p className="text-[11px] leading-relaxed text-zinc-400">
                          {item.description}
                        </p>

                        {item.suggestedCode && (
                          <div className="mt-2 rounded bg-black/40 border border-white/5 p-2 overflow-x-auto">
                            <pre className="text-[10px] font-mono text-emerald-400">
                              {item.suggestedCode}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                    {!cachedAnalysis?.length && !analyzing && (
                      <div className="text-center py-8 text-zinc-500">
                        <p className="text-xs">
                          {cachedAnalysis ? "No improvements found." : "Click Analyze to scan this file."}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
