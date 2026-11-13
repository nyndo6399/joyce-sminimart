import React, { useState, useEffect, useRef } from 'react';
import { StoreItem } from '../types/game';
import { Volume2, HelpCircle, Check, X, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface SpellingModalProps {
  item: StoreItem | null;
  onClose: () => void;
  onUnlockSuccess: (itemId: string) => void;
  onReaction?: (type: 'happy' | 'sad', label?: string) => void;
}

export const SpellingModal: React.FC<SpellingModalProps> = ({
  item,
  onClose,
  onUnlockSuccess,
  onReaction,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (item) {
      setInputVal('');
      setErrorShake(false);
      setShowHint(false);
      setIsSuccess(false);
      // Auto-pronounce when opened for educational reinforcement
      sound.speakWord(item.word);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [item]);

  if (!item) return null;

  const targetWord = item.word.toLowerCase().trim();

  const handleCheck = () => {
    const entered = inputVal.toLowerCase().trim();
    if (entered === targetWord) {
      // Correct! Unlock item, play chime + clapping SFX, and peek happy character
      setIsSuccess(true);
      sound.playChime();
      sound.playClap();
      onReaction?.('happy', `Yay! "${item.name}" unlocked! 👏`);
      setTimeout(() => {
        onUnlockSuccess(item.id);
        onClose();
      }, 850);
    } else {
      // Wrong! Play sad/wrong SFX and show sad character
      sound.playWrong();
      onReaction?.('sad', 'Oops! Try again! 🥺');
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  const handleTouchLetter = (letter: string) => {
    sound.playPop();
    setInputVal((prev) => prev + letter);
  };

  const handleTouchBackspace = () => {
    sound.playPop();
    setInputVal((prev) => prev.slice(0, -1));
  };

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  // Clue display (e.g. "_ p p l _")
  const getMaskedWord = () => {
    return targetWord
      .split('')
      .map((ch, idx) => (idx === 0 || showHint ? ch : '_'))
      .join(' ');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-xl sm:max-w-2xl pink-game-frame p-5 sm:p-7 ${
          errorShake ? 'animate-shake' : ''
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-1.5 right-1.5 p-2 rounded-full text-rose-500 hover:text-rose-800 hover:bg-white/80 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-3">
          <span className="text-xs sm:text-sm font-bold text-rose-800 bg-white/80 border border-pink-200 px-3.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
            Mystery Shelf Item
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-rose-950 font-display mt-2">
            Spell to Unlock!
          </h3>
          <p className="text-xs sm:text-sm text-rose-900/80 font-medium mt-0.5">
            Type the name of this item to reveal its vibrant colors.
          </p>
        </div>

        {/* Item Preview Image (Grayscale until success) */}
        <div className="flex flex-col items-center justify-center my-3">
          <div
            className={`w-32 h-32 sm:w-36 sm:h-36 rounded-2xl flex items-center justify-center p-2.5 transition-all duration-500 border border-pink-200/70 ${
              isSuccess
                ? 'bg-amber-100/90 scale-110 drop-shadow-xl filter-none'
                : 'bg-white/85 shadow-inner filter grayscale contrast-90'
            }`}
          >
            {item.customImageDataUrl ? (
              <img
                src={item.customImageDataUrl}
                alt="Mystery item"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain pointer-events-none"
                style={{ transform: `scale(${item.scale || 1})` }}
              />
            ) : item.iconSvg ? (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ transform: `scale(${item.scale || 1})` }}
                dangerouslySetInnerHTML={{ __html: item.iconSvg }}
              />
            ) : (
              <span className="text-5xl">🛍️</span>
            )}
          </div>

          {/* Educational Pronunciation & Hint Row */}
          <div className="flex items-center gap-3 mt-3.5">
            <button
              onClick={() => {
                sound.playPop();
                sound.speakWord(item.word);
              }}
              className="flex items-center gap-2 px-4 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-900 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95"
              title="Hear Pronunciation in English"
            >
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
              <span>Listen</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setShowHint(!showHint);
              }}
              className="flex items-center gap-2 px-4 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95"
              title="Show Spelling Clue"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              <span>{showHint ? 'Hide Clue' : 'Clue'}</span>
            </button>
          </div>

          {/* Letter Template / Blanks */}
          <div className="mt-2.5 text-xl sm:text-2xl font-bold font-mono tracking-widest text-slate-800">
            {getMaskedWord()}
          </div>
          {showHint && item.hint && (
            <p className="text-xs sm:text-sm text-amber-950 bg-amber-50 px-3 py-1.5 rounded-xl mt-1.5 max-w-sm text-center border border-amber-200 font-medium">
              💡 {item.hint}
            </p>
          )}
        </div>

        {/* Input Field and Submit */}
        <div className="mt-3 space-y-3.5">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type word here..."
              autoCapitalize="none"
              autoComplete="off"
              spellCheck={false}
              className={`flex-1 px-4 py-3 rounded-2xl border-2 text-center text-xl sm:text-2xl font-bold uppercase tracking-wider text-slate-800 focus:outline-none transition-all ${
                errorShake
                  ? 'border-rose-400 bg-rose-50'
                  : isSuccess
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : 'border-pink-300 focus:border-rose-400 bg-white/90'
              }`}
            />
            <button
              onClick={handleCheck}
              className={`px-6 py-3 rounded-2xl font-bold text-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-1 ${
                isSuccess
                  ? 'bg-emerald-500'
                  : 'bg-rose-500 hover:bg-rose-600'
              }`}
            >
              {isSuccess ? <Sparkles className="w-6 h-6" /> : <Check className="w-6 h-6" />}
            </button>
          </div>

          {/* On-Screen Touch Keyboard for kids & tablet users */}
          <div className="pt-2.5 border-t border-pink-200/80">
            <div className="flex flex-wrap justify-center gap-1.5 max-w-md mx-auto">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleTouchLetter(letter)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/90 hover:bg-pink-100 hover:text-pink-800 active:scale-90 font-bold text-sm sm:text-base uppercase text-slate-700 transition-all shadow-xs border border-pink-200"
                >
                  {letter}
                </button>
              ))}
              <button
                onClick={handleTouchBackspace}
                className="px-3 h-8 sm:h-9 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 active:scale-90 font-bold text-xs sm:text-sm transition-all shadow-xs border border-rose-200"
              >
                ⌫ Del
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
