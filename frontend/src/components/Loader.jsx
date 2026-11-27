import React from "react";
export default function Loader() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
      {/* Logo */}
      <img
        src="/JobConnect-logo.jpg"
        alt="JobConnect"
       className="w-44 sm:w-52 md:w-60 animate-pulse"
 
 />

      
      <p className="mt-4 text-gray-600 font-medium">
        Connecting Careers...
      </p>
    </div>
  );
}
