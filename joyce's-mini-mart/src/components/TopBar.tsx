import React, { useState, useEffect, useRef } from 'react';
import {
  Store,
  VolumeX,
  Sparkles,
  Play,
  Pause,
  Check,
} from 'lucide-react';
import { sound, BGM_TRACKS } from '../utils/audio';

interface TopBarProps {
  onGoHome: () => void;
  onOpenSettings: () => void;
  onResetGame: () => void;
  roomName: string;
  transparent?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onGoHome,
  onOpenSettings,
  onResetGame,
  roomName,
  transparent = false,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [volume, setVolume] = useState(sound.getVolume());
  const [isBgmOn, setIsBgmOn] = useState(sound.isBgmActive());
  const [currentTrackId, setCurrentTrackId] = useState(sound.getCurrentTrackId());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showMusicMenu, setShowMusicMenu] = useState(false);

  const musicMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      try {
        setIsFullscreen(!!document.fullscreenElement);
      } catch {
        setIsFullscreen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (musicMenuRef.current && !musicMenuRef.current.contains(e.target as Node)) {
        setShowMusicMenu(false);
      }
    };
    try {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('mousedown', handleClickOutside);
    } catch {
      // Ignore listener errors in restricted frames
    }
    return () => {
      try {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('mousedown', handleClickOutside);
      } catch {
        // Ignore cleanup errors
      }
    };
  }, []);

  const handleToggleMute = () => {
    sound.playPop();
    const next = !isMuted;
    sound.setMuted(next);
    setIsMuted(next);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sound.setVolume(val);
    if (isMuted && val > 0) {
      sound.setMuted(false);
      setIsMuted(false);
    }
  };

  const handleMusicButtonClick = () => {
    sound.playPop();
    if (!isBgmOn && !showMusicMenu) {
      const active = sound.toggleBgm();
      setIsBgmOn(active);
    }
    setShowMusicMenu((prev) => !prev);
  };

  const handleToggleBgmPlay = () => {
    sound.playPop();
    const active = sound.toggleBgm();
    setIsBgmOn(active);
  };

  const handleSelectTrack = (trackId: string) => {
    sound.playPop();
    sound.setBgmTrack(trackId);
    setCurrentTrackId(trackId);
    setIsBgmOn(true);
  };

  const handleToggleFullscreen = () => {
    sound.playPop();
    try {
      if (!document.fullscreenElement) {
        const req = document.documentElement.requestFullscreen?.();
        if (req && typeof req.catch === 'function') {
          req.catch(() => {});
        }
      } else {
        const exit = document.exitFullscreen?.();
        if (exit && typeof exit.catch === 'function') {
          exit.catch(() => {});
        }
      }
    } catch {
      // Ignore fullscreen errors inside restricted iframes
    }
  };

  return (
    <header
      className={
        transparent
          ? 'fixed top-0 left-0 right-0 z-30 px-4 py-3 pointer-events-none'
          : 'relative z-30 bg-white/90 backdrop-blur-md border-b-2 border-amber-200/80 px-4 py-2 shadow-sm'
      }
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Zone: Kawaii Circular Home & Settings Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 pointer-events-auto">
          <button
            onClick={() => {
              sound.playPop();
              onGoHome();
            }}
            className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-transform duration-150 hover:scale-110 active:scale-90 focus:outline-none drop-shadow-md"
            title="Home / Cover Screen"
          >
            <img
              src="/assets/btn_home.png"
              alt="Home"
              className="w-full h-full object-contain pointer-events-none"
            />
          </button>

          <button
            onClick={() => {
              sound.playPop();
              onOpenSettings();
            }}
            className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-transform duration-150 hover:scale-110 active:scale-90 focus:outline-none drop-shadow-md"
            title="Settings & Shelf Customizer"
          >
            <img
              src="/assets/btn_settings.png"
              alt="Settings & Shelves"
              className="w-full h-full object-contain pointer-events-none"
            />
          </button>

          <button
            onClick={() => {
              sound.playPop();
              onResetGame();
            }}
            className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-transform duration-150 hover:scale-110 active:scale-90 active:-rotate-45 focus:outline-none drop-shadow-md"
            title="Reset Game (Lock all items & restart)"
          >
            <img
              src="/assets/btn_reset.png"
              alt="Reset Game"
              className="w-full h-full object-contain pointer-events-none"
            />
          </button>
        </div>

        {/* Center Zone: Shown cleanly in Store view (Cover art already displays title on Title view) */}
        {!transparent && (
          <div className="flex items-center gap-2.5 text-center cursor-default min-w-0">
            <div className="w-8 h-8 rounded-full bg-pink-500 text-white hidden sm:flex items-center justify-center shadow-sm shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-extrabold tracking-wide font-display flex items-center gap-1.5 justify-center leading-none whitespace-nowrap">
                <span className="kawaii-word kawaii-word-pink">Joyce&apos;s</span>
                <span className="kawaii-word kawaii-word-mint">MINI</span>
                <span className="kawaii-word kawaii-word-yellow">MART</span>
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-300 shrink-0" />
              </h1>
              <p className="text-xs sm:text-sm font-bold font-display kawaii-subtitle-caramel truncate max-w-[220px] sm:max-w-md mx-auto mt-0.5 leading-tight">
                {roomName}
              </p>
            </div>
          </div>
        )}

        {/* Right Zone: Kawaii Music Selector, Sound Volume, and Fullscreen Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 pointer-events-auto">
          {/* Kawaii Music Button + Track Selector Popover */}
          <div
            ref={musicMenuRef}
            className="relative"
            onMouseEnter={() => setShowMusicMenu(true)}
            onMouseLeave={() => setShowMusicMenu(false)}
          >
            <button
              onClick={handleMusicButtonClick}
              className={`group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-transform duration-150 hover:scale-110 active:scale-90 focus:outline-none drop-shadow-md ${
                isBgmOn ? 'animate-gentle-bounce ring-2 ring-purple-300/80' : 'opacity-90'
              }`}
              title="Choose Cute Background Music"
            >
              <img
                src="/assets/btn_music.png"
                alt="Background Music"
                className="w-full h-full object-contain pointer-events-none"
              />
              {isBgmOn && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
              )}
            </button>

            {showMusicMenu && (
              <div className="absolute right-0 top-full pt-2 z-50">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-2.5 border-2 border-purple-200 w-56 space-y-1.5">
                  <div className="flex items-center justify-between px-1.5 pb-1 border-b border-purple-100">
                    <span className="text-xs font-bold text-purple-900">
                      Cute Music
                    </span>
                    <button
                      onClick={handleToggleBgmPlay}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                        isBgmOn
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                      }`}
                    >
                      {isBgmOn ? (
                        <>
                          <Pause className="w-3 h-3" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          <span>Play</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-1">
                    {BGM_TRACKS.map((track) => {
                      const isSelected = track.id === currentTrackId;
                      return (
                        <button
                          key={track.id}
                          onClick={() => handleSelectTrack(track.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-purple-100 text-purple-950 border border-purple-300 shadow-2xs'
                              : 'text-slate-700 hover:bg-pink-50'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span>{track.emoji}</span>
                            <span className="truncate">{track.name}</span>
                          </span>
                          {isSelected && isBgmOn && (
                            <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kawaii Sound / Mute Button with Popover Volume Slider */}
          <div
            className="relative"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              onClick={handleToggleMute}
              className={`group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-transform duration-150 hover:scale-110 active:scale-90 focus:outline-none drop-shadow-md ${
                isMuted ? 'opacity-70 grayscale-[35%]' : ''
              }`}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              <img
                src="/assets/btn_sound.png"
                alt="Sound & Volume"
                className="w-full h-full object-contain pointer-events-none"
              />
              {isMuted && (
                <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                  <VolumeX className="w-3 h-3" />
                </span>
              )}
            </button>

            {/* Hover volume slider popover */}
            {showVolumeSlider && (
              <div className="absolute right-0 top-full pt-2 z-50">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-3 border-2 border-amber-200 flex flex-col items-center gap-2 w-40">
                  <div className="flex items-center justify-between w-full text-[11px] text-slate-600 font-semibold">
                    <span>Volume</span>
                    <span>{isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Kawaii Circular Fullscreen Toggle */}
          <button
            onClick={handleToggleFullscreen}
            className={`group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-transform duration-150 hover:scale-110 active:scale-90 focus:outline-none drop-shadow-md ${
              isFullscreen ? 'ring-2 ring-amber-400' : ''
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            <img
              src="/assets/btn_fullscreen.png"
              alt="Fullscreen"
              className="w-full h-full object-contain pointer-events-none"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
