import jsPDF from "jspdf";
export function convertToJPG(file, setConvertedFile) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      const newFile = new File([blob], file.name.replace(/\.png$/i, ".jpg"), {
        type: "image/jpeg",
      });
      setConvertedFile(newFile);
    }, "image/jpeg");
  };
  img.src = URL.createObjectURL(file);
}

export function convertToPNG(file, setConvertedFile) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      const newFile = new File([blob], file.name.replace(/\.[^.]+$/, ".png"), {
        type: "image/png",
      });
      setConvertedFile(newFile);
    }, "image/png");
  };
  img.src = URL.createObjectURL(file);
}

export function convertToWEBP(file, setConvertedFile) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      const newFile = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
        type: "image/webp",
      });
      setConvertedFile(newFile);
    }, "image/png");
  };
  img.src = URL.createObjectURL(file);
}

export function convertToJPEG(file, setConvertedFile) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      const newFile = new File([blob], file.name.replace(/\.[^.]+$/, ".jpeg"), {
        type: "image/jpeg",
      });
      setConvertedFile(newFile);
    }, "image/jpeg");
  };
  img.src = URL.createObjectURL(file);
}

export function convertToPDF(file, setConvertedFile) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.onload = () => {
    const aspectRatio = img.width / img.height;
    const maxWidth = 350; // A4 width in mm
    const maxHeight = 400; // A4 height in mm
    const resolution = 300; // Increase canvas resolution (dpi)

    let newWidth = img.width;
    let newHeight = img.height;

    // Scale down if image is too large
    if (newWidth > maxWidth) {
      newWidth = maxWidth;
      newHeight = newWidth / aspectRatio;
    }

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = newHeight * aspectRatio;
    }

    canvas.width = (newWidth * resolution) / 25.4; // Convert mm to pixels
    canvas.height = (newHeight * resolution) / 25.4; // Convert mm to pixels

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const pdf = new jsPDF({
      orientation: newWidth > newHeight ? "l" : "p",
      unit: "mm",
      format: [newWidth, newHeight],
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0); // Adjust quality here (1.0 is maximum quality)
    pdf.addImage(imgData, "JPEG", 0, 0, newWidth, newHeight);

    const pdfBlob = pdf.output("blob");
    const newFile = new File([pdfBlob], file.name.replace(/\.[^.]+$/, ".pdf"), {
      type: "application/pdf",
    });
    setConvertedFile(newFile);
  };
  img.src = URL.createObjectURL(file);
}
