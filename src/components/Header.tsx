"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import SearchBar from "./SearchBar";
import { DollarSign, Ticket } from "lucide-react";
import { useState } from "react";

function Header() {
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

  // Callback function to be passed to SearchBar
  const handleSearchBarToggle = (isOpen: boolean) => {
    setIsSearchBarOpen(isOpen);
    console.log(`Search Bar is now ${isOpen ? "Open" : "Closed"}`);
    // You can dynamically update other things in the parent here as well
  };

  return (
    <div className="flex items-center py-2 px-3 pr-4 w-full z-50 relative bg-gradient-to-b from-black/30 to-transparent">
      {/* "SubCena" on the left */}
      <div
        className={`inline-flex justify-start ${
          isSearchBarOpen ? "lg:block hidden" : "block"
        }`}
      >
        <Link href="/" className="font-bold shrink-0">
          <h1 className="text-white justify-normal text-lg px-3 py-1 font-serif font-semibold hover:text-rose-950 transition duration-500">
            subcena
          </h1>
        </Link>
      </div>

      {/* Action Buttons (always visible) */}
      <div className="flex items-center gap-4 ml-auto">
        <SignedIn>
          {/* SearchBar */}
          <SearchBar onToggle={handleSearchBarToggle} />

          {/* Sell tickets */}
          <Link href="/seller" className="flex items-center justify-center">
            <button className="bg-opacity-0 text-white text-sm rounded-full hover:text-rose-950 transition duration-500">
              <DollarSign className="w-7 h-7" />
            </button>
          </Link>

          {/* My tickets */}
          <Link href="/tickets" className="flex items-center justify-center">
            <button className="bg-opacity-0 text-white text-sm rounded-full hover:text-rose-950 transition duration-500">
              <Ticket className="w-7 h-7" />
            </button>
          </Link>

          <div className="ml-2">
            <UserButton />
          </div>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-white px-3 py-1.5 text-base rounded-lg hover:text-rose-950 transition duration-500">
              Entrar
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}

export default Header;
