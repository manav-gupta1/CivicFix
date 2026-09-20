export interface CompressionResult {
  base64: string;
  error?: string;
}

export const compressImage = async (file: File): Promise<CompressionResult> => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    return { base64: "", error: "Unsupported file type. Please upload a JPG, PNG, or WEBP image." };
  }

  // 10MB limit
  const maxSize = 10 * 1024 * 1024; 
  if (file.size > maxSize) {
    return { base64: "", error: "Image is too large. Please choose an image under 10 MB." };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const MAX_DIMENSION = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height = Math.round((height *= MAX_DIMENSION / width));
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width = Math.round((width *= MAX_DIMENSION / height));
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ base64: "", error: "Failed to compress image." });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to WebP at 0.8 quality
        const compressedBase64 = canvas.toDataURL('image/webp', 0.8);
        resolve({ base64: compressedBase64 });
      };
      img.onerror = () => {
         resolve({ base64: "", error: "Failed to read image file." });
      };
    };
    reader.onerror = () => {
      resolve({ base64: "", error: "Failed to read file." });
    };
  });
};
