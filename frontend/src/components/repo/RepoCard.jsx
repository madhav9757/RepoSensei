import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Code2, AlertCircle } from "lucide-react";

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
    <Link to={`/repo/${owner.login}/${name}`} className="block">
      <Card className="hover:shadow-lg transition-all h-full flex flex-col hover:-translate-y-1">
        <CardHeader className="pb-2 flex justify-between items-start">
          <CardTitle className="text-lg font-semibold truncate">{name}</CardTitle>

          {hasAnalysis ? (
            <Badge variant={getScoreVariant(score)}>{score}/100</Badge>
          ) : (
            <Badge
              variant="outline"
              className="flex items-center gap-1 text-yellow-600 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-600 dark:bg-yellow-900/20"
            >
              <AlertCircle className="size-3" /> Pending
            </Badge>
          )}
        </CardHeader>

        <CardContent className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {description || "No description"}
          </p>

          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            {language && (
              <div className="flex items-center gap-1">
                <Code2 className="size-4" /> <span>{language}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="size-4" /> {stars}
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="size-4" /> {forks}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
