"use client";
import { CircleX, FileCheck2, FileImage } from "lucide-react";
import React, { useState } from "react";
import Button from "./Button";

function FilePreview({ file, removeFile }) {
  const [selectedType, setSelectedType] = useState(null); // Track selected type
  const fileExtension = file.name.split(".").pop().toUpperCase();

  // Define a mapping object for file types
  const fileTypes = {
    PNG: "PNG",
    JPG: "JPG",
    WEBP: "WEBP",
    JPEG: "JPEG",
    PDF: "PDF",
    // SVG: "SVG",
  };

  // Filter out the current file extension
  const filteredTypes = Object.keys(fileTypes).filter(
    (type) => type !== fileExtension
  );

  // Function to handle select change
  const handleSelectChange = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mt-5 border rounded-lg p-3 border-blue-100">
        <div className="flex items-center p-2">
          <FileImage width={26} height={26} className="text-primary" />
          <div className="ml-2">
            <h2 className="text-secondary font-medium">
              {file.name}
              <span className="font-normal ml-2">
                ({(file.size / 1024 / 1024).toFixed(2)}MB )
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center">
          <h2 className="text-secondary font-normal mr-3">Convert to</h2>
          <select
            id="type"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary p-2"
            defaultValue={"..."}
            onChange={handleSelectChange}
          >
            <option value="..." disabled hidden>
              ...
            </option>
            {filteredTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex">
          <CircleX
            className="text-red-500 cursor-pointer mr-3"
            onClick={() => removeFile()}
          />
        </div>
      </div>
      <div className="flex item-center justify-center mt-10">
        <Button disabled={!selectedType} />
      </div>
    </div>
  );
}

export default FilePreview;
