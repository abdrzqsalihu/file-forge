import { CircleX, FileCheck2, FileImage } from "lucide-react";
import React from "react";

function FilePreview({ file, removeFile }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mt-5 border rounded-md p-3 border-blue-100">
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
          >
            <option selected>...</option>
            <option value="PNG">PNG</option>
            <option value="JPG">JPG</option>
            <option value="WEBP">WEBP</option>
            <option value="SVG">SVG</option>
          </select>
        </div>
        <div className="flex">
          <CircleX
            className="text-red-500 cursor-pointer mr-3"
            onClick={() => removeFile()}
          />
        </div>
      </div>
    </div>
  );
}

export default FilePreview;
