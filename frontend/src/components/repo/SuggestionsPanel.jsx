import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function SuggestionsPanel({ suggestions }) {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <h3 className="font-semibold text-lg">AI Suggestions</h3>
      </CardHeader>

      <CardContent>
        <ul className="text-sm text-gray-700 space-y-2">
          {suggestions.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
