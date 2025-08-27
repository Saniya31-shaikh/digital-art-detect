import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
}

export function ImageUpload({ onImageSelect, selectedImage, onClear }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: false
  });

  const handleClear = () => {
    setPreview(null);
    onClear();
  };

  if (preview && selectedImage) {
    return (
      <Card className="p-6 bg-gradient-card shadow-elegant">
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-md mx-auto rounded-lg shadow-md"
          />
          <Button
            onClick={handleClear}
            variant="secondary"
            size="icon"
            className="absolute -top-2 -right-2 rounded-full shadow-md"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          {selectedImage.name}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-gradient-card shadow-elegant">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-primary bg-primary/5 shadow-glow' 
            : 'border-border hover:border-primary/50 hover:bg-primary/5'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="flex justify-center">
            {isDragActive ? (
              <ImageIcon className="h-16 w-16 text-primary animate-pulse" />
            ) : (
              <Upload className="h-16 w-16 text-muted-foreground" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {isDragActive ? 'Drop your image here' : 'Upload an image'}
            </h3>
            <p className="text-muted-foreground mt-2">
              Drag & drop an image here, or click to select
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports JPG, PNG, WebP, and GIF
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}