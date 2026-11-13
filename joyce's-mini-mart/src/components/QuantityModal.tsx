import React, { useState, useEffect } from 'react';
import { StoreItem, MomMission } from '../types/game';
import { X, ShoppingBag, Heart, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface QuantityModalProps {
  item: StoreItem | null;
  currentBasketQty: number;
  mission: MomMission | null;
  onClose: () => void;
  onBuy: (item: StoreItem, quantity: number) => void;
}

export const QuantityModal: React.FC<QuantityModalProps> = ({
  item,
  currentBasketQty,
  mission,
  onClose,
  onBuy,
}) => {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (item) {
      setQty(1);
    }
  }, [item]);

  if (!item) return null;

  // Check if Mom needs this item
  const missionReq = mission?.requirements.find((r) => r.itemId === item.id);
  const remainingNeeded = missionReq
    ? Math.max(0, missionReq.requiredQty - missionReq.collectedQty)
    : 0;

  const handleIncrement = () => {
    sound.playPop();
    setQty((prev) => Math.min(prev + 1, 9));
  };

  const handleDecrement = () => {
    sound.playPop();
    setQty((prev) => Math.max(prev - 1, 1));
  };

  const handleBuy = () => {
    sound.playBuy();
    onBuy(item, qty);
    onClose();
  };

  const totalPrice = qty * item.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg sm:max-w-xl pink-game-frame p-5 sm:p-7">
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
          <span className="text-xs sm:text-sm font-bold text-emerald-800 bg-white/85 border border-emerald-200 px-3.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
            Supermarket Counter
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-rose-950 font-display mt-2 capitalize">
            {item.name}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-800 font-semibold mt-0.5">
            ${item.price} each · {currentBasketQty} already in basket
          </p>
        </div>

        {/* Item Preview in full vibrant color */}
        <div className="w-32 h-32 sm:w-36 sm:h-36 mx-auto my-3 rounded-2xl bg-white/85 flex items-center justify-center p-2.5 shadow-inner border border-pink-200/70">
          {item.customImageDataUrl ? (
            <img
              src={item.customImageDataUrl}
              alt={item.name}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full object-contain"
              style={{ transform: `scale(${item.scale || 1})` }}
            />
          ) : item.iconSvg ? (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ transform: `scale(${item.scale || 1})` }}
              dangerouslySetInnerHTML={{ __html: item.iconSvg }}
            />
          ) : (
            <span className="text-4xl">🛍️</span>
          )}
        </div>

        {/* Mom's Mission Tip */}
        {remainingNeeded > 0 ? (
          <div className="flex items-center justify-center gap-2 bg-white/85 text-rose-800 text-xs sm:text-sm font-semibold py-1.5 px-3.5 rounded-xl border border-rose-200 mb-3 animate-gentle-bounce">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>Mom still needs {remainingNeeded} of these!</span>
          </div>
        ) : (
          <div className="text-center text-xs sm:text-sm text-rose-900/75 font-medium mb-2">
            Select how many you would like to purchase
          </div>
        )}

        {/* Quantity Controls: [-] [qty] [+] */}
        <div className="flex items-center justify-center gap-5 my-3.5">
          <button
            onClick={handleDecrement}
            className="w-12 h-12 rounded-2xl bg-white/90 hover:bg-white active:scale-90 text-slate-700 font-bold text-xl flex items-center justify-center transition-all shadow-xs border border-pink-200"
          >
            -
          </button>
          <div className="min-w-[56px] text-center">
            <span className="text-3xl font-bold text-rose-950 font-mono">
              {qty}
            </span>
          </div>
          <button
            onClick={handleIncrement}
            className="w-12 h-12 rounded-2xl bg-emerald-100 hover:bg-emerald-200 active:scale-90 text-emerald-800 font-bold text-xl flex items-center justify-center transition-all shadow-xs border border-emerald-300"
          >
            +
          </button>
        </div>

        {/* Total Price and Buy Button */}
        <div className="mt-4 pt-3 border-t border-pink-200/80 space-y-2.5">
          <div className="flex items-center justify-between text-sm sm:text-base font-semibold text-slate-700 px-1">
            <span>Total Cost:</span>
            <span className="text-base sm:text-lg font-bold text-emerald-700">${totalPrice}</span>
          </div>

          <button
            onClick={handleBuy}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Buy & Add to Basket</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
