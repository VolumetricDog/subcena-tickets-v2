"use client";

import { ArrowRight, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Form from "next/form";

interface SearchBarProps {
  onToggle: (isOpen: boolean) => void; // Ensure the callback prop is properly typed
}

function SearchBar({ onToggle }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // Ref to the input element
  const containerRef = useRef<HTMLDivElement>(null); // Ref to the entire container

  const handleFocus = () => {
    setIsOpen(true); // Expand the search bar when focused
    onToggle(true); // Notify parent that the search bar has expanded
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false); // Collapse if clicked outside
      onToggle(false); // Notify parent that the search bar has collapsed
    }
  };

  useEffect(() => {
    // Attach a listener for click outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener when component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex justify-end items-center">
      <Form action={"/search"} className="relative w-full">
        {/* Search Icon for smaller screens (collapsed mode) */}
        <div
          className={`${
            isOpen ? "hidden" : "flex"
          } justify-end items-center absolute right-0 top-1/2 -translate-y-1/2 text-white cursor-pointer hover:text-rose-950 transition duration-500`}
          onClick={() => {
            setIsOpen(true);
            onToggle(true); // Notify parent when expanded
          }} // Click to expand
        >
          <Search className="w-6 h-6" />
        </div>

        {/* Expanded Search Input */}
        <input
          ref={inputRef}
          type="text"
          name="q" // means query
          placeholder="Buscar..."
          className={`${
            isOpen ? "w-full" : "w-0"
          } py-3 px-4 pl-12 bg-gray-900 bg-opacity-40 rounded-full text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent transition-all duration-300`}
          onFocus={handleFocus} // Trigger expansion on focus
          style={{
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
          }} // Hide input when collapsed
        />

        {/* Search Icon inside the input */}
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 ${isOpen ? "opacity-100" : "opacity-0"}`}
        />

        {/* Submit Button for larger screens and when input is expanded */}
        {isOpen && (
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-rose-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-orange-800 transition-colors duration-200"
          >
            <ArrowRight />
          </button>
        )}
      </Form>
    </div>
  );
}

export default SearchBar;
