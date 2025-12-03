import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Code2,
  FileText,
  Shield,
  Zap,
  Download,
  Share2,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import api from "@/utils/api";

export default function Analysis() {
  const { id } = useParams();
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const res = await api.get(`/analysis/${id}`);
        setReport(res.data || generateMockReport());
      } catch (err) {
        console.error("Failed to fetch analysis report:", err);
        setError("Failed to load analysis. Using sample data.");
        setReport(generateMockReport());
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin size-12 border-4 border-gray-200 border-t-blue-600 rounded-full mx-auto" />
          <p className="text-gray-600">Analyzing repository...</p>
        </div>
      </div>
    );
  }

  const overallScore = report.overallScore || 85;
  const scoreColor = overallScore >= 80 ? "text-green-600" : overallScore >= 60 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Link to={`/repo/${id}`}>
            <Button variant="ghost" size="sm" className="gap-2 -ml-2">
              <ArrowLeft className="size-4" />
              Back to Repository
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <TrendingUp className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Analysis Report</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Repository #{id} • Generated {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Share2 className="size-4" />
            Share
          </Button>
          <Button className="gap-2">
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overall Score Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center justify-center text-center md:border-r">
              <div className={`text-6xl font-bold ${scoreColor} mb-2`}>
                {overallScore}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Overall Score</div>
              <Badge className="mt-2" variant={overallScore >= 80 ? "default" : "outline"}>
                {overallScore >= 80 ? "Excellent" : overallScore >= 60 ? "Good" : "Needs Work"}
              </Badge>
            </div>

            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xl font-semibold">Key Findings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ScoreItem
                  icon={Code2}
                  label="Code Quality"
                  value={report.codeQuality || 88}
                  color="green"
                />
                <ScoreItem
                  icon={Shield}
                  label="Security"
                  value={report.security || 92}
                  color="green"
                />
                <ScoreItem
                  icon={FileText}
                  label="Documentation"
                  value={report.documentation || 75}
                  color="yellow"
                />
                <ScoreItem
                  icon={Zap}
                  label="Performance"
                  value={report.performance || 80}
                  color="green"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <StatItem label="Total Lines of Code" value="12,543" />
                <StatItem label="Number of Files" value="89" />
                <StatItem label="Average File Size" value="141 lines" />
                <StatItem label="Code Complexity" value="Moderate" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <TechItem name="JavaScript" percentage={65} />
                <TechItem name="TypeScript" percentage={20} />
                <TechItem name="CSS" percentage={10} />
                <TechItem name="HTML" percentage={5} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-5 text-purple-600" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This repository demonstrates strong coding practices with a well-structured architecture. 
                The codebase maintains high quality standards with consistent formatting and clear naming conventions. 
                Security measures are robust, though there's room for improvement in test coverage. 
                Documentation is comprehensive but could benefit from more inline comments in complex sections.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="mt-6 space-y-4">
          <IssueCard
            severity="high"
            title="Missing Input Validation"
            description="Several API endpoints lack proper input validation which could lead to security vulnerabilities."
            file="src/api/routes.js:45"
          />
          <IssueCard
            severity="medium"
            title="Unused Dependencies"
            description="Found 3 dependencies in package.json that are not used in the codebase."
            file="package.json"
          />
          <IssueCard
            severity="low"
            title="Console Logs in Production"
            description="Remove console.log statements from production code to improve performance."
            file="src/utils/logger.js:12"
          />
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6 space-y-4">
          <RecommendationCard
            title="Improve Test Coverage"
            description="Current test coverage is at 65%. Aim for at least 80% to ensure code reliability."
            priority="high"
            effort="medium"
          />
          <RecommendationCard
            title="Add API Documentation"
            description="Document all API endpoints using OpenAPI/Swagger for better developer experience."
            priority="medium"
            effort="low"
          />
          <RecommendationCard
            title="Optimize Bundle Size"
            description="Consider code splitting and lazy loading to reduce initial bundle size by ~30%."
            priority="medium"
            effort="high"
          />
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Complexity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MetricBar label="Cyclomatic Complexity" value={8.2} max={20} color="green" />
                <MetricBar label="Cognitive Complexity" value={12.5} max={20} color="yellow" />
                <MetricBar label="Maintainability Index" value={75} max={100} color="green" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MetricBar label="Test Coverage" value={65} max={100} color="yellow" />
                <MetricBar label="Documentation" value={78} max={100} color="green" />
                <MetricBar label="Code Duplication" value={5} max={100} color="green" inverted />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ScoreItem({ icon: Icon, label, value, color }) {
  const colorClasses = {
    green: "text-green-600 bg-green-100 dark:bg-green-900/30",
    yellow: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
    red: "text-red-600 bg-red-100 dark:bg-red-900/30"
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`size-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
        <Icon className="size-5" />
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
      </div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function TechItem({ name, percentage }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{name}</span>
        <span className="text-gray-600">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

function IssueCard({ severity, title, description, file }) {
  const severityConfig = {
    high: { color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30", label: "High" },
    medium: { color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30", label: "Medium" },
    low: { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-800", label: "Low" }
  };

  const config = severityConfig[severity];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`size-10 rounded-lg flex items-center justify-center ${config.bg} shrink-0`}>
            <AlertTriangle className={`size-5 ${config.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-semibold">{title}</h3>
              <Badge variant="outline" className={config.color}>{config.label}</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{description}</p>
            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{file}</code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RecommendationCard({ title, description, priority, effort }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <CheckCircle className="size-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-semibold">{title}</h3>
              <div className="flex gap-2">
                <Badge variant="outline">{priority} priority</Badge>
                <Badge variant="outline">{effort} effort</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricBar({ label, value, max, color, inverted = false }) {
  const percentage = (value / max) * 100;
  const displayValue = inverted ? max - value : value;
  
  const colorClasses = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500"
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-gray-600">{displayValue.toFixed(1)}</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Mock data generator for demo purposes
function generateMockReport() {
  return {
    overallScore: 85,
    codeQuality: 88,
    security: 92,
    documentation: 75,
    performance: 80
  };
}