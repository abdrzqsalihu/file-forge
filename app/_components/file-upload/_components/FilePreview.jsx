import { CircleX, FileCheck2, FileImage } from "lucide-react";
import React, { useState } from "react";
import Button from "./Button";
import {
  convertPDFToImage,
  convertToImage,
  //   convertToImage,
  convertToJPEG,
  convertToJPG,
  convertToPDF,
  convertToPNG,
  convertToWEBP,
} from "@/app/utils/convertFile";

function FilePreview({ file, removeFile }) {
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedType, setSelectedType] = useState(null); // Track selected type
  const [convertedFile, setConvertedFile] = useState(null); // Track converted file
  const fileExtension = file.name.split(".").pop().toUpperCase();

  console.log(fileExtension);

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

  // Function to handle conversion
  const handleConvert = () => {
    // Set status to "In Progress"
    setStatus("In Progress");

    // Calculate increment based on 4 seconds
    const increment = 100 / 3; // Progress percentage per second

    // Update progress every second
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return Math.min(prevProgress + increment, 100); // Increment progress, but don't exceed 100%
        } else {
          clearInterval(interval); // Stop updating progress when it reaches 100%
          return prevProgress;
        }
      });
    }, 1000);

    setTimeout(() => {
      if (selectedType === "JPG") {
        convertToJPG(file, setConvertedFile);
      } else if (selectedType === "PNG") {
        convertToPNG(file, setConvertedFile);
      } else if (selectedType === "JPEG") {
        convertToJPEG(file, setConvertedFile);
      } else if (selectedType === "PDF") {
        convertToPDF(file, setConvertedFile);
      } else if (selectedType === "WEBP") {
        convertToWEBP(file, setConvertedFile);
      }
      // Set status to "Done"
      setStatus("Done");
    }, 4000); // 6 seconds delay
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
          {!status && (
            <>
              <h2 className="text-secondary font-normal mr-3">Convert to</h2>
              <select
                id="type"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary p-2"
                // defaultValue={"..."}
                value={selectedType || "..."}
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
            </>
          )}
          {status && (
            <p className="font-normal">
              Status:{" "}
              <span className="font-medium text-secondary">
                {status === "In Progress" ? "In Progress" : ""}
              </span>{" "}
              <span className="font-medium text-green-500">
                {status === "Done" ? "Done" : ""}
              </span>
            </p>
          )}
        </div>
        <div className="flex">
          {!status && (
            <CircleX
              className="text-red-500 cursor-pointer mr-3"
              onClick={() => removeFile()}
            />
          )}

          {status && (
            <div className="bg-gray-300 w-full mt-1 h-2 rounded-xl">
              <div
                className="bg-primary h-2 rounded-xl text-[12px] text-white"
                style={{ width: `${progress}%`, transition: "width 1s" }}
              >
                <p className="w-[200px]"></p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex item-center justify-center mt-10">
        <Button
          disabled={!selectedType || status === "In Progress"}
          onConvert={handleConvert}
          convertedFile={convertedFile}
          status={status}
        />
      </div>
    </div>
  );
}

export default FilePreview;
