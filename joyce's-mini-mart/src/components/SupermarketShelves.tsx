import React from 'react';
import { StoreItem } from '../types/game';
import { Lock, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface SupermarketShelvesProps {
  items: StoreItem[];
  unlockedItemIds: string[];
  basket: { [itemId: string]: number };
  onItemClick: (item: StoreItem, isUnlocked: boolean) => void;
}

// Exact measured percentage coordinates for the 5x4 compartments on public/assets/kawaii_shelf.png (1803x1315)
const COL_LEFT_PCT = [2.1, 21.5, 40.6, 59.9, 79.4];
const COL_WIDTH_PCT = 17.8;
const ROW_TOP_PCT = [15.0, 36.5, 57.3, 77.8];
const ROW_HEIGHT_PCT = 20.8;

export const SupermarketShelves: React.FC<SupermarketShelvesProps> = ({
  items,
  unlockedItemIds,
  basket,
  onItemClick,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Compact Header Strip above the Kawaii Shelf */}
      <div className="w-full flex items-center justify-between px-3 py-1.5 mb-1.5 bg-white/85 backdrop-blur-xs rounded-2xl border border-pink-200 shadow-xs">
        <p className="text-[11px] sm:text-xs font-semibold text-pink-950">
          Tap a gray item to spell its name and unlock its colors!
        </p>
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>
            {unlockedItemIds.length}/{items.length} Unlocked
          </span>
        </div>
      </div>

      {/* Kawaii 5x4 Pink Shelf Image with Transparent Background */}
      <div className="relative w-full select-none">
        <img
          src="/assets/kawaii_shelf.png"
          alt="Kawaii Supermarket Shelves"
          className="w-full h-auto block pointer-events-none drop-shadow-lg"
        />

        {/* 20 Compartment Slots overlaid directly inside the drawn cubbies */}
        {items.map((item) => {
          const slot = Math.max(0, Math.min(19, item.slotIndex));
          const col = slot % 5;
          const row = Math.floor(slot / 5);

          const isUnlocked = unlockedItemIds.includes(item.id);
          const inBasket = basket[item.id] || 0;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                sound.playPop();
                onItemClick(item, isUnlocked);
              }}
              style={{
                left: `${COL_LEFT_PCT[col]}%`,
                top: `${ROW_TOP_PCT[row]}%`,
                width: `${COL_WIDTH_PCT}%`,
                height: `${ROW_HEIGHT_PCT}%`,
              }}
              className="group absolute flex flex-col items-center justify-between cursor-pointer focus:outline-none p-[0.8%]"
              title={isUnlocked ? `${item.name} ($${item.price})` : 'Spell to unlock!'}
            >

              {/* Basket Quantity Count Badge */}
              {inBasket > 0 && (
                <div className="absolute -top-1.5 -left-1 z-20 bg-emerald-600 text-white text-[10px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-md border border-white">
                  {inBasket}
                </div>
              )}

              {/* Item Graphic sitting inside the cubby */}
              <div
                className={`relative w-full flex-1 flex items-center justify-center transition-all duration-200 min-h-0 ${
                  isUnlocked
                    ? 'group-hover:-translate-y-1 group-hover:scale-110 active:scale-95 drop-shadow-md'
                    : 'filter grayscale opacity-80 contrast-90 group-hover:scale-105 active:scale-95'
                }`}
              >
                {item.customImageDataUrl ? (
                  <img
                    src={item.customImageDataUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="max-w-[96%] max-h-[96%] object-contain pointer-events-none"
                    style={{ transform: `scale(${item.scale || 1})` }}
                  />
                ) : item.iconSvg ? (
                  <div
                    className="w-[95%] h-[95%] flex items-center justify-center pointer-events-none"
                    style={{ transform: `scale(${item.scale || 1})` }}
                    dangerouslySetInnerHTML={{ __html: item.iconSvg }}
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl">🛍️</span>
                )}

                {/* Lock Indicator when Grayscale */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 text-pink-700 flex items-center justify-center shadow-sm border border-pink-300">
                      <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                )}
              </div>

              {/* Price & Name Label aligned over the bottom shelf tag */}
              <div className="w-full flex items-center justify-center pt-0.5 shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 border border-pink-300/80 shadow-xs text-[9px] sm:text-[11px] font-bold text-slate-800 leading-tight max-w-full truncate">
                  <span className="capitalize truncate">
                    {isUnlocked ? item.name : '???'}
                  </span>
                  <span className="text-pink-700 shrink-0">${item.price}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
