import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Volume2, X, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

interface MomSpeechOverlayProps {
  text: string | null;
  onClose: () => void;
}

export const MomSpeechOverlay: React.FC<MomSpeechOverlayProps> = ({
  text,
  onClose,
}) => {
  const [revealedCount, setRevealedCount] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fallbackTimerRef = useRef<number | null>(null);
  const autoCloseTimerRef = useRef<number | null>(null);
  const boundaryUsedRef = useRef(false);

  const cleanText = useMemo(
    () =>
      text
        ? text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim()
        : '',
    [text]
  );

  const words = useMemo(
    () => (cleanText ? cleanText.split(/\s+/) : []),
    [cleanText]
  );

  // Character offset where each word starts in cleanText
  const wordStarts = useMemo(() => {
    const starts: number[] = [];
    let cursor = 0;
    for (const w of words) {
      const idx = cleanText.indexOf(w, cursor);
      starts.push(idx >= 0 ? idx : cursor);
      cursor = (idx >= 0 ? idx : cursor) + w.length;
    }
    return starts;
  }, [words, cleanText]);

  const clearTimers = useCallback(() => {
    if (fallbackTimerRef.current) {
      window.clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (autoCloseTimerRef.current) {
      window.clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  }, []);

  const startSpeaking = useCallback(() => {
    if (!text || words.length === 0) return;

    clearTimers();
    boundaryUsedRef.current = false;
    setIsSpeaking(true);
    setRevealedCount(1);

    // Smooth fallback timer in case the browser voice doesn't fire onboundary
    fallbackTimerRef.current = window.setInterval(() => {
      if (boundaryUsedRef.current) return;
      setRevealedCount((prev) => {
        if (prev >= words.length) {
          if (fallbackTimerRef.current) {
            window.clearInterval(fallbackTimerRef.current);
            fallbackTimerRef.current = null;
          }
          return prev;
        }
        return prev + 1;
      });
    }, 300);

    sound.speakMomMessage(
      cleanText,
      () => {
        setIsSpeaking(false);
        setRevealedCount(words.length);
        if (fallbackTimerRef.current) {
          window.clearInterval(fallbackTimerRef.current);
          fallbackTimerRef.current = null;
        }
        autoCloseTimerRef.current = window.setTimeout(() => {
          onClose();
        }, 2400);
      },
      (charIndex) => {
        boundaryUsedRef.current = true;
        // Find which word corresponds to charIndex
        let wordIdx = 0;
        for (let i = 0; i < wordStarts.length; i++) {
          if (charIndex >= wordStarts[i]) {
            wordIdx = i;
          } else {
            break;
          }
        }
        setRevealedCount((prev) => Math.max(prev, wordIdx + 1));
      }
    );
  }, [text, cleanText, words.length, wordStarts, clearTimers, onClose]);

  useEffect(() => {
    if (text) {
      startSpeaking();
    } else {
      clearTimers();
      sound.stopSpeech();
    }
    return () => {
      clearTimers();
    };
  }, [text, startSpeaking, clearTimers]);

  const handleClose = () => {
    clearTimers();
    sound.stopSpeech();
    onClose();
  };

  if (!text) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col items-center max-w-2xl w-full select-none"
      >
        {/* Mom's Speech Bubble with Word-by-Word Reveal */}
        <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-md rounded-3xl px-6 py-5 sm:px-7 sm:py-6 shadow-2xl border-4 border-pink-300 mb-3">
          {/* Bubble Controls */}
          <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-pink-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 text-white text-sm flex items-center justify-center shadow-xs">
                👩
              </span>
              <span className="font-bold text-base text-pink-900 font-display">
                Mom
              </span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  startSpeaking();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                  isSpeaking
                    ? 'bg-pink-500 text-white animate-pulse shadow-xs'
                    : 'bg-pink-100 hover:bg-pink-200 text-pink-800'
                }`}
                title="Replay Mom's voice"
              >
                <Volume2 className="w-4 h-4" />
                <span>Replay</span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progressive Spoken Text */}
          <p className="text-lg sm:text-2xl font-bold leading-relaxed text-slate-800 min-h-[4rem] flex flex-wrap gap-x-2 gap-y-1">
            {words.map((word, idx) => {
              const isVisible = idx < revealedCount;
              const isCurrent = idx === revealedCount - 1 && isSpeaking;
              return (
                <span
                  key={`${word}-${idx}`}
                  className={`inline-block transition-all duration-200 ${
                    isVisible
                      ? isCurrent
                        ? 'opacity-100 scale-105 text-pink-600'
                        : 'opacity-100 scale-100 text-slate-800'
                      : 'opacity-0 translate-y-1 pointer-events-none'
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </p>

          {/* Speech Bubble Pointer Tail pointing down at Mom */}
          <div className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-5 h-5 bg-white border-r-4 border-b-4 border-pink-300 rotate-45" />
        </div>

        {/* Big Centered Mom Character */}
        <div className={isSpeaking ? 'animate-gentle-bounce' : ''}>
          <img
            src="/assets/char_mom.png"
            alt="Mom"
            className="h-[310px] sm:h-[400px] md:h-[450px] w-auto object-contain drop-shadow-2xl pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};
