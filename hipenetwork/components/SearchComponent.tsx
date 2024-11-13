// components/SearchComponent.tsx
"use client";

import { useState } from "react";

interface SearchComponentProps {
  onSearchResults: (results: any[]) => void;
}

export default function SearchComponent({
  onSearchResults,
}: SearchComponentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/search?search=${searchTerm}`);
      const data = await res.json();

      if (res.ok) {
        onSearchResults(data);
      } else {
        console.error("Error:", data.error);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search posts by title..."
          required
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
    </div>
  );
}
