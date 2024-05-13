"use client";

import { CloudUpload } from "lucide-react";
import React, { useState } from "react";
import FilePreview from "./FilePreview";
function UploadFile() {
  const [file, setFile] = useState();

  const onFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // console.log("Size is greater than 3MB");
      setFile(selectedFile);
    } else {
      setFile(null);
      // setErrorMsg(null);
    }
  };
  const removeFile = () => {
    setFile(null);
    // Clear the input field value to allow selecting a new file
    // document.getElementById("dropzone-file").value = "";
  };

  return (
    <div className=" px-6 md:max-w-[70%] mx-auto">
      <div className="items-center justify-center">
        {!file && (
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-60 md:h-96 border-2 border-secondary border-dashed rounded-3xl cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-10">
              <CloudUpload className="text-primary w-12 h-12 md:w-[48%] md:h-[48%]" />
              <p className="mt-2 text-[0.9rem] md:text-[1.2rem] text-primary">
                <span className="font-medium">
                  Click or drop your files here
                </span>
              </p>
            </div>
            <input
              id="dropzone-file"
              onChange={onFileSelect}
              type="file"
              className="hidden"
            />
          </label>
        )}
      </div>
      {file && <FilePreview file={file} removeFile={removeFile} />}
    </div>
  );
}

export default UploadFile;
