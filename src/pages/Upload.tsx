import React from 'react';
import { UploadZone } from '@/components/upload/UploadZone';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Upload: React.FC = () => {
  const navigate = useNavigate();

  const handleUpload = async (file: File) => {
    // In production, this would upload to Supabase Storage
    console.log('Uploading file:', file.name);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock successful upload
    toast({
      title: "Upload Complete",
      description: `${file.name} has been uploaded successfully`,
    });
    
    // Navigate to library after successful upload
    setTimeout(() => {
      navigate('/library');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/library')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Button>
          
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Upload SCORM Package
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload your SCORM compliant learning packages to start tracking progress and completion.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <UploadZone onUpload={handleUpload} />
          
          <div className="mt-8 p-6 bg-card rounded-lg border">
            <h2 className="text-lg font-semibold mb-3">Upload Guidelines</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Ensure your package is SCORM 1.2 or SCORM 2004 compliant
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Package should be compressed as a ZIP file
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Include the imsmanifest.xml file in the root directory
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Maximum file size: 500MB per package
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;