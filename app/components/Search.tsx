"use client";

import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Search({ searchQuery, setSearchQuery }: SearchProps) {
  return (
    <div className="relative mb-6">
      <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      <Input
        className="w-full bg-[#1c1d33] border-none pl-12 h-12 text-white placeholder:text-gray-400"
        placeholder="Search coin"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
