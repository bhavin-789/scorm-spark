import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Clock, Calendar, FileArchive, CheckCircle, Circle } from 'lucide-react';
import { SCORMPackage } from '@/types/scorm';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SCORMCardProps {
  package: SCORMPackage;
  onPlay: (packageId: string) => void;
}

export const SCORMCard: React.FC<SCORMCardProps> = ({ package: pkg, onPlay }) => {
  const getStatusIcon = () => {
    switch (pkg.completionStatus) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Circle className="h-4 w-4 text-primary animate-pulse" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (pkg.completionStatus) {
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-primary/10 text-primary border-primary/20">In Progress</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300",
      "hover:shadow-lg hover:scale-[1.02] hover:border-primary/20",
      "bg-gradient-to-br from-card via-card to-primary/5"
    )}>
      {/* Thumbnail or placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
        {pkg.thumbnail ? (
          <img 
            src={pkg.thumbnail} 
            alt={pkg.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileArchive className="h-16 w-16 text-primary/40" />
          </div>
        )}
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            size="lg"
            className="rounded-full w-16 h-16 p-0 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300"
            onClick={() => onPlay(pkg.id)}
          >
            <Play className="h-6 w-6 ml-1" />
          </Button>
        </div>

        {/* Status indicator */}
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-2 flex-1">{pkg.title}</h3>
          {getStatusIcon()}
        </div>
        {pkg.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {pkg.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Uploaded {format(new Date(pkg.uploadedAt), 'MMM d, yyyy')}</span>
          </div>
          {pkg.duration && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{Math.floor(pkg.duration / 60)} minutes</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileArchive className="h-3 w-3" />
            <span>{(pkg.size / (1024 * 1024)).toFixed(1)} MB</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <Button
          variant="default"
          className="w-full"
          onClick={() => onPlay(pkg.id)}
        >
          <Play className="mr-2 h-4 w-4" />
          {pkg.completionStatus === 'completed' ? 'Review' : 
           pkg.completionStatus === 'in_progress' ? 'Continue' : 'Start'}
        </Button>
      </CardFooter>

      {/* Decorative gradient */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Card>
  );
};