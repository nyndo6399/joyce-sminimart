import React from 'react';
import { Room } from '../types/game';
import { sound } from '../utils/audio';

interface TitleScreenProps {
  rooms: Room[];
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
  onStartGame: () => void;
  onOpenSettings: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  rooms,
  activeRoomId,
  onSelectRoom,
  onStartGame,
}) => {
  const handleStart = () => {
    sound.playPop();
    sound.startBgm();
    onStartGame();
  };

  return (
    <div className="relative w-full h-screen min-h-[540px] overflow-hidden select-none">
      {/* Full-Screen Kawaii Supermarket Game Cover Art */}
      <img
        src="/assets/cover_art.jpg"
        alt="Joyce's Mini Mart Cover Art"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Subtle bottom gradient vignette for crisp button contrast */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

      {/* Floating Bottom Action Controls (Unit Picker + Go Shopping Button) */}
      <div className="absolute inset-x-0 bottom-6 sm:bottom-10 z-20 flex flex-col items-center justify-end gap-3 px-4">
        {/* Compact Translucent Lesson Unit Selector */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border-2 border-pink-300 shadow-lg">
          <span className="text-[11px] sm:text-xs font-bold text-pink-700 uppercase tracking-wide whitespace-nowrap">
            Unit:
          </span>
          <select
            value={activeRoomId}
            onChange={(e) => {
              sound.playPop();
              onSelectRoom(e.target.value);
            }}
            className="bg-transparent font-bold text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer pr-1"
          >
            {rooms.map((rm) => (
              <option key={rm.id} value={rm.id}>
                {rm.name} ({rm.items.length})
              </option>
            ))}
          </select>
        </div>

        {/* Kawaii "Go shopping" Start Button */}
        <button
          onClick={handleStart}
          className="group relative w-64 sm:w-80 md:w-96 transition-transform duration-150 hover:scale-105 active:scale-95 focus:outline-none drop-shadow-2xl"
          title="Go Shopping!"
        >
          <img
            src="/assets/btn_go_shopping.png"
            alt="Go shopping"
            className="w-full h-auto block pointer-events-none"
          />
        </button>
      </div>
    </div>
  );
};
