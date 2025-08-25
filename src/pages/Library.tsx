import React, { useState } from 'react';
import { SCORMCard } from '@/components/scorm/SCORMCard';
import { SCORMPlayer } from '@/components/scorm/SCORMPlayer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SCORMPackage, SCORMEvent } from '@/types/scorm';
import { cn } from '@/lib/utils';

const Library: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<SCORMPackage | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data - in production, this would come from Supabase
  const mockPackages: SCORMPackage[] = [
    {
      id: '1',
      title: 'Introduction to React Development',
      description: 'Learn the fundamentals of React including components, state, and props',
      filename: 'react-intro.zip',
      filepath: '/scorm/react-intro',
      size: 45 * 1024 * 1024,
      uploadedAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      duration: 3600,
      completionStatus: 'completed',
    },
    {
      id: '2',
      title: 'Advanced TypeScript Patterns',
      description: 'Master advanced TypeScript concepts and design patterns',
      filename: 'typescript-advanced.zip',
      filepath: '/scorm/typescript-advanced',
      size: 62 * 1024 * 1024,
      uploadedAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      duration: 5400,
      completionStatus: 'in_progress',
    },
    {
      id: '3',
      title: 'Web Performance Optimization',
      description: 'Techniques for optimizing web application performance',
      filename: 'web-performance.zip',
      filepath: '/scorm/web-performance',
      size: 38 * 1024 * 1024,
      uploadedAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25'),
      duration: 2700,
      completionStatus: 'not_started',
    },
    {
      id: '4',
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js and Express',
      filename: 'nodejs-backend.zip',
      filepath: '/scorm/nodejs-backend',
      size: 78 * 1024 * 1024,
      uploadedAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
      duration: 7200,
      completionStatus: 'not_started',
    },
    {
      id: '5',
      title: 'Database Design Fundamentals',
      description: 'Learn database design principles and SQL optimization',
      filename: 'database-design.zip',
      filepath: '/scorm/database-design',
      size: 52 * 1024 * 1024,
      uploadedAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-02-05'),
      duration: 4500,
      completionStatus: 'in_progress',
    },
    {
      id: '6',
      title: 'Cloud Architecture with AWS',
      description: 'Design and deploy cloud solutions using AWS services',
      filename: 'aws-architecture.zip',
      filepath: '/scorm/aws-architecture',
      size: 95 * 1024 * 1024,
      uploadedAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
      duration: 9000,
      completionStatus: 'not_started',
    },
  ];

  const handlePlay = (packageId: string) => {
    const pkg = mockPackages.find(p => p.id === packageId);
    if (pkg) {
      setSelectedPackage(pkg);
      setIsPlayerOpen(true);
    }
  };

  const handleSCORMEvent = (event: SCORMEvent) => {
    console.log('SCORM Event received:', event);
    // In production, this would update the database via Supabase
  };

  const filteredPackages = mockPackages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: mockPackages.length,
    completed: mockPackages.filter(p => p.completionStatus === 'completed').length,
    inProgress: mockPackages.filter(p => p.completionStatus === 'in_progress').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SCORM Library
            </h1>
            <Button onClick={() => navigate('/upload')}>
              <Plus className="mr-2 h-4 w-4" />
              Upload Package
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="text-3xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Packages</div>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <div className="text-3xl font-bold text-green-500">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <div className="text-3xl font-bold text-primary">{stats.inProgress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Packages Grid */}
        {filteredPackages.length > 0 ? (
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          )}>
            {filteredPackages.map(pkg => (
              <SCORMCard
                key={pkg.id}
                package={pkg}
                onPlay={handlePlay}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No packages found</div>
            <Button onClick={() => navigate('/upload')}>
              Upload Your First Package
            </Button>
          </div>
        )}
      </div>

      {/* SCORM Player */}
      <SCORMPlayer
        package={selectedPackage}
        isOpen={isPlayerOpen}
        onClose={() => {
          setIsPlayerOpen(false);
          setSelectedPackage(null);
        }}
        onEvent={handleSCORMEvent}
      />
    </div>
  );
};

export default Library;