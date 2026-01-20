import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const AudioPlayer = ({ audioSrc, plantName }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            setIsLoading(false);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        const handleError = () => {
            setError('Audio file could not be loaded');
            setIsLoading(false);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
        };
    }, [audioSrc]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const newTime = percentage * duration;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        audio.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        const audio = audioRef.current;
        audio.volume = newVolume;
        setVolume(newVolume);
        if (newVolume === 0) {
            setIsMuted(true);
        } else if (isMuted) {
            setIsMuted(false);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (error) {
        return (
            <div style={{
                padding: '20px',
                backgroundColor: '#FFF5F5',
                border: '1px solid #FED7D7',
                borderRadius: '12px',
                color: '#C53030',
                fontSize: '0.9rem'
            }}>
                {error}
            </div>
        );
    }

    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#FFFDF5',
            border: '1px solid #EFEDDF',
            borderRadius: '12px'
        }}>
            <h4 style={{
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--color-text-dark)'
            }}>
                <Volume2 size={20} color="var(--color-primary)" />
                Audio Explanation
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                Listen to the traditional uses and pronunciation.
            </p>

            <audio ref={audioRef} src={audioSrc} preload="metadata" />

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                {/* Play/Pause Button */}
                <button
                    onClick={togglePlay}
                    disabled={isLoading}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: isLoading ? '#E2E8F0' : 'var(--color-primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                        if (!isLoading) e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                    }}
                >
                    {isLoading ? (
                        <div style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid white',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                    ) : isPlaying ? (
                        <Pause size={20} fill="white" />
                    ) : (
                        <Play size={20} fill="white" />
                    )}
                </button>

                {/* Progress Bar */}
                <div style={{ flex: 1 }}>
                    <div
                        onClick={handleSeek}
                        style={{
                            height: '6px',
                            backgroundColor: '#E2E8F0',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            height: '100%',
                            width: `${(currentTime / duration) * 100 || 0}%`,
                            backgroundColor: 'var(--color-primary)',
                            borderRadius: '3px',
                            transition: 'width 0.1s linear'
                        }} />
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.75rem',
                        color: '#718096',
                        marginTop: '4px'
                    }}>
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Volume Control */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexShrink: 0
                }}>
                    <button
                        onClick={toggleMute}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#718096'
                        }}
                    >
                        {isMuted || volume === 0 ? (
                            <VolumeX size={18} />
                        ) : (
                            <Volume2 size={18} />
                        )}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        style={{
                            width: '80px',
                            cursor: 'pointer'
                        }}
                    />
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                input[type="range"] {
                    -webkit-appearance: none;
                    appearance: none;
                    background: transparent;
                }
                
                input[type="range"]::-webkit-slider-track {
                    height: 4px;
                    background: #E2E8F0;
                    border-radius: 2px;
                }
                
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    background: var(--color-primary);
                    border-radius: 50%;
                    cursor: pointer;
                    margin-top: -5px;
                }
                
                input[type="range"]::-moz-range-track {
                    height: 4px;
                    background: #E2E8F0;
                    border-radius: 2px;
                }
                
                input[type="range"]::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    background: var(--color-primary);
                    border-radius: 50%;
                    cursor: pointer;
                    border: none;
                }
            `}</style>
        </div>
    );
};

export default AudioPlayer;
