import { CloudUpload } from "lucide-react";
import React from "react";

function UploadFile() {
  return (
    <div>
      <div className="flex items-center justify-center px-6 md:max-w-[70%] mx-auto">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-60 md:h-96 border-2 border-secondary border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-10">
          <CloudUpload className="text-primary w-12 h-12 md:w-[48%] md:h-[48%]" />
            <p className="mt-2 text-[0.9rem] md:text-[1.2rem] text-primary">
              <span className="font-bold">
                Click or drop your files here
              </span>
            </p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" />
        </label>
      </div>
    </div>
  );
}

export default UploadFile;
