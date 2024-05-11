import { RefreshCw } from "lucide-react";
import React from "react";

function Button() {
  return (
    <div>
      <button className="bg-gray-300 p-3 rounded-lg flex item-center justify-between text-white">
        <RefreshCw /> <span className="ml-2">Convert Now</span>
      </button>
    </div>
  );
}

export default Button;
