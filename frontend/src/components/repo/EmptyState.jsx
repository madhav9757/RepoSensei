// src/components/EmptyState.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, GitBranch } from "lucide-react";
import OAuthButton from "@/components/auth/OAuthButton";

export default function EmptyState({ searchQuery, onClear }) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="size-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          {searchQuery ? (
            <AlertCircle className="size-8 text-gray-400" />
          ) : (
            <GitBranch className="size-8 text-gray-400" />
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2">
          {searchQuery ? "No repositories found" : "No repositories yet"}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {searchQuery
            ? "Try adjusting your search or filters."
            : "Connect your GitHub account to get started."}
        </p>
        {searchQuery ? (
          <Button onClick={onClear} variant="outline">
            Clear Filters
          </Button>
        ) : (
          <OAuthButton />
        )}
      </CardContent>
    </Card>
  );
}
