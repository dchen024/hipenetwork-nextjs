// app/home/page.tsx
"use client";

import { useState } from "react";
import SearchComponent from "@/components/SearchComponent";

export default function HomePage() {
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>

      {/* Search Component */}
      <SearchComponent onSearchResults={handleSearchResults} />

      {/* Display search results */}
      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((post) => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <img
                src={post.post_img}
                alt={post.title}
                style={{ width: "100px" }}
              />
              <p>Created by: {post.creator_id}</p>
              <p>Created at: {new Date(post.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}
