import React from 'react';
import { StoreItem } from '../types/game';
import { Trash2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface ShoppingBasketProps {
  items: StoreItem[];
  basket: { [itemId: string]: number };
  onClearBasket: () => void;
  onUpdateQty: (itemId: string, delta: number) => void;
}

export const ShoppingBasket: React.FC<ShoppingBasketProps> = ({
  items,
  basket,
  onClearBasket,
  onUpdateQty,
}) => {
  // Get all items in basket with count > 0
  const basketEntries = Object.entries(basket)
    .filter(([, qty]) => qty > 0)
    .map(([itemId, qty]) => {
      const item = items.find((i) => i.id === itemId);
      return { item, qty };
    })
    .filter((entry): entry is { item: StoreItem; qty: number } => !!entry.item);

  const totalItemCount = basketEntries.reduce((acc, curr) => acc + curr.qty, 0);
  const totalPrice = basketEntries.reduce(
    (acc, curr) => acc + curr.qty * (curr.item.price || 1),
    0
  );

  // Expand items into individual visual pieces inside the basket when total <= 12,
  // otherwise group by item type with a quantity badge so everything fits inside the basket cleanly.
  const expandIndividually = totalItemCount <= 12;
  const visualPieces: { item: StoreItem; key: string; badgeQty?: number; tilt: number }[] = [];

  if (expandIndividually) {
    let idx = 0;
    basketEntries.forEach(({ item, qty }) => {
      for (let q = 0; q < qty; q++) {
        // Gentle alternating rotation so items look naturally placed inside the top-down basket
        const tilt = ((idx % 5) - 2) * 4;
        visualPieces.push({
          item,
          key: `${item.id}-${q}`,
          tilt,
        });
        idx++;
      }
    });
  } else {
    basketEntries.forEach(({ item, qty }, idx) => {
      const tilt = ((idx % 3) - 1) * 3;
      visualPieces.push({
        item,
        key: item.id,
        badgeQty: qty,
        tilt,
      });
    });
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Compact Header Summary above the top-down basket */}
      <div className="w-full flex items-center justify-between px-3 py-1.5 mb-1 bg-white/85 backdrop-blur-xs rounded-2xl border border-pink-200 shadow-xs">
        <div className="flex items-center gap-2">
          <h3 className="text-xs sm:text-sm font-bold text-pink-950 font-display">
            Shopping Basket
          </h3>
          <span className="text-[11px] font-semibold text-emerald-700">
            · {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} · ${totalPrice}
          </span>
        </div>

        {basketEntries.length > 0 && (
          <button
            onClick={() => {
              sound.playPop();
              onClearBasket();
            }}
            className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Empty Basket"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Top-Down Kawaii Pink Basket with Transparent Background */}
      <div className="relative w-full max-w-[410px] mx-auto select-none">
        <img
          src="/assets/kawaii_basket.png"
          alt="Kawaii Shopping Basket"
          className="w-full h-auto block pointer-events-none drop-shadow-md"
        />

        {/* Interior Basket Cavity Overlay (fixed-size items with gentle overlap inside basket floor) */}
        <div
          className="absolute"
          style={{
            top: '23%',
            bottom: '23%',
            left: '17%',
            right: '17%',
          }}
        >
          {visualPieces.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-xs font-bold text-pink-700/75 text-center px-2 leading-tight pointer-events-none">
                Buy items from shelves to drop them in!
              </p>
            </div>
          ) : (
            visualPieces.map(({ item, key, badgeQty, tilt }, idx) => {
              const total = visualPieces.length;
              let leftPct = 33;
              let topPct = 18;

              if (total === 1) {
                leftPct = 33;
                topPct = 18;
              } else if (total === 2) {
                leftPct = idx === 0 ? 14 : 52;
                topPct = 18;
              } else if (total === 3) {
                leftPct = [4, 33, 62][idx];
                topPct = [22, 10, 22][idx];
              } else {
                const topRowCount = Math.ceil(total / 2);
                const isTopRow = idx < topRowCount;
                const rowIdx = isTopRow ? idx : idx - topRowCount;
                const rowLen = isTopRow ? topRowCount : total - topRowCount;
                const minLeft = isTopRow ? 2 : 6;
                const maxLeft = isTopRow ? 64 : 60;
                leftPct =
                  rowLen <= 1
                    ? 33
                    : minLeft + ((maxLeft - minLeft) * rowIdx) / (rowLen - 1);
                topPct = isTopRow ? 2 : 36;
              }

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    onUpdateQty(item.id, -1);
                  }}
                  title={`${item.name} — Click to remove 1`}
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    transform: `rotate(${tilt}deg)`,
                    zIndex: idx + 1,
                  }}
                  className="group absolute w-16 h-16 sm:w-20 sm:h-20 xl:w-24 xl:h-24 flex items-center justify-center rounded-xl transition-transform duration-150 hover:scale-110 hover:z-30 active:scale-95 focus:outline-none p-0.5"
                >
                  {item.customImageDataUrl ? (
                    <img
                      src={item.customImageDataUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain drop-shadow-md pointer-events-none"
                    />
                  ) : item.iconSvg ? (
                    <div
                      className="w-full h-full flex items-center justify-center drop-shadow-md pointer-events-none"
                      dangerouslySetInnerHTML={{ __html: item.iconSvg }}
                    />
                  ) : (
                    <span className="text-2xl drop-shadow-sm">🛍️</span>
                  )}

                  {badgeQty && badgeQty > 1 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-bold px-1 rounded-full border border-white shadow-xs">
                      ×{badgeQty}
                    </span>
                  )}

                  {/* Subtle remove indicator on hover */}
                  <span className="absolute -top-1 -right-1 hidden group-hover:flex w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold items-center justify-center shadow-xs">
                    -
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
