import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RepoCard({ repo }) {
  return (
    <Link to={`/repo/${repo.id}`}>
      <Card className="hover:shadow-lg transition">
        <CardHeader>
          <CardTitle>{repo.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">{repo.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
