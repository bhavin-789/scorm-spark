import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { X, Play, Pause, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { SCORMPackage, SCORMEvent } from '@/types/scorm';
import { cn } from '@/lib/utils';

interface SCORMPlayerProps {
  package: SCORMPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onEvent?: (event: SCORMEvent) => void;
}

export const SCORMPlayer: React.FC<SCORMPlayerProps> = ({ 
  package: pkg, 
  isOpen, 
  onClose, 
  onEvent 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!pkg || !isOpen) return;

    // Initialize SCORM API wrapper
    const initializeSCORM = () => {
      if (!iframeRef.current?.contentWindow) return;

      // Create a SCORM API object in the parent window
      (window as any).API = {
        LMSInitialize: () => {
          console.log('SCORM: LMSInitialize called');
          if (!hasStarted) {
            setHasStarted(true);
            setIsPlaying(true);
            handleEvent({ 
              type: 'start', 
              packageId: pkg.id, 
              timestamp: new Date() 
            });
            toast({
              title: "SCORM video is started",
              description: `Now playing: ${pkg.title}`,
            });
          }
          return "true";
        },
        LMSFinish: () => {
          console.log('SCORM: LMSFinish called');
          setProgress(100);
          handleEvent({ 
            type: 'complete', 
            packageId: pkg.id, 
            timestamp: new Date() 
          });
          toast({
            title: "SCORM video is completed",
            description: `Completed: ${pkg.title}`,
          });
          return "true";
        },
        LMSGetValue: (element: string) => {
          console.log('SCORM: LMSGetValue', element);
          const values: { [key: string]: string } = {
            'cmi.core.lesson_status': progress === 100 ? 'completed' : 'incomplete',
            'cmi.core.score.raw': progress.toString(),
            'cmi.core.lesson_location': '0',
            'cmi.core.student_name': 'Student User',
            'cmi.core.student_id': '12345',
          };
          return values[element] || '';
        },
        LMSSetValue: (element: string, value: string) => {
          console.log('SCORM: LMSSetValue', element, value);
          
          if (element === 'cmi.core.lesson_status' && value === 'completed') {
            setProgress(100);
            handleEvent({ 
              type: 'complete', 
              packageId: pkg.id, 
              timestamp: new Date() 
            });
            toast({
              title: "SCORM video is completed",
              description: `Completed: ${pkg.title}`,
            });
          }
          
          if (element === 'cmi.core.score.raw') {
            const scoreProgress = parseInt(value);
            if (!isNaN(scoreProgress)) {
              setProgress(scoreProgress);
              handleEvent({ 
                type: 'progress', 
                packageId: pkg.id, 
                timestamp: new Date(),
                data: { progress: scoreProgress }
              });
            }
          }
          
          return "true";
        },
        LMSCommit: () => {
          console.log('SCORM: LMSCommit called');
          return "true";
        },
        LMSGetLastError: () => "0",
        LMSGetErrorString: () => "No error",
        LMSGetDiagnostic: () => "No diagnostic"
      };

      // Also add SCORM 2004 API
      (window as any).API_1484_11 = {
        Initialize: () => (window as any).API.LMSInitialize(),
        Terminate: () => (window as any).API.LMSFinish(),
        GetValue: (element: string) => (window as any).API.LMSGetValue(element),
        SetValue: (element: string, value: string) => (window as any).API.LMSSetValue(element, value),
        Commit: () => (window as any).API.LMSCommit(),
        GetLastError: () => (window as any).API.LMSGetLastError(),
        GetErrorString: (errorCode: string) => (window as any).API.LMSGetErrorString(),
        GetDiagnostic: (errorCode: string) => (window as any).API.LMSGetDiagnostic()
      };

      // Inject API into iframe
      try {
        (iframeRef.current.contentWindow as any).API = (window as any).API;
        (iframeRef.current.contentWindow as any).API_1484_11 = (window as any).API_1484_11;
      } catch (e) {
        console.log('Could not inject API into iframe:', e);
      }
    };

    // Initialize after iframe loads
    const timer = setTimeout(initializeSCORM, 1000);

    return () => {
      clearTimeout(timer);
      delete (window as any).API;
      delete (window as any).API_1484_11;
    };
  }, [pkg, isOpen, hasStarted]);

  const handleEvent = (event: SCORMEvent) => {
    console.log('SCORM Event:', event);
    onEvent?.(event);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!hasStarted && !isPlaying) {
      setHasStarted(true);
      handleEvent({ 
        type: 'start', 
        packageId: pkg!.id, 
        timestamp: new Date() 
      });
      toast({
        title: "SCORM video is started",
        description: `Now playing: ${pkg!.title}`,
      });
    }
  };

  const handleRestart = () => {
    setProgress(0);
    setHasStarted(false);
    setIsPlaying(false);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleClose = () => {
    setIsPlaying(false);
    setProgress(0);
    setHasStarted(false);
    onClose();
  };

  if (!pkg) return null;

  // Mock SCORM content URL - in production, this would be the actual SCORM package URL
  const scormUrl = `/scorm/${pkg.id}/index.html`;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={cn(
        "max-w-6xl w-full h-[90vh] p-0 overflow-hidden",
        isFullscreen && "max-w-full w-full h-full"
      )}>
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">{pkg.title}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="relative flex-1 bg-background h-[calc(100%-8rem)]">
          {/* SCORM Content iframe */}
          <iframe
            ref={iframeRef}
            src={scormUrl}
            className="w-full h-full border-0"
            title={pkg.title}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            onLoad={() => console.log('SCORM iframe loaded')}
          />

          {/* Overlay message for demo */}
          {!hasStarted && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Play className="h-8 w-8 text-primary-foreground ml-1" />
                </div>
                <h3 className="text-2xl font-semibold">Ready to Start</h3>
                <p className="text-muted-foreground max-w-md">
                  This is a SCORM player demo. In production, the actual SCORM package would be loaded here.
                </p>
                <Button size="lg" onClick={handlePlayPause}>
                  Start Learning
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Player Controls */}
        <div className="px-6 py-4 border-t bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <Progress value={progress} className="h-2" />
              </div>
              <span className="text-sm text-muted-foreground min-w-[4rem] text-right">
                {progress}% Complete
              </span>
            </div>
            {pkg.description && (
              <p className="text-sm text-muted-foreground">{pkg.description}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};