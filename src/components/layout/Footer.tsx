import { Book } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-600">Story Time © 2024</span>
          </div>
          <div className="text-sm text-gray-500">
            Made with ❤️ for bedtime stories
          </div>
        </div>
      </div>
    </footer>
  );
}