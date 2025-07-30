import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, ExternalLink, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DemoVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  industry?: string;
  thumbnail: string;
  videoUrl: string;
  relatedArticles?: string[];
  ctaText?: string;
  ctaAction?: () => void;
  transcript?: string;
}

interface DemoVideoPlayerProps {
  video: DemoVideo;
  autoplay?: boolean;
  showTranscript?: boolean;
  onVideoComplete?: () => void;
  onEngagement?: (action: string, timestamp: number) => void;
  className?: string;
}

export const DemoVideoPlayer: React.FC<DemoVideoPlayerProps> = ({
  video,
  autoplay = false,
  showTranscript = false,
  onVideoComplete,
  onEngagement,
  className
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      onVideoComplete?.();
      onEngagement?.('video_completed', video.currentTime);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onVideoComplete, onEngagement]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      onEngagement?.('video_paused', video.currentTime);
    } else {
      video.play();
      if (!hasStarted) {
        setHasStarted(true);
        onEngagement?.('video_started', 0);
      }
      onEngagement?.('video_played', video.currentTime);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newTime: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = newTime;
    setCurrentTime(newTime);
    onEngagement?.('video_seeked', newTime);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
    onEngagement?.('video_muted', video.currentTime);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      video.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = 0;
    setCurrentTime(0);
    onEngagement?.('video_restarted', 0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="relative group">
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-auto bg-black"
            poster={video.thumbnail}
            autoPlay={autoplay}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Overlay */}
          {!hasStarted && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Button
                size="lg"
                onClick={togglePlay}
                className="rounded-full h-16 w-16"
              >
                <Play className="h-6 w-6 ml-1" />
              </Button>
            </div>
          )}

          {/* Video Controls */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
            showControls || !isPlaying ? "opacity-100" : "opacity-0"
          )}>
            {/* Progress Bar */}
            <div className="mb-3">
              <Progress 
                value={progress} 
                className="h-1 cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  handleSeek(percent * duration);
                }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={restart}
                  className="text-white hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>

                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">{video.description}</p>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{video.category}</Badge>
                {video.industry && (
                  <Badge variant="outline">{video.industry}</Badge>
                )}
                <Badge variant="outline">{video.duration}</Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            {video.ctaText && video.ctaAction && (
              <Button onClick={video.ctaAction} className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                {video.ctaText}
              </Button>
            )}

            {video.relatedArticles && video.relatedArticles.length > 0 && (
              <Button variant="outline" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Related Articles ({video.relatedArticles.length})
              </Button>
            )}
          </div>

          {/* Transcript */}
          {showTranscript && video.transcript && (
            <div className="border-t pt-3 mt-3">
              <h4 className="font-medium mb-2">Transcript</h4>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-32 overflow-y-auto">
                {video.transcript}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};