export interface FileValidation {
  valid: boolean;
  error?: string;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function validateFile(file: File): FileValidation {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 50MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`,
    };
  }

  return { valid: true };
}

export async function fileToUint8Array(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      resolve(new Uint8Array(arrayBuffer));
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}
