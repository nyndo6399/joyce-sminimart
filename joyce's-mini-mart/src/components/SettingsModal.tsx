import React, { useState, useRef, useEffect } from 'react';
import { Room, StoreItem } from '../types/game';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Layers,
  Wand2,
  Check,
  Link as LinkIcon,
  FileSpreadsheet,
  Volume2,
} from 'lucide-react';
import { sound } from '../utils/audio';
import {
  autoRemoveBackgroundFromSource,
  removeBackground,
  RemovalOptions,
  defaultRemovalOptions,
} from '../utils/canvasBackgroundRemover';
import {
  importItemsFromCsv,
  generateSampleCsv,
} from '../utils/csvImport';

interface SettingsModalProps {
  rooms: Room[];
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
  onSaveRooms: (rooms: Room[]) => void;
  onResetDefaults: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  rooms,
  activeRoomId,
  onSelectRoom,
  onSaveRooms,
  onResetDefaults,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'editor'>('rooms');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);

  // New room modal state
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  // Item editor state
  const currentRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];
  const currentItem = currentRoom.items.find(
    (i) => i.slotIndex === selectedSlotIndex
  );

  const [itemName, setItemName] = useState('');
  const [itemWord, setItemWord] = useState('');
  const [itemCategory, setItemCategory] = useState('Custom');
  const [itemPrice, setItemPrice] = useState(2);
  const [itemHint, setItemHint] = useState('');
  const [itemScale, setItemScale] = useState(1);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [urlStatusMsg, setUrlStatusMsg] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  // CSV & Voice state
  const [confirmReset, setConfirmReset] = useState(false);
  const [csvNotice, setCsvNotice] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [englishVoices, setEnglishVoices] = useState<SpeechSynthesisVoice[]>(
    () => sound.getEnglishVoices()
  );
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(
    () =>
      sound.getPreferredVoiceURI() ||
      sound.getBestEnglishVoice()?.voiceURI ||
      ''
  );

  // Background removal options state
  const [rawImage, setRawImage] = useState<HTMLImageElement | null>(null);
  const [bgRemovalOptions, setBgRemovalOptions] = useState<RemovalOptions>(
    defaultRemovalOptions
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const csvInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const syncVoices = () => {
      try {
        const list = sound.getEnglishVoices();
        setEnglishVoices(list);
        if (!selectedVoiceURI && list.length > 0) {
          const best = sound.getBestEnglishVoice();
          if (best) setSelectedVoiceURI(best.voiceURI);
        }
      } catch {
        // Ignore voice list errors
      }
    };
    syncVoices();
    try {
      if (
        typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        typeof window.speechSynthesis.addEventListener === 'function'
      ) {
        window.speechSynthesis.addEventListener('voiceschanged', syncVoices);
        return () => {
          try {
            window.speechSynthesis.removeEventListener('voiceschanged', syncVoices);
          } catch {
            // Ignore cleanup error
          }
        };
      }
    } catch {
      // Ignore if speechSynthesis event listener is unsupported
    }
  }, [selectedVoiceURI]);

  // Load selected item data into editor
  const handleSelectSlot = (slotIdx: number) => {
    setSelectedSlotIndex(slotIdx);
    const existing = currentRoom.items.find((i) => i.slotIndex === slotIdx);
    if (existing) {
      setItemName(existing.name);
      setItemWord(existing.word);
      setItemCategory(existing.category || 'General');
      setItemPrice(existing.price || 2);
      setItemHint(existing.hint || '');
      setItemScale(existing.scale || 1);
      setImageDataUrl(existing.customImageDataUrl || null);
      setImageUrlInput(
        existing.customImageDataUrl?.startsWith('http')
          ? existing.customImageDataUrl
          : ''
      );
    } else {
      setItemName('');
      setItemWord('');
      setItemCategory('General');
      setItemPrice(2);
      setItemHint('');
      setItemScale(1);
      setImageDataUrl(null);
      setImageUrlInput('');
    }
    setUrlStatusMsg(null);
    setRawImage(null);
  };

  // Handle image upload from file picker (with automatic border-flood-fill background removal)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { dataUrl, img, options, alreadyTransparent } =
        await autoRemoveBackgroundFromSource(file);
      setRawImage(img);
      setBgRemovalOptions(options);
      setImageDataUrl(dataUrl);
      setUrlStatusMsg(
        alreadyTransparent
          ? 'Transparent PNG detected & trimmed!'
          : 'Background automatically removed!'
      );

      // Auto-populate item name from filename if empty
      if (!itemName) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setItemName(cleanName);
        setItemWord(cleanName.toLowerCase().replace(/\s+/g, ''));
      }

      sound.playPop();
    } catch (err) {
      console.error('Failed to load image', err);
    }
    e.target.value = '';
  };

  // Load image from pasted URL (auto-uses /api/image-proxy if CORS blocks canvas read, then removes background)
  const handleLoadImageUrl = async () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    if (!/^https?:\/\/|^data:image\//i.test(trimmed)) {
      setUrlStatusMsg('Please enter a valid http(s):// image URL.');
      return;
    }

    setIsLoadingUrl(true);
    setUrlStatusMsg('Loading & removing background...');

    // Guess name/word from URL filename if currently blank
    const guessNameFromUrl = () => {
      if (itemName) return;
      try {
        const pathname = new URL(trimmed).pathname;
        const lastSeg = pathname.split('/').pop() || '';
        const clean = decodeURIComponent(lastSeg)
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]+/g, ' ')
          .trim();
        if (clean && clean.length <= 28 && !/^\d+$/.test(clean)) {
          setItemName(clean);
          if (!itemWord) {
            setItemWord(clean.toLowerCase().replace(/\s+/g, ''));
          }
        }
      } catch {
        // Ignore URL parse errors
      }
    };

    try {
      const { dataUrl, img, options, alreadyTransparent } =
        await autoRemoveBackgroundFromSource(trimmed);
      setRawImage(img);
      setBgRemovalOptions(options);
      setImageDataUrl(dataUrl);
      setUrlStatusMsg(
        alreadyTransparent
          ? 'Transparent image loaded & trimmed!'
          : 'Image loaded & background automatically removed!'
      );
      guessNameFromUrl();
      sound.playPop();
    } catch {
      // Final fallback if proxy & direct CORS both fail
      const plainImg = new Image();
      plainImg.referrerPolicy = 'no-referrer';
      plainImg.onload = () => {
        setRawImage(null);
        setImageDataUrl(trimmed);
        setUrlStatusMsg('Loaded directly via URL (could not read pixels to strip background).');
        guessNameFromUrl();
        sound.playPop();
        setIsLoadingUrl(false);
      };
      plainImg.onerror = () => {
        setUrlStatusMsg('Could not load image from this URL.');
        setIsLoadingUrl(false);
      };
      plainImg.src = trimmed;
      return;
    }

    setIsLoadingUrl(false);
  };

  // Re-run background removal when sliders change
  const handleUpdateRemoval = (updates: Partial<RemovalOptions>) => {
    const nextOpts = { ...bgRemovalOptions, ...updates };
    setBgRemovalOptions(nextOpts);
    if (rawImage) {
      const processed = removeBackground(rawImage, nextOpts, 512, false);
      setImageDataUrl(processed);
    }
  };

  // Save item changes to active room
  const handleSaveItem = () => {
    if (!itemWord.trim()) return;

    sound.playChime();
    const updatedRooms = rooms.map((rm) => {
      if (rm.id !== currentRoom.id) return rm;

      const cleanWord = itemWord.toLowerCase().trim();
      const cleanName = itemName.trim() || cleanWord;

      // Filter out existing item at this slot
      const otherItems = rm.items.filter(
        (i) => i.slotIndex !== selectedSlotIndex
      );

      const newItem: StoreItem = {
        id: currentItem ? currentItem.id : `custom-${Date.now()}`,
        name: cleanName,
        word: cleanWord,
        category: itemCategory,
        price: itemPrice,
        hint: itemHint,
        scale: itemScale,
        slotIndex: selectedSlotIndex,
        customImageDataUrl: imageDataUrl || undefined,
        iconSvg: !imageDataUrl && currentItem ? currentItem.iconSvg : undefined,
      };

      return {
        ...rm,
        items: [...otherItems, newItem].sort((a, b) => a.slotIndex - b.slotIndex),
      };
    });

    onSaveRooms(updatedRooms);
  };

  // Delete item from slot
  const handleDeleteItem = () => {
    sound.playPop();
    const updatedRooms = rooms.map((rm) => {
      if (rm.id !== currentRoom.id) return rm;
      return {
        ...rm,
        items: rm.items.filter((i) => i.slotIndex !== selectedSlotIndex),
      };
    });
    onSaveRooms(updatedRooms);
    handleSelectSlot(selectedSlotIndex);
  };

  // Create new custom room
  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;
    sound.playPop();
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: newRoomName.trim(),
      description: 'Custom teacher room',
      items: [],
    };
    const updated = [...rooms, newRoom];
    onSaveRooms(updated);
    onSelectRoom(newRoom.id);
    setNewRoomName('');
    setShowAddRoom(false);
  };

  // Delete a room
  const handleDeleteRoom = (roomId: string) => {
    if (rooms.length <= 1) return;
    sound.playPop();
    const filtered = rooms.filter((r) => r.id !== roomId);
    onSaveRooms(filtered);
    if (activeRoomId === roomId) {
      onSelectRoom(filtered[0].id);
    }
  };

  // Export all rooms as JSON file
  const handleExportJSON = () => {
    sound.playPop();
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(rooms, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `joyce_minimart_curriculum_${Date.now()}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import rooms from JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (r): r is Room =>
              Boolean(r) &&
              typeof r.id === 'string' &&
              typeof r.name === 'string' &&
              Array.isArray(r.items)
          );
          if (valid.length > 0) {
            onSaveRooms(valid);
            onSelectRoom(valid[0].id);
            sound.playChime();
          }
        }
      } catch (err) {
        console.error('Invalid JSON file', err);
      }
    };
    reader.readAsText(file);
  };

  // Bulk import items/units from CSV file and automatically remove backgrounds from image URLs
  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvText = String(event.target?.result || '');
        const result = importItemsFromCsv(csvText, rooms, currentRoom.id);

        // Save immediately so items appear, then auto-strip backgrounds on all imported image URLs
        onSaveRooms(result.roomsToSave);
        onSelectRoom(result.targetRoomId);
        sound.playChime();

        const itemsToCutout: { roomId: string; itemId: string; src: string }[] = [];
        for (const rm of result.roomsToSave) {
          for (const it of rm.items) {
            if (it.id.startsWith('csv-') && it.customImageDataUrl) {
              itemsToCutout.push({
                roomId: rm.id,
                itemId: it.id,
                src: it.customImageDataUrl,
              });
            }
          }
        }

        const warnText =
          result.warnings.length > 0
            ? ` (${result.warnings.length} skipped)`
            : '';

        if (itemsToCutout.length > 0) {
          setCsvNotice({
            type: 'success',
            text: `Imported ${result.importedCount} items${warnText}. Removing image backgrounds (0/${itemsToCutout.length})...`,
          });

          const processedMap = new Map<string, string>();
          let doneCount = 0;
          const batchSize = 4;

          for (let i = 0; i < itemsToCutout.length; i += batchSize) {
            const batch = itemsToCutout.slice(i, i + batchSize);
            await Promise.all(
              batch.map(async (entry) => {
                try {
                  const { dataUrl } = await autoRemoveBackgroundFromSource(entry.src);
                  if (dataUrl) {
                    processedMap.set(entry.itemId, dataUrl);
                  }
                } catch {
                  // Keep original URL if unreachable
                } finally {
                  doneCount++;
                }
              })
            );
            setCsvNotice({
              type: 'success',
              text: `Imported ${result.importedCount} items${warnText}. Removing image backgrounds (${doneCount}/${itemsToCutout.length})...`,
            });
          }

          if (processedMap.size > 0) {
            const cleanedRooms = result.roomsToSave.map((rm) => ({
              ...rm,
              items: rm.items.map((it) => {
                const cleanedUrl = processedMap.get(it.id);
                return cleanedUrl ? { ...it, customImageDataUrl: cleanedUrl } : it;
              }),
            }));
            onSaveRooms(cleanedRooms);
          }

          setCsvNotice({
            type: 'success',
            text: `Imported ${result.importedCount} items & removed backgrounds on ${processedMap.size}/${itemsToCutout.length} images${warnText}!`,
          });
        } else {
          setCsvNotice({
            type: 'success',
            text: `Imported ${result.importedCount} items from CSV${warnText}!`,
          });
        }
      } catch (err) {
        sound.playWrong();
        setCsvNotice({
          type: 'error',
          text: err instanceof Error ? err.message : 'Failed to parse CSV file.',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Download sample CSV template
  const handleDownloadSampleCsv = () => {
    sound.playPop();
    const csvContent = generateSampleCsv();
    const dataStr =
      'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'joyce_minimart_sample.csv');
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleVoiceChange = (uri: string) => {
    setSelectedVoiceURI(uri);
    sound.setPreferredVoiceURI(uri || null);
    sound.speakWord('apple');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl pink-game-frame p-4 sm:p-6 max-h-[92vh] flex flex-col">
        {/* Top Close Button */}
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
        <div className="flex items-center gap-3 pb-3 border-b border-pink-200/80">
          <div className="w-11 h-11 rounded-2xl bg-white/85 border border-pink-200 text-pink-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-rose-950 font-display">
              Room Manager & Shelf Customizer
            </h3>
            <p className="text-xs sm:text-sm text-rose-900/80">
              Customize shelf items, upload images with instant canvas background removal, or manage lesson units.
            </p>
          </div>
        </div>

        {/* Segmented Control Tabs */}
        <div className="flex items-center gap-2 my-3 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('rooms');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              activeTab === 'rooms'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lesson Units & Rooms
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('editor');
              handleSelectSlot(selectedSlotIndex);
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              activeTab === 'editor'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Shelf Item Customizer (Up to 20 Slots)
          </button>
        </div>

        {/* Tab 1: Rooms / Curriculum Units */}
        {activeTab === 'rooms' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Available Rooms / Units
              </h4>
              <button
                onClick={() => setShowAddRoom(true)}
                className="flex items-center gap-1 px-3 py-1 bg-pink-500 hover:bg-pink-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Unit</span>
              </button>
            </div>

            {/* Create Room Input Prompt */}
            {showAddRoom && (
              <div className="flex items-center gap-2 p-3 bg-pink-50 rounded-2xl border border-pink-200">
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g. Unit 4: Animals, Unit 5: Clothes..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white rounded-xl border border-pink-300 focus:outline-none"
                />
                <button
                  onClick={handleCreateRoom}
                  className="px-3 py-1.5 bg-pink-500 text-white text-xs font-bold rounded-xl hover:bg-pink-600"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowAddRoom(false)}
                  className="px-2 py-1.5 text-slate-500 text-xs hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Room List */}
            <div className="space-y-2">
              {rooms.map((rm) => {
                const isActive = rm.id === activeRoomId;
                return (
                  <div
                    key={rm.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-amber-50/80 border-amber-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-amber-200'
                    }`}
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        sound.playPop();
                        onSelectRoom(rm.id);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800">
                          {rm.name}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {rm.items.length} items on shelves · {rm.description || 'Custom Unit'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          sound.playPop();
                          onSelectRoom(rm.id);
                          setActiveTab('editor');
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                      >
                        Edit Items
                      </button>
                      {rooms.length > 1 && (
                        <button
                          onClick={() => handleDeleteRoom(rm.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50"
                          title="Delete Room"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Voice Pronunciation Selector */}
            <div className="p-3 bg-sky-50/70 rounded-2xl border border-sky-200 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-sky-600" />
                  <span>British English Accent (en-GB)</span>
                </span>
                <button
                  type="button"
                  onClick={() => sound.speakWord('Tomato')}
                  className="px-2.5 py-1 bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-bold rounded-lg shadow-2xs active:scale-95 transition-all"
                >
                  Test Voice
                </button>
              </div>
              {englishVoices.length > 0 ? (
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => handleVoiceChange(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-sky-300 text-slate-800 font-medium focus:outline-none"
                >
                  <option value="">Auto (Best British English / en-GB)</option>
                  {englishVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-[11px] text-slate-500">
                  Using browser British English (en-GB) speech engine.
                </p>
              )}
            </div>

            {/* Bulk CSV Notice */}
            {csvNotice && (
              <div
                className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                  csvNotice.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {csvNotice.text}
              </div>
            )}

            {/* Backup, Bulk CSV & Teacher Curriculum Export/Import Section */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold rounded-xl transition-all cursor-pointer">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Bulk Import CSV</span>
                  <input
                    ref={csvInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleImportCsv}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 transition-all"
                  title="Download sample CSV template (name, word, price, category, hint, image_url, slot, unit)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV Sample</span>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                  title="Export rooms to JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>

                <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import JSON</span>
                  <input
                    ref={importInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>

              {confirmReset ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setConfirmReset(false);
                      onResetDefaults();
                    }}
                    className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg shadow-2xs"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setConfirmReset(false);
                    }}
                    className="px-2 py-1 text-xs text-slate-600 hover:text-slate-800 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setConfirmReset(true);
                  }}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Defaults</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Shelf Item Customizer & Background Remover */}
        {activeTab === 'editor' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {/* Slot Selector Grid (20 slots) */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Shelf Slot (1 - 20) in &ldquo;{currentRoom.name}&rdquo;
                </h4>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[11px] font-bold rounded-lg cursor-pointer transition-colors">
                    <FileSpreadsheet className="w-3 h-3" />
                    <span>Import CSV</span>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleImportCsv}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Active Slot: #{selectedSlotIndex + 1}
                  </span>
                </div>
              </div>
              {csvNotice && (
                <div
                  className={`mb-2 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                    csvNotice.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {csvNotice.text}
                </div>
              )}
              <div className="grid grid-cols-10 gap-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                {Array.from({ length: 20 }).map((_, idx) => {
                  const itemInSlot = currentRoom.items.find(
                    (i) => i.slotIndex === idx
                  );
                  const isSelected = selectedSlotIndex === idx;
                  return (
                    <button
                      key={`slot-${idx}`}
                      onClick={() => handleSelectSlot(idx)}
                      className={`h-9 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-white shadow-sm scale-105'
                          : itemInSlot
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-300'
                      }`}
                      title={
                        itemInSlot
                          ? `Slot ${idx + 1}: ${itemInSlot.name}`
                          : `Empty Slot ${idx + 1}`
                      }
                    >
                      <span>{idx + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Split Editor: Image Upload & Canvas Removal on Left, Fields on Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-amber-50/50 p-4 rounded-3xl border border-amber-200">
              {/* Left Column: Image & Background Removal */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-pink-600" />
                    <span>Item Image & Background Removal</span>
                  </h5>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 px-2.5 py-1 bg-pink-100 hover:bg-pink-200 text-pink-800 rounded-xl text-xs font-bold transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Add Image by URL */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleLoadImageUrl();
                        }}
                        placeholder="Paste image URL (https://...)"
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white rounded-xl border border-amber-300 focus:border-pink-400 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleLoadImageUrl}
                      disabled={isLoadingUrl || !imageUrlInput.trim()}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-2xs transition-all shrink-0"
                    >
                      {isLoadingUrl ? '...' : 'Load URL'}
                    </button>
                  </div>
                  {urlStatusMsg && (
                    <p className="text-[10px] font-medium text-slate-600 px-1">
                      {urlStatusMsg}
                    </p>
                  )}
                </div>

                {/* Live Preview on Checkerboard (Shows transparent background) */}
                <div className="relative w-full h-44 rounded-2xl bg-checkerboard flex items-center justify-center border-2 border-dashed border-amber-300 overflow-hidden shadow-inner">
                  {imageDataUrl ? (
                    <img
                      src={imageDataUrl}
                      alt="Processed cutout"
                      referrerPolicy="no-referrer"
                      className="max-h-36 max-w-36 object-contain"
                      style={{ transform: `scale(${itemScale})` }}
                    />
                  ) : currentItem?.iconSvg ? (
                    <div
                      className="w-32 h-32 flex items-center justify-center"
                      style={{ transform: `scale(${itemScale})` }}
                      dangerouslySetInnerHTML={{ __html: currentItem.iconSvg }}
                    />
                  ) : (
                    <div className="text-center text-slate-400 p-4">
                      <span className="text-3xl">🖼️</span>
                      <p className="text-xs font-medium mt-1">No image yet</p>
                      <p className="text-[10px]">
                        Upload PNG/JPG to remove solid/white background
                      </p>
                    </div>
                  )}

                  {imageDataUrl && (
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      Cutout Ready
                    </div>
                  )}
                </div>

                {/* Background Removal Controls (When an image is loaded) */}
                {rawImage && (
                  <div className="bg-white p-3 rounded-2xl border border-pink-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2 pb-1">
                      <span className="font-bold text-slate-700">Removal Mode</span>
                      <div className="flex items-center gap-1 bg-pink-50 p-0.5 rounded-lg border border-pink-200">
                        <button
                          type="button"
                          onClick={() => handleUpdateRemoval({ mode: 'white' })}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                            bgRemovalOptions.mode === 'white'
                              ? 'bg-pink-500 text-white'
                              : 'text-pink-800 hover:bg-pink-100'
                          }`}
                        >
                          White / Light
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateRemoval({ mode: 'color' })}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                            bgRemovalOptions.mode === 'color'
                              ? 'bg-pink-500 text-white'
                              : 'text-pink-800 hover:bg-pink-100'
                          }`}
                        >
                          Backdrop Color
                        </button>
                      </div>
                    </div>

                    {bgRemovalOptions.mode === 'white' ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700">
                            White Removal Threshold
                          </span>
                          <span className="font-mono text-pink-700 font-bold">
                            {bgRemovalOptions.whiteThreshold}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="165"
                          max="252"
                          value={bgRemovalOptions.whiteThreshold}
                          onChange={(e) =>
                            handleUpdateRemoval({
                              whiteThreshold: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700">
                            Color Match Tolerance
                          </span>
                          <span className="font-mono text-pink-700 font-bold">
                            {bgRemovalOptions.tolerance}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="85"
                          value={bgRemovalOptions.tolerance}
                          onChange={(e) =>
                            handleUpdateRemoval({
                              tolerance: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                      </>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-bold text-slate-700">
                        Edge Smoothing / Feather
                      </span>
                      <span className="font-mono text-pink-700 font-bold">
                        {bgRemovalOptions.feather}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      value={bgRemovalOptions.feather}
                      onChange={(e) =>
                        handleUpdateRemoval({
                          feather: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>
                )}

                {/* Scale Slider */}
                <div className="bg-white p-2.5 rounded-2xl border border-amber-200">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Display Scale</span>
                    <span className="font-mono text-amber-800 font-bold">
                      {Math.round(itemScale * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={itemScale}
                    onChange={(e) => setItemScale(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </div>

              {/* Right Column: Name, Spelling Target, Price & Hint */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-700">
                  Spelling & Store Details
                </h5>

                {/* Item Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Red Apple"
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-amber-300 focus:outline-none"
                  />
                </div>

                {/* Target Spelling Word */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center justify-between">
                    <span>Target Word for Spelling</span>
                    <span className="text-[10px] text-pink-600">Case-insensitive</span>
                  </label>
                  <input
                    type="text"
                    value={itemWord}
                    onChange={(e) => setItemWord(e.target.value)}
                    placeholder="e.g. apple"
                    className="w-full px-3 py-1.5 text-xs font-bold bg-white rounded-xl border-2 border-amber-400 focus:outline-none text-amber-900 uppercase"
                  />
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={itemCategory}
                      onChange={(e) => setItemCategory(e.target.value)}
                      placeholder="e.g. Fruits"
                      className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-amber-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-amber-300 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Hint */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Clue / Educational Hint
                  </label>
                  <input
                    type="text"
                    value={itemHint}
                    onChange={(e) => setItemHint(e.target.value)}
                    placeholder="e.g. Sweet and crunchy red fruit"
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-amber-300 focus:outline-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex items-center gap-2">
                  <button
                    onClick={handleSaveItem}
                    disabled={!itemWord.trim()}
                    className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save to Slot {selectedSlotIndex + 1}</span>
                  </button>

                  {currentItem && (
                    <button
                      onClick={handleDeleteItem}
                      className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors"
                      title="Clear slot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
