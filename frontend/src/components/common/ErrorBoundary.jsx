import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
          <Card className="max-w-lg w-full">
            <CardContent className="p-8 text-center space-y-6">
              <div className="size-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
                <AlertTriangle className="size-8 text-red-600 dark:text-red-400" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  We're sorry for the inconvenience. The application encountered an unexpected error.
                </p>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="text-left">
                  <summary className="cursor-pointer text-sm font-medium mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-48">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex gap-3 justify-center">
                <Button onClick={this.handleReset} className="gap-2">
                  <RefreshCw className="size-4" />
                  Go to Home
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;