import { Link } from "react-router-dom";
import { Code2, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white dark:bg-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="size-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Code2 className="size-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RepoSensei
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered repository analysis to improve your code quality and productivity.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <Github className="size-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <Twitter className="size-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <Linkedin className="size-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#docs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="#about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="#privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#cookies" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <p>© {currentYear} RepoSensei. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="mailto:hello@reposensei.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
              <Mail className="size-4" />
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}