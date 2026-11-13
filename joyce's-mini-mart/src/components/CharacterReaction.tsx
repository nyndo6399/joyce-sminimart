import React from 'react';

export type CharacterReactionType = 'happy' | 'sad' | null;

interface CharacterReactionProps {
  reaction: CharacterReactionType;
  label?: string;
}

export const CharacterReaction: React.FC<CharacterReactionProps> = ({
  reaction,
  label,
}) => {
  if (!reaction) return null;

  const isHappy = reaction === 'happy';

  return (
    <div
      className="fixed bottom-0 right-3 sm:right-10 z-[70] pointer-events-none select-none flex flex-col items-center animate-peek-up"
      aria-live="polite"
    >
      {/* Cute Speech Bubble */}
      <div
        className={`mb-1 px-3.5 py-1.5 rounded-2xl shadow-lg border-2 font-bold text-xs sm:text-sm whitespace-nowrap ${
          isHappy
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
            : 'bg-rose-50 text-rose-800 border-rose-300'
        }`}
      >
        {label || (isHappy ? 'Yay! Great job! 👏✨' : 'Oops! Try again! 🥺')}
      </div>

      {/* Character peeking up from the bottom edge */}
      <div className={isHappy ? 'animate-clap-bounce' : 'animate-sad-sway'}>
        <img
          src={isHappy ? '/assets/char_happy.png' : '/assets/char_sad.png'}
          alt={isHappy ? 'Happy clapping character' : 'Sad character'}
          className="h-60 sm:h-72 md:h-80 w-auto object-contain -mb-5 sm:-mb-6 drop-shadow-2xl"
        />
      </div>
    </div>
  );
};
