// src/components/RepoCard.jsx
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Code2, AlertCircle } from "lucide-react";

export default function RepoCard({ repo }) {
  // Safe destructuring
  const {
    id,
    name = "Untitled Repository",
    description = "No description provided.",
    language,
    stargazers_count: stars = 0,
    forks_count: forks = 0,
    score = 0,
    hasAnalysis = false,
  } = repo;

  // Score badge style
  const getScoreVariant = (val) => {
    if (val >= 80) return "default";     // green / primary
    if (val >= 60) return "secondary";   // calmer tone
    return "outline";                    // grey outline
  };

  return (
    <Link to={`/repo/${id}`} className="block">
      <Card className="hover:shadow-lg transition-all h-full flex flex-col hover:-translate-y-1">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold truncate">
              {name}
            </CardTitle>

            {/* Score badge */}
            {hasAnalysis && (
              <Badge variant={getScoreVariant(score)} className="shrink-0">
                {score}/100
              </Badge>
            )}

            {/* Pending badge */}
            {!hasAnalysis && (
              <Badge
                variant="outline"
                className="shrink-0 text-yellow-600 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-600 dark:bg-yellow-900/20 flex items-center gap-1"
              >
                <AlertCircle className="size-3" />
                Pending
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {description}
          </p>

          {/* Metadata */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">

            {/* Language */}
            {language && (
              <div className="flex items-center gap-1">
                <Code2 className="size-4" />
                <span>{language}</span>
              </div>
            )}

            {/* Stars */}
            <div className="flex items-center gap-1">
              <Star className="size-4" />
              <span>{stars}</span>
            </div>

            {/* Forks */}
            <div className="flex items-center gap-1">
              <GitFork className="size-4" />
              <span>{forks}</span>
            </div>

          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
