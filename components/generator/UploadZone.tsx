'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  validationRules?: {
    minWidth?: number;
    minHeight?: number;
    maxSize?: number;
  };
}

export function UploadZone({ 
  onFileSelect, 
  isLoading = false,
  validationRules = { minWidth: 200, minHeight: 200, maxSize: 10 * 1024 * 1024 }
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const validateImage = (file: File, dataUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        resolve(false);
        return;
      }

      if (file.size > (validationRules.maxSize || 10 * 1024 * 1024)) {
        setError('File size must be less than 10MB');
        resolve(false);
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if ((img.width < (validationRules.minWidth || 200)) || (img.height < (validationRules.minHeight || 200))) {
          setError(`Image must be at least ${validationRules.minWidth || 200}x${validationRules.minHeight || 200}px`);
          resolve(false);
          return;
        }
        setError('');
        resolve(true);
      };
      img.onerror = () => {
        setError('Failed to load image');
        resolve(false);
      };
      img.src = dataUrl;
    });
  };

  const handleFileAccept = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      const isValid = await validateImage(file, dataUrl);
      
      if (isValid) {
        setPreview(dataUrl);
        setFileName(file.name);
        onFileSelect(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFileAccept(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      handleFileAccept(files[0]);
    }
  };

  if (preview) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {error}
          </div>
        )}
        <div className="relative rounded-xl overflow-hidden border border-primary/30">
          <img src={preview} alt="Preview" className="w-full h-96 object-contain bg-card/50" />
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white">Ready to process</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">📎 {fileName}</p>
        <button
          onClick={() => {
            setPreview(null);
            setFileName('');
            setError('');
          }}
          disabled={isLoading}
          className="text-sm text-primary hover:text-accent transition-colors disabled:opacity-50"
        >
          Choose different photo
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-all ${
        isDragging
          ? 'border-primary bg-primary/10'
          : 'border-primary/30 hover:border-primary/50 bg-card/30'
      }`}
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
            <Upload className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-1">Drop your photo here</h3>
          <p className="text-sm text-muted-foreground">or click to browse</p>
        </div>

        <p className="text-xs text-muted-foreground">
          PNG, JPG, JPEG • Max 10MB • Minimum 200x200px
        </p>

        <label className="inline-block">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            disabled={isLoading}
            className="hidden"
          />
          <button
            onClick={(e) => {
              const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
              input?.click();
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-2.5 font-medium hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
          >
            Choose Photo
          </button>
        </label>
      </div>
    </motion.div>
  );
}
