import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import '../components/GalacticNews.css';

// Import audio utilities
import { useAudio } from '../lib/stores/useAudio';

const GalacticNews: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [newsAnchor, setNewsAnchor] = useState('ZIG-9000');
  const [broadcastTime, setBroadcastTime] = useState('');
  const { isMuted, toggleMute } = useAudio();
  
  // Set the current broadcast time
  useEffect(() => {
    const now = new Date();
    // Add 200 years to the current date for futuristic effect
    const futureDate = new Date(now.getFullYear() + 200, now.getMonth(), now.getDate());
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    setBroadcastTime(futureDate.toLocaleDateString('en-US', options) + ' | COSMIC STANDARD TIME');
  }, []);

  // Handle video playback with improved error handling
  const playVideo = async () => {
    if (!videoRef.current) return;
    
    try {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        console.log('Video started playing successfully');
      }
    } catch (error) {
      console.error('Error playing video:', error);
      // In case of error, ensure UI stays in correct state
      setIsPlaying(false);
      // Try to reset the video player
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
  };
  
  const pauseVideo = () => {
    if (!videoRef.current) return;
    
    videoRef.current.pause();
    setIsPlaying(false);
    console.log('Video paused');
  };
  
  const togglePlayback = () => {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    console.log('Video loaded and ready to play');
    if (videoRef.current) {
      console.log('Video duration:', videoRef.current.duration);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      console.log('Video ended and reset');
    }
  };
  
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', e);
    setVideoLoaded(false);
    setIsPlaying(false);
  };

  // Cosmic background animation component
  const CosmicBackground = () => {
    return (
      <Canvas>
        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 0, 5]} intensity={0.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={true} 
          autoRotate 
          autoRotateSpeed={0.5} 
        />
      </Canvas>
    );
  };

  return (
    <div className="galactic-news">
      {/* Cosmic animated background */}
      <div className="cosmic-background">
        <CosmicBackground />
      </div>
      
      {/* News broadcast overlay */}
      <div className="news-overlay">
        {/* Header with navigation */}
        <div className="news-header">
          <a 
            href="/experience"
            className="back-button" 
            aria-label="Back to Experience"
          >
            <ArrowLeft /> <span>Return to Mining Station</span>
          </a>
          <h1>COSMIC NETWORK NEWS</h1>
          <div className="broadcast-info">
            <div className="anchor-name">ANCHOR: {newsAnchor}</div>
            <div className="broadcast-time">{broadcastTime}</div>
          </div>
        </div>
        
        {/* Main news content */}
        <div className="news-content">
          <div className="news-video-container">
            {/* Breaking news banner */}
            <div className="breaking-news-banner">
              <span>BREAKING: HISTORIC "I HAVE A DREAM" SPEECH FULLY RESTORED BY QUANTUM TECHNOLOGY</span>
            </div>
            
            {/* Video Player */}
            <div className="video-wrapper">
              <video 
                ref={videoRef}
                onCanPlay={handleVideoLoad}
                onEnded={handleVideoEnd}
                onError={handleVideoError}
                muted={isMuted}
                playsInline
                loop={false}
                controls={false}
                className={videoLoaded ? 'loaded' : ''}
                poster="/images/news-poster.jpg"
                style={{ background: '#000' }}
              >
                {/* Fallback content if video isn't available */}
                <div className="video-fallback-content">
                  <h3>HISTORICAL CONTENT RESTORATION IN PROGRESS</h3>
                  <p>Our AI archivists are currently working to restore this historical footage.</p>
                </div>
              </video>
              
              {/* Play button overlay */}
              {!isPlaying && (
                <div className="play-overlay" onClick={togglePlayback}>
                  <div className="play-button">
                    <Play size={40} />
                  </div>
                  <span>Play Broadcast</span>
                </div>
              )}
              
              {/* Video controls */}
              <div className="video-controls">
                <button 
                  className="control-button" 
                  onClick={togglePlayback}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button 
                  className="control-button" 
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
              </div>
            </div>
          </div>
          
          {/* News sidebar */}
          <div className="news-sidebar">
            <h2>LATEST COSMIC UPDATES</h2>
            <div className="news-items">
              <div className="news-item">
                <h3>CRYPTO MINING ADVANCEMENTS</h3>
                <p>KloudBugs Mining Collective reports unprecedented efficiency gains using new quantum entanglement technology.</p>
              </div>
              <div className="news-item featured-news-item">
                <h3>HISTORICAL SPEECH ARCHIVE RESTORED</h3>
                <p>The complete "I Have a Dream" speech by Dr. Martin Luther King Jr. has been digitally restored using quantum mining algorithms, preserving this critical moment in civil rights history for future generations.</p>
                <div className="news-link">
                  <a href="https://github.com/kloudbugs/C12.git" target="_blank" rel="noopener noreferrer">ACCESS KLOUDBUGS C12 PLATFORM →</a>
                </div>
                <div className="source-code">
                  <p>Repository ID: <span className="code">kloudbugs/C12</span></p>
                </div>
              </div>
              <div className="news-item">
                <h3>SOCIAL JUSTICE INITIATIVE</h3>
                <p>Mining profits redirected to support global justice causes, honoring the legacy of Tera Ann Harris.</p>
              </div>
              <div className="news-item">
                <h3>ZIG AI EVOLUTION</h3>
                <p>Enhanced AI miners now capable of developing ethical mining practices while maintaining profitability.</p>
              </div>
              <div className="news-item">
                <h3>UPCOMING COSMIC EVENT</h3>
                <p>Digital memorial ceremony planned for next solar cycle. All miners requested to participate in hash power donation.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ticker at the bottom */}
        <div className="news-ticker">
          <div className="ticker-content">
            <span>HISTORIC "I HAVE A DREAM" SPEECH RESTORATION PROJECT COMPLETES PHASE 1 • BITCOIN MINING DIFFICULTIES REACH ALL-TIME HIGH • COSMIC JUSTICE PROTOCOL IMPLEMENTED IN MAJOR BLOCKCHAINS • KLOUDBUGS COLLECTIVE EXPANDS TO LUNAR MINING OPERATIONS • DIGITAL REMEMBRANCE PROJECT APPROVED BY GLOBAL COUNCIL • ZIG AI SYSTEMS SHOW 300% EFFICIENCY IMPROVEMENT • NEURAL MINING TECHNOLOGY PATENT FILED BY COLLECTIVE • MLK SPEECH PRESERVATION FUND REACHES 1000 BTC</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalacticNews;
