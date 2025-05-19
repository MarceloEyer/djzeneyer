import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';
import { useMusicPlayer } from '../../contexts/MusicPlayerContext';
import { formatTime } from '../../utils/formatTime';
import YouTube from 'react-youtube';

const MusicPlayer: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const progressIntervalRef = useRef<number | null>(null);
  const playerRef = useRef<any>(null);

  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    setVolume,
    setProgress,
  } = useMusicPlayer();

  // Limpar o intervalo quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Controlar o player quando o estado de reprodução muda
  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerRef.current || !currentTrack) return;
    
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    
    // Converter o progresso (0-1) para segundos
    const duration = playerRef.current.getDuration();
    const newTime = newProgress * duration;
    playerRef.current.seekTo(newTime, true);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume * 100);
    }
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
      setPrevVolume(newVolume);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume);
      if (playerRef.current) {
        playerRef.current.setVolume(prevVolume * 100);
      }
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      if (playerRef.current) {
        playerRef.current.setVolume(0);
      }
      setIsMuted(true);
    }
  };

  const onReady = (event: any) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume * 100);
    if (isPlaying) {
      playerRef.current.playVideo();
    }
  };

  const onStateChange = (event: any) => {
    if (event.data === YouTube.PlayerState.PLAYING) {
      // Limpar qualquer intervalo existente antes de criar um novo
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      // Criar novo intervalo para atualizar o progresso
      const intervalId = window.setInterval(() => {
        if (playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          setProgress(currentTime / duration);
        }
      }, 1000);
      
      progressIntervalRef.current = intervalId;
    } else if (event.data === YouTube.PlayerState.PAUSED || 
               event.data === YouTube.PlayerState.ENDED) {
      // Limpar o intervalo quando o vídeo pausa ou termina
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  };

  if (!currentTrack) return null;

  const currentTime = currentTrack ? progress * currentTrack.duration : 0;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-surface border-t border-white/10 shadow-lg transition-all duration-300 ${expanded ? 'h-96' : 'h-20'}`}>
      <button 
        onClick={toggleExpanded}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-surface border border-white/10 rounded-full p-1"
      >
        {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>
      
      <div className="relative h-full">
        {/* YouTube player invisível mas funcional */}
        <div className="absolute inset-0 pointer-events-none opacity-0">
          <YouTube
            videoId={currentTrack.youtubeId}
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                autoplay: isPlaying ? 1 : 0,
                controls: 0,
                modestbranding: 1,
              },
            }}
            onReady={onReady}
            onStateChange={onStateChange}
          />
        </div>
        
        <div className="container mx-auto px-4 h-full flex flex-col">
          {/* Área expandida (visível apenas quando expanded=true) */}
          {expanded && (
            <div className="flex-1 py-6">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <img 
                    src={currentTrack.artwork} 
                    alt={currentTrack.title}
                    className="w-48 h-48 mx-auto rounded-lg object-cover mb-4"
                  />
                  <h3 className="text-xl font-bold">{currentTrack.title}</h3>
                  <p className="text-white/70">{currentTrack.artist}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Controles do player (sempre visíveis) */}
          <div className="h-20 flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <img 
                src={currentTrack.artwork} 
                alt={currentTrack.title}
                className="w-12 h-12 rounded object-cover"
              />
              <div>
                <h4 className="font-medium">{currentTrack.title}</h4>
                <p className="text-sm text-white/70">{currentTrack.artist}</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-4">
                <button onClick={previousTrack}>
                  <SkipBack size={20} />
                </button>
                <button 
                  onClick={togglePlayPause}
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button onClick={nextTrack}>
                  <SkipForward size={20} />
                </button>
              </div>
              
              <div className="flex items-center space-x-2 w-full">
                <span className="text-xs text-white/70">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.001"
                  value={progress}
                  onChange={handleProgressChange}
                  className="w-64"
                />
                <span className="text-xs text-white/70">
                  {formatTime(currentTrack.duration)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={toggleMute}>
                {volume === 0 ? <VolumeX size={20} /> : volume < 0.5 ? <Volume1 size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>
        </div>

        {/* Barra de progresso na parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div 
            className="h-full bg-primary"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;