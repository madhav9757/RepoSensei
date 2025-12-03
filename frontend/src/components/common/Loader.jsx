import { Code2 } from "lucide-react";

export default function Loader({ message = "Loading...", fullScreen = false }) {
  const content = (
    <div className="text-center space-y-4">
      <div className="relative size-16 mx-auto">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Code2 className="size-6 text-blue-600" />
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
}