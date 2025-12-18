"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-100 bg-white/30 backdrop-blur-sm shadow-md">
      <div className="container mx-auto flex items-center justify-between py-2 px-4 md:px-16">
        {/* Logo */}
        <Image src="/assets/logo.png" alt="Logo" width={60} height={60} />

        {/* Search - Desktop */}
        <div className="relative hidden md:block w-1/3">
          <input
            type="text"
            placeholder="ابحث هنا..."
            className="border border-gray-300 rounded-md px-10 py-2 w-full text-right focus:outline-none focus:ring-1 focus:ring-yellow-500"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search icon - Mobile */}
          <div className="flex items-center border-l-2 border-[#00000055] pl-2 md:pl-4">
            <button
              className="md:hidden"
              onClick={() => setShowSearch(!showSearch)}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>

          {/* User */}
          <div className="flex items-center border-l-2 border-[#00000055] pl-2 md:pl-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 13.5C9.57107 13.5 11.25 11.8211 11.25 9.75C11.25 7.67893 9.57107 6 7.5 6C5.42893 6 3.75 7.67893 3.75 9.75C3.75 11.8211 5.42893 13.5 7.5 13.5Z"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.25 7.5H23.25"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.25 12H23.25"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.5 16.5H23.25"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.6875 18C2.01795 16.7094 2.76855 15.5655 3.82097 14.7486C4.87338 13.9317 6.16774 13.4883 7.5 13.4883C8.83226 13.4883 10.1266 13.9317 11.179 14.7486C12.2314 15.5655 12.982 16.7094 13.3125 18"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Wishlist */}
          <div className="flex items-center border-l-2 border-[#00000055] pl-2 md:pl-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5343 19.8653L20.128 12.2715C21.9936 10.3965 22.2655 7.33089 20.503 5.37152C20.061 4.87774 19.5229 4.47928 18.9217 4.20047C18.3205 3.92166 17.6688 3.76836 17.0063 3.74993C16.3439 3.73151 15.6846 3.84834 15.0688 4.0933C14.453 4.33826 13.8937 4.7062 13.4249 5.17464L11.9999 6.60902L10.7718 5.37152C8.89676 3.50589 5.83114 3.23402 3.87176 4.99652C3.37799 5.43853 2.97952 5.97659 2.70071 6.5778C2.4219 7.17901 2.2686 7.83075 2.25018 8.49321C2.23175 9.15567 2.34859 9.81493 2.59355 10.4307C2.83851 11.0465 3.20645 11.6059 3.67489 12.0746L11.4655 19.8653C11.6077 20.0061 11.7998 20.0851 11.9999 20.0851C12.2 20.0851 12.3921 20.0061 12.5343 19.8653V19.8653Z"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Cart */}
          <svg width="24" height="24" viewBox="0 0 24 24">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.25 17.25H6.54375L3.92813 2.86875C3.89752 2.69653 3.80768 2.54042 3.67415 2.42743C3.54062 2.31444 3.37179 2.25168 3.19687 2.25H1.5"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 21C8.53553 21 9.375 20.1605 9.375 19.125C9.375 18.0895 8.53553 17.25 7.5 17.25C6.46447 17.25 5.625 18.0895 5.625 19.125C5.625 20.1605 6.46447 21 7.5 21Z"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.25 21C18.2855 21 19.125 20.1605 19.125 19.125C19.125 18.0895 18.2855 17.25 17.25 17.25C16.2145 17.25 15.375 18.0895 15.375 19.125C15.375 20.1605 16.2145 21 17.25 21Z"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.85938 13.5H17.6344C17.985 13.5011 18.3247 13.3785 18.5939 13.1539C18.8631 12.9293 19.0445 12.617 19.1063 12.2719L20.25 6H4.5"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </svg>
        </div>
      </div>

      {/* Search - Mobile dropdown */}
      {showSearch && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث هنا..."
              className="border border-gray-300 rounded-md px-10 py-2 w-full text-right focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
