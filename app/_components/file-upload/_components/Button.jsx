import { RefreshCw } from "lucide-react";
import React from "react";

function Button({ disabled }) {
  return (
    <div>
      <button
        disabled={disabled}
        className={`p-3 rounded-xl flex item-center justify-between text-white ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-primary hover:bg-[26006b] hover:opacity-90 cursor-pointer"
        }`}
      >
        <RefreshCw /> <span className="ml-2">Convert Now</span>
      </button>
    </div>
  );
}

export default Button;
