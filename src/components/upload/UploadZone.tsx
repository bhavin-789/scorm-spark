import React, { useCallback, useState } from 'react';
import { Upload, FileArchive, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  className?: string;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onUpload, className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const zipFile = files.find(file => 
      file.type === 'application/zip' || 
      file.type === 'application/x-zip-compressed' ||
      file.name.endsWith('.zip')
    );

    if (zipFile) {
      setSelectedFile(zipFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a ZIP file containing SCORM package",
        variant: "destructive"
      });
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await onUpload(selectedFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: "Upload successful",
        description: "SCORM package has been uploaded successfully",
      });

      setTimeout(() => {
        setSelectedFile(null);
        setUploadProgress(0);
        setIsUploading(false);
      }, 1500);
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      toast({
        title: "Upload failed",
        description: "Failed to upload SCORM package. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        "bg-gradient-to-br from-card via-card to-primary/5",
        "border-2 border-dashed",
        isDragging && "border-primary bg-primary/10 scale-[1.02]",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-12">
        {!selectedFile ? (
          <div className="text-center">
            <div className="mx-auto w-20 h-20 mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full opacity-20 animate-pulse" />
              <Upload className="w-20 h-20 text-primary relative z-10" />
            </div>
            
            <h3 className="text-2xl font-semibold mb-2">Upload SCORM Package</h3>
            <p className="text-muted-foreground mb-6">
              Drag and drop your SCORM .zip file here, or click to browse
            </p>
            
            <input
              type="file"
              accept=".zip,application/zip,application/x-zip-compressed"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="default" className="cursor-pointer" asChild>
                <span>
                  <FileArchive className="mr-2 h-4 w-4" />
                  Select ZIP File
                </span>
              </Button>
            </label>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p>Maximum file size: 500MB</p>
              <p>Supported format: ZIP archives containing SCORM content</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileArchive className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!isUploading && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {isUploading ? (
              <div className="space-y-3">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">
                  {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Upload complete!'}
                </p>
                {uploadProgress === 100 && (
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto animate-bounce" />
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={handleUpload}
                  className="flex-1"
                  size="lg"
                >
                  Upload Package
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedFile(null)}
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl" />
    </Card>
  );
};