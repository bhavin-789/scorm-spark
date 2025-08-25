import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Upload, PlayCircle, BarChart3, Shield, Zap, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Drag and drop SCORM packages with automatic validation',
    },
    {
      icon: PlayCircle,
      title: 'Smart Player',
      description: 'Dynamic event detection for any SCORM content',
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Real-time monitoring of learning completion',
    },
    {
      icon: Shield,
      title: 'Secure Storage',
      description: 'Enterprise-grade security with Supabase',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">SCORM Learning Management System</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Transform Your Learning Experience
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upload, manage, and track SCORM packages with intelligent event detection and beautiful analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/library')}
                className="shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View Library
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/upload')}
                className="shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Package
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-30" />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Modern Learning
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage SCORM content effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card via-card to-primary/5"
              >
                <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden bg-gradient-to-r from-primary via-accent to-secondary p-12">
            <div className="relative z-10 text-center text-primary-foreground">
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Connect to Supabase to enable full backend functionality including storage, database, and authentication.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/upload')}
                className="shadow-xl hover:scale-105 transition-all duration-300"
              >
                Start Uploading
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`
              }} />
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
