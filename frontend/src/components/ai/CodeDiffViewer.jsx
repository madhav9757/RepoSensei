"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/**
 * GitHub-style code diff viewer
 * Shows old code in red and new code in green
 */
export default function CodeDiffViewer({ suggestion, onClose }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [copied, setCopied] = useState(false);

    const {
        file,
        type,
        priority,
        suggestion: description,
        originalCode = "",
        suggestedCode = "",
    } = suggestion;

    // Split code into lines for diff display
    const originalLines = originalCode.split("\n");
    const suggestedLines = suggestedCode.split("\n");

    const handleCopy = () => {
        navigator.clipboard.writeText(suggestedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-5xl max-h-[90vh] overflow-hidden"
            >
                <Card className="border-border/50 bg-card shadow-2xl">
                    <CardHeader className="space-y-4 pb-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="font-mono text-xs">
                                        {file}
                                    </Badge>
                                    <Badge
                                        variant={
                                            priority === "high"
                                                ? "destructive"
                                                : priority === "medium"
                                                    ? "default"
                                                    : "secondary"
                                        }
                                        className="text-xs"
                                    >
                                        {priority}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {type}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg font-bold">
                                    Code Improvement Suggestion
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">{description}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="h-8 w-8 p-0"
                                >
                                    {isExpanded ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <CardContent className="space-y-4 pt-0">
                                    <Separator />

                                    {/* Diff View */}
                                    <div className="space-y-4">
                                        {/* Original Code (Red) */}
                                        {originalCode && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                        Original Code
                                                    </h4>
                                                    <Badge
                                                        variant="outline"
                                                        className="border-red-500/20 bg-red-500/10 text-red-600"
                                                    >
                                                        - Removed
                                                    </Badge>
                                                </div>
                                                <div className="overflow-x-auto rounded-lg border border-red-500/20 bg-red-500/5">
                                                    <pre className="p-4 text-xs font-mono leading-relaxed">
                                                        {originalLines.map((line, idx) => (
                                                            <div
                                                                key={`old-${idx}`}
                                                                className="flex hover:bg-red-500/10 transition-colors"
                                                            >
                                                                <span className="inline-block w-12 select-none text-right pr-4 text-muted-foreground/50">
                                                                    {idx + 1}
                                                                </span>
                                                                <span className="text-red-600 flex-1">
                                                                    <span className="text-red-500 mr-2">-</span>
                                                                    {line || " "}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </pre>
                                                </div>
                                            </div>
                                        )}

                                        {/* Suggested Code (Green) */}
                                        {suggestedCode && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                        Suggested Code
                                                    </h4>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                                                        >
                                                            + Added
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={handleCopy}
                                                            className="h-7 gap-2 text-xs"
                                                        >
                                                            {copied ? (
                                                                <>
                                                                    <Check className="h-3 w-3" />
                                                                    Copied
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="h-3 w-3" />
                                                                    Copy
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="overflow-x-auto rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                                                    <pre className="p-4 text-xs font-mono leading-relaxed">
                                                        {suggestedLines.map((line, idx) => (
                                                            <div
                                                                key={`new-${idx}`}
                                                                className="flex hover:bg-emerald-500/10 transition-colors"
                                                            >
                                                                <span className="inline-block w-12 select-none text-right pr-4 text-muted-foreground/50">
                                                                    {idx + 1}
                                                                </span>
                                                                <span className="text-emerald-600 flex-1">
                                                                    <span className="text-emerald-500 mr-2">+</span>
                                                                    {line || " "}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </pre>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end gap-2 pt-4">
                                        <Button variant="outline" size="sm" onClick={onClose}>
                                            Close
                                        </Button>
                                        <Button size="sm" className="gap-2">
                                            <Check className="h-4 w-4" />
                                            Apply Changes
                                        </Button>
                                    </div>
                                </CardContent>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </motion.div>
        </motion.div>
    );
}
