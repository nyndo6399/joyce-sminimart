import { useState, useRef, useCallback, useEffect } from 'react';
import { StoreItem, Room, MomMission, MissionItem } from './types/game';
import { DEFAULT_ROOMS } from './data/defaultRooms';
import {
  loadSavedRooms,
  saveRooms,
  loadActiveRoomId,
  saveActiveRoomId,
  loadUnlockedItems,
  saveUnlockedItems,
} from './utils/storage';
import { sound } from './utils/audio';
import { autoRemoveBackgroundFromSource } from './utils/canvasBackgroundRemover';

import { TopBar } from './components/TopBar';
import { TitleScreen } from './components/TitleScreen';
import { SupermarketShelves } from './components/SupermarketShelves';
import { ShoppingBasket } from './components/ShoppingBasket';
import { SmartphoneUI } from './components/SmartphoneUI';
import { SpellingModal } from './components/SpellingModal';
import { QuantityModal } from './components/QuantityModal';
import { SettingsModal } from './components/SettingsModal';
import { ConfettiCanvas } from './components/ConfettiCanvas';
import {
  CharacterReaction,
  CharacterReactionType,
} from './components/CharacterReaction';
import { MomSpeechOverlay } from './components/MomSpeechOverlay';

export default function App() {
  const [view, setView] = useState<'TITLE' | 'STORE'>('TITLE');
  const [rooms, setRooms] = useState<Room[]>(() => loadSavedRooms());
  const [activeRoomId, setActiveRoomId] = useState<string>(() =>
    loadActiveRoomId(rooms)
  );
  const [unlockedItemIds, setUnlockedItemIds] = useState<string[]>(() =>
    loadUnlockedItems()
  );
  const [basket, setBasket] = useState<{ [itemId: string]: number }>({});
  const [activeMission, setActiveMission] = useState<MomMission | null>(null);

  // Modals state
  const [spellingItem, setSpellingItem] = useState<StoreItem | null>(null);
  const [quantityItem, setQuantityItem] = useState<StoreItem | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [momSpeechText, setMomSpeechText] = useState<string | null>(null);
  const [reactionState, setReactionState] = useState<{
    type: CharacterReactionType;
    label?: string;
  } | null>(null);
  const reactionTimerRef = useRef<number | null>(null);
  const checkedCutoutsRef = useRef<Set<string>>(new Set());

  const triggerReaction = useCallback(
    (type: 'happy' | 'sad', label?: string) => {
      if (reactionTimerRef.current) {
        window.clearTimeout(reactionTimerRef.current);
      }
      setReactionState({ type, label });
      reactionTimerRef.current = window.setTimeout(
        () => {
          setReactionState(null);
        },
        type === 'happy' ? 2400 : 1800
      );
    },
    []
  );

  const currentRoom =
    rooms.find((r) => r.id === activeRoomId) || rooms[0] || DEFAULT_ROOMS[0];

  // Auto-strip opaque backgrounds on any custom shelf images (e.g. URLs, CSV imports, or previously saved un-cutout photos)
  useEffect(() => {
    const candidates = currentRoom.items.filter((it) => {
      if (!it.customImageDataUrl) return false;
      const key = `${it.id}::${it.customImageDataUrl.length}::${it.customImageDataUrl.slice(0, 64)}`;
      return !checkedCutoutsRef.current.has(key);
    });
    if (candidates.length === 0) return;

    let cancelled = false;
    candidates.forEach((it) => {
      const key = `${it.id}::${it.customImageDataUrl!.length}::${it.customImageDataUrl!.slice(0, 64)}`;
      checkedCutoutsRef.current.add(key);
    });

    (async () => {
      const updates = new Map<string, string>();
      await Promise.all(
        candidates.map(async (it) => {
          try {
            const { dataUrl, alreadyTransparent } =
              await autoRemoveBackgroundFromSource(it.customImageDataUrl!);
            if (!alreadyTransparent && dataUrl) {
              const newKey = `${it.id}::${dataUrl.length}::${dataUrl.slice(0, 64)}`;
              checkedCutoutsRef.current.add(newKey);
              updates.set(it.id, dataUrl);
            }
          } catch {
            // Keep original image if unreachable
          }
        })
      );

      if (cancelled || updates.size === 0) return;

      setRooms((prevRooms) => {
        const nextRooms = prevRooms.map((rm) => {
          if (rm.id !== currentRoom.id) return rm;
          return {
            ...rm,
            items: rm.items.map((it) => {
              const cleaned = updates.get(it.id);
              return cleaned ? { ...it, customImageDataUrl: cleaned } : it;
            }),
          };
        });
        saveRooms(nextRooms);
        return nextRooms;
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [currentRoom.id, currentRoom.items]);

  // Persist rooms when updated
  const handleSaveRooms = (updatedRooms: Room[]) => {
    setRooms(updatedRooms);
    saveRooms(updatedRooms);
  };

  // Change active room
  const handleSelectRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    saveActiveRoomId(roomId);
    // When switching rooms, reset basket or update mission
    setBasket({});
    setActiveMission(null);
  };

  // Reset all data to default presets
  const handleResetDefaults = () => {
    setRooms(DEFAULT_ROOMS);
    saveRooms(DEFAULT_ROOMS);
    setActiveRoomId(DEFAULT_ROOMS[0].id);
    saveActiveRoomId(DEFAULT_ROOMS[0].id);
    setUnlockedItemIds([]);
    saveUnlockedItems([]);
    setBasket({});
    setActiveMission(null);
    setShowSettings(false);
    sound.playChime();
  };

  // Generate Mom's Shopping List based on currently stocked items in the active room
  const buildMission = useCallback(
    (currentBasket: { [itemId: string]: number }): MomMission | null => {
      if (currentRoom.items.length === 0) return null;

      // Pick 2 or 3 distinct items from room
      const shuffled = [...currentRoom.items].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.min(3, shuffled.length));

      const requirements: MissionItem[] = selected.map((item) => {
        const requiredQty = Math.floor(Math.random() * 2) + 1;
        const currentInBasket = currentBasket[item.id] || 0;
        return {
          itemId: item.id,
          itemName: item.name,
          word: item.word,
          requiredQty,
          collectedQty: Math.min(currentInBasket, requiredQty),
          iconSvg: item.iconSvg,
          customImageDataUrl: item.customImageDataUrl,
        };
      });

      return {
        id: `mission-${Date.now()}`,
        active: true,
        completed: false,
        requirements,
        createdAt: Date.now(),
      };
    },
    [currentRoom.items]
  );

  const generateMomMission = useCallback(() => {
    const mission = buildMission(basket);
    if (mission) {
      setActiveMission(mission);
    }
  }, [buildMission, basket]);

  // Clicking "New Mission" locks all shelf items back to initial grayscale & clears basket
  const handleNewMission = useCallback(() => {
    setUnlockedItemIds([]);
    saveUnlockedItems([]);
    setBasket({});
    const freshMission = buildMission({});
    setActiveMission(freshMission);
    sound.playPhoneRing();
  }, [buildMission]);

  // Handle clicking an item on the shelf
  const handleItemClick = (item: StoreItem, isUnlocked: boolean) => {
    if (!isUnlocked) {
      // Grayed out -> open spelling unlock modal
      setSpellingItem(item);
    } else {
      // Colored -> open quantity purchase modal
      setQuantityItem(item);
    }
  };

  // Unlock item on correct spelling
  const handleUnlockSuccess = (itemId: string) => {
    if (!unlockedItemIds.includes(itemId)) {
      const next = [...unlockedItemIds, itemId];
      setUnlockedItemIds(next);
      saveUnlockedItems(next);
    }
  };

  // Purchase items and add to basket
  const handleBuyItem = (item: StoreItem, quantity: number) => {
    const nextBasket = {
      ...basket,
      [item.id]: (basket[item.id] || 0) + quantity,
    };
    setBasket(nextBasket);

    // Update Mom's mission progress if applicable
    if (activeMission && activeMission.active) {
      const updatedReqs = activeMission.requirements.map((req) => {
        if (req.itemId === item.id) {
          const totalInBasket = nextBasket[item.id] || 0;
          return {
            ...req,
            collectedQty: Math.min(totalInBasket, req.requiredQty),
          };
        }
        return req;
      });

      setActiveMission({
        ...activeMission,
        requirements: updatedReqs,
      });
    }
  };

  // Update basket quantity from shopping basket controls
  const handleUpdateBasketQty = (itemId: string, delta: number) => {
    const current = basket[itemId] || 0;
    const nextQty = Math.max(0, current + delta);
    const nextBasket = { ...basket, [itemId]: nextQty };
    setBasket(nextBasket);

    // Sync mission progress
    if (activeMission && activeMission.active) {
      const updatedReqs = activeMission.requirements.map((req) => {
        if (req.itemId === itemId) {
          return {
            ...req,
            collectedQty: Math.min(nextQty, req.requiredQty),
          };
        }
        return req;
      });
      setActiveMission({
        ...activeMission,
        requirements: updatedReqs,
      });
    }
  };

  const handleClearBasket = () => {
    setBasket({});
    if (activeMission && activeMission.active) {
      const resetReqs = activeMission.requirements.map((req) => ({
        ...req,
        collectedQty: 0,
      }));
      setActiveMission({
        ...activeMission,
        requirements: resetReqs,
      });
    }
  };

  // Complete Mom's mission
  const handleCompleteMission = () => {
    if (activeMission) {
      setActiveMission({
        ...activeMission,
        completed: true,
      });
      setShowConfetti(true);
    }
  };

  const [gameResetSeed, setGameResetSeed] = useState(0);

  // Toolbar Reset: lock all unlocked shelf items, clear basket & mission, and restart game from the beginning
  const handleResetGame = useCallback(() => {
    setUnlockedItemIds([]);
    saveUnlockedItems([]);
    setBasket({});
    setActiveMission(null);
    setSpellingItem(null);
    setQuantityItem(null);
    setMomSpeechText(null);
    setShowConfetti(false);
    setReactionState(null);
    setGameResetSeed((prev) => prev + 1);
    sound.stopSpeech();
    sound.playChime();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-pink-50/40 to-amber-50/60 text-slate-800 flex flex-col justify-between selection:bg-pink-200">
      {/* Confetti Canvas for Victory Celebration */}
      <ConfettiCanvas
        active={showConfetti}
        onFinish={() => setShowConfetti(false)}
      />

      {/* Top Bar Navigation */}
      <TopBar
        onGoHome={() => setView('TITLE')}
        onOpenSettings={() => setShowSettings(true)}
        onResetGame={handleResetGame}
        roomName={currentRoom.name}
        transparent={view === 'TITLE'}
      />

      {/* Main View Area */}
      <main
        className={
          view === 'TITLE'
            ? 'flex-1 w-full p-0'
            : "flex-1 w-full bg-[url('/assets/aistudio/Blur_image_background_c4bc789a_7d4fffc4.jpg')] bg-cover bg-center bg-no-repeat"
        }
      >
        {view === 'TITLE' ? (
          <TitleScreen
            rooms={rooms}
            activeRoomId={activeRoomId}
            onSelectRoom={handleSelectRoom}
            onStartGame={() => setView('STORE')}
            onOpenSettings={() => setShowSettings(true)}
          />
        ) : (
          <div className="max-w-[1680px] mx-auto w-full px-2 sm:px-4 py-2">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_470px] 2xl:grid-cols-[minmax(0,1fr)_530px] gap-3 lg:gap-4 items-start">
              {/* Left Area (Supermarket Shelves, wide dominant area) */}
              <div className="space-y-4">
                <SupermarketShelves
                  items={currentRoom.items}
                  unlockedItemIds={unlockedItemIds}
                  basket={basket}
                  onItemClick={handleItemClick}
                />
              </div>

              {/* Right Area (Shopping Basket on top + Smartphone on bottom) */}
              <div className="space-y-4">
                {/* Shopping Basket */}
                <ShoppingBasket
                  items={currentRoom.items}
                  basket={basket}
                  onClearBasket={handleClearBasket}
                  onUpdateQty={handleUpdateBasketQty}
                />

                {/* Smartphone Interface */}
                <SmartphoneUI
                  key={gameResetSeed}
                  mission={activeMission}
                  onAcceptMission={generateMomMission}
                  onDeclineMission={() => setActiveMission(null)}
                  onCompleteMission={handleCompleteMission}
                  onNewMission={handleNewMission}
                  onPlayMomVoice={(text) => setMomSpeechText(text)}
                  hasUnlockedAnyItems={unlockedItemIds.length > 0}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Active Modals */}
      <SpellingModal
        item={spellingItem}
        onClose={() => setSpellingItem(null)}
        onUnlockSuccess={handleUnlockSuccess}
        onReaction={triggerReaction}
      />

      {/* Peeking Character Reaction Overlay (Happy Clapping / Sad) */}
      <CharacterReaction
        reaction={reactionState?.type || null}
        label={reactionState?.label}
      />

      {/* Big Centered Mom Speech Overlay with Word-by-Word Reveal */}
      <MomSpeechOverlay
        text={momSpeechText}
        onClose={() => setMomSpeechText(null)}
      />

      <QuantityModal
        item={quantityItem}
        currentBasketQty={quantityItem ? basket[quantityItem.id] || 0 : 0}
        mission={activeMission}
        onClose={() => setQuantityItem(null)}
        onBuy={handleBuyItem}
      />

      {showSettings && (
        <SettingsModal
          rooms={rooms}
          activeRoomId={activeRoomId}
          onSelectRoom={handleSelectRoom}
          onSaveRooms={handleSaveRooms}
          onResetDefaults={handleResetDefaults}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Footer (only in store view so Title cover stays full-screen) */}
      {view === 'STORE' && (
        <footer className="py-2.5 px-4 text-center text-xs text-amber-900/60 border-t border-amber-200/40">
          Joyce&apos;s Mini Mart · 100% Offline Educational Supermarket Game for Young Learners
        </footer>
      )}
    </div>
  );
}
