import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Code2, AlertCircle, Activity, ChevronRight, Github } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function RepoCard({ repo }) {
  const {
    name,
    description,
    language,
    stargazers_count: stars,
    forks_count: forks,
    hasAnalysis = false,
    score = 0,
    owner,
    private: isPrivate
  } = repo;

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Link to={`/repo/${owner.login}/${name}`} className="block h-full">
        <Card className="group relative flex h-full flex-col overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
          {/* Subtle background gradient on hover */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <CardHeader className="space-y-4 pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Github size={16} />
                </div>
                <div className="space-y-0.5">
                  <CardTitle className="text-[15px] font-bold tracking-tight">
                    {name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-bold uppercase tracking-wider">
                      {isPrivate ? "Private" : "Public"}
                    </Badge>
                  </div>
                </div>
              </div>

              {hasAnalysis ? (
                <div className="text-right">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Score</div>
                  <div className="text-lg font-black text-primary leading-none">{score}</div>
                </div>
              ) : (
                <Badge variant="secondary" className="h-5 px-1.5 text-[9px] font-bold uppercase gap-1 bg-amber-500/10 text-amber-600 border-none">
                  <Activity size={10} className="animate-pulse" />
                  Live
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col justify-between space-y-4">
            <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground/80">
              {description || "No description provided for this repository."}
            </p>

            <div className="flex items-center justify-between border-t border-border/40 pt-4">
              <div className="flex items-center gap-4">
                {language && (
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-primary/60" />
                    <span className="text-[11px] font-bold text-muted-foreground">{language}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground/70">
                  <Star size={12} className="text-amber-500 fill-amber-500/20" />
                  {stars}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground/70">
                  <GitFork size={12} className="text-blue-500" />
                  {forks}
                </div>
              </div>

              <ChevronRight size={14} className="text-muted-foreground/30 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
