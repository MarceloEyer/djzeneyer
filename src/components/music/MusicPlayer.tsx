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
        