"use client";

import { useState, useEffect, useRef } from "react";

// Global references to track the currently playing audio across all instances
let activeAudio: HTMLAudioElement | null = null;
let activeSetIsPlaying: ((playing: boolean) => void) | null = null;

export function useAudio(url: string | null) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!url) return;
    
    if (!audioRef.current || audioRef.current.src !== url) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(url);
    }

    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      if (activeAudio === audio) {
        activeAudio = null;
        activeSetIsPlaying = null;
      }
    };

    // Use an event listener to handle pause events that might come from outside
    const handlePause = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      audio.pause();
      if (activeAudio === audio) {
        activeAudio = null;
        activeSetIsPlaying = null;
      }
    };
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      if (activeAudio === audioRef.current) {
        activeAudio = null;
        activeSetIsPlaying = null;
      }
    } else {
      // Pause any globally active audio before playing this one
      if (activeAudio && activeAudio !== audioRef.current) {
        activeAudio.pause();
        if (activeSetIsPlaying) {
          activeSetIsPlaying(false);
        }
      }
      
      activeAudio = audioRef.current;
      activeSetIsPlaying = setIsPlaying;
      audioRef.current.play();
    }
  };

  const pause = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      if (activeAudio === audioRef.current) {
        activeAudio = null;
        activeSetIsPlaying = null;
      }
    }
  };

  return { isPlaying, progress, togglePlay, pause };
}
