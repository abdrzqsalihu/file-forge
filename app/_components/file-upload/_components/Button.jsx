import React from "react";
import { RefreshCw, Download } from "lucide-react";

function Button({ disabled, onConvert, convertedFile, status }) {
  const handleConvert = () => {
    onConvert();
  };

  const handleDownload = () => {
    const url = URL.createObjectURL(convertedFile);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", convertedFile.name);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      {!convertedFile && (
        <button
          disabled={disabled || status === "In Progress"}
          onClick={handleConvert}
          className={`p-3 rounded-xl flex item-center justify-between text-white dark:text-gray-100 ${
            disabled || status === "In Progress"
              ? "bg-gray-300 dark:bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-[26006b] hover:opacity-90 cursor-pointer"
          }`}
        >
          <RefreshCw
            className={`${status === "In Progress" ? "refresh-icon" : ""}`}
          />{" "}
          <span className="ml-2">
            {" "}
            {status === "In Progress" ? "Converting..." : "Convert Now"}
          </span>
        </button>
      )}
      {convertedFile && (
        <button
          onClick={handleDownload}
          className="flex items-center justify-between p-3 rounded-xl bg-primary hover:bg-[26006b] hover:opacity-90 text-white cursor-pointer"
        >
          <Download />
          <span className="ml-2">Download</span>
        </button>
      )}
    </div>
  );
}

export default Button;
