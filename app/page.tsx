"use client";

import { Navbar } from "@/app/components/Navbar";
import { Search } from "./components/Search";
import { CurrencyToggle } from "./components/CurrencyToggle";
import { CryptoTable } from "./components/CryptoTable";
import { useState } from "react";
import { Hero } from "./components/Hero";
import { ActionButtons } from "./components/ActionButton";
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUSD, setShowUSD] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-white relative">
      <Navbar />
      <ActionButtons />
      <div className="max-w-7xl mx-auto px-24">
        <Hero />
        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <CurrencyToggle showUSD={showUSD} setShowUSD={setShowUSD} />
        <CryptoTable searchQuery={searchQuery} showUSD={showUSD} />
      </div>
    </div>
  );
}
