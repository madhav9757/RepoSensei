import { Skeleton } from "@/components/ui/skeleton";

export default function RepoLoadingSkeleton() {
  return (
    <div className="h-screen flex flex-col space-y-0">
      <div className="h-16 border-b px-6 flex items-center"><Skeleton className="h-8 w-48" /></div>
      <div className="flex-1 flex">
        <div className="w-64 border-r p-4 space-y-4"><Skeleton className="h-8 w-full" /><Skeleton className="h-[70%] w-full" /></div>
        <div className="flex-1 p-8"><Skeleton className="h-full w-full rounded-lg" /></div>
      </div>
    </div>
  );
}
