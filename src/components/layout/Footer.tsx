import { Book } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">Bedtimey</span>
            </div>
            <p className="text-sm text-gray-500">
              Made with ❤️ for bedtime stories
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/pricing" className="text-gray-500 hover:text-gray-900">Pricing</Link>
              </li>
              <li>
                <Link to="/stories" className="text-gray-500 hover:text-gray-900">Stories</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-gray-900">Contact</Link>
              </li>
              <li>
                <a href="mailto:support@bedtimey.com" className="text-gray-500 hover:text-gray-900">
                  Email Support
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-gray-500 hover:text-gray-900">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-500 hover:text-gray-900">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Bedtimey. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}