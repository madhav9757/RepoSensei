import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Code2, AlertCircle, Activity, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function RepoCard({ repo }) {
  const {
    id,
    name,
    description,
    language,
    stargazers_count: stars,
    forks_count: forks,
    hasAnalysis = false,
    score = 0,
    owner,
  } = repo;

  const getScoreVariant = (val) => {
    if (val >= 80) return "default";
    if (val >= 60) return "secondary";
    return "outline";
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link to={`/repo/${owner.login}/${name}`} className="block">
        <Card className="hover:shadow-2xl transition-all flex flex-col h-full rounded-2xl border border-border bg-background/80 backdrop-blur">
          {/* Header */}
          <CardHeader className="pb-2 flex justify-between items-start">
            <CardTitle className="text-lg font-semibold truncate flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              {name}
            </CardTitle>

            {hasAnalysis ? (
              <Badge variant={getScoreVariant(score)} className="px-2 py-1">
                {score}/100
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="flex items-center gap-1 text-yellow-600 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-600 dark:bg-yellow-900/20 px-2 py-1"
              >
                <AlertCircle className="w-4 h-4" /> Pending
              </Badge>
            )}
          </CardHeader>

          {/* Content */}
          <CardContent className="flex-1 flex flex-col justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {description || "No description available"}
            </p>

            <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 dark:text-gray-400 gap-2">
              {language && (
                <div className="flex items-center gap-1">
                  <Code2 className="w-4 h-4 text-purple-500" /> <span>{language}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" /> {stars}
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="w-4 h-4 text-green-400" /> {forks}
              </div>
              {hasAnalysis && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-blue-400" /> Score Boost
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
