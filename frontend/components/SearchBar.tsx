"use client";

import { Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SearchResult {
  id: string;
  title: string;
}

interface SearchBarProps {
  onResultClick: (postId: string) => void;
}

export default function SearchBar({ onResultClick }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close results when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?search=${encodeURIComponent(searchTerm)}`,
      );
      const data = await res.json();

      if (res.ok) {
        setResults(data);
        setShowResults(true);
      } else {
        console.error("Error:", data.error);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Also search while typing (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        handleSearch({ preventDefault: () => {} } as React.FormEvent);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts..."
            className="w-full rounded-lg border px-4 py-2 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </form>

      {/* Search Results Popup */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => {
                onResultClick(result.id);
                setShowResults(false);
                setSearchTerm("");
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              {result.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
