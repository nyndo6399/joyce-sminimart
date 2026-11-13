import React, { useState } from 'react';
import { MomMission } from '../types/game';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  Heart,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface SmartphoneUIProps {
  mission: MomMission | null;
  onAcceptMission: () => void;
  onDeclineMission: () => void;
  onCompleteMission: () => void;
  onNewMission: () => void;
  onPlayMomVoice: (text: string) => void;
  hasUnlockedAnyItems: boolean;
}

const MOM_INTRO_TEXT =
  'Hey sweetie, can you go to the supermarket and get a few things for me?';
const MOM_COMPLETE_TEXT = "Thank you, sweetie! You're the best!";

export const SmartphoneUI: React.FC<SmartphoneUIProps> = ({
  mission,
  onAcceptMission,
  onDeclineMission,
  onCompleteMission,
  onNewMission,
  onPlayMomVoice,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [speakingItemId, setSpeakingItemId] = useState<string | null>(null);

  // Check if all mission requirements are fulfilled
  const isMissionCompleted =
    mission &&
    mission.active &&
    mission.requirements.every((r) => r.collectedQty >= r.requiredQty);

  const handlePlayMomAudio = (text: string) => {
    sound.playPop();
    setSpeakingItemId(null);
    onPlayMomVoice(text);
  };

  const handlePlayItemAudio = (itemId: string, word: string) => {
    setSpeakingItemId(itemId);
    sound.speakWord(word, () => setSpeakingItemId(null));
  };

  const handleDoneClick = () => {
    sound.playFanfare();
    onCompleteMission();
  };

  const handleAccept = () => {
    sound.playPhoneRing();
    setIsDismissed(false);
    onAcceptMission();
  };

  const handleDecline = () => {
    sound.playPop();
    setIsDismissed(true);
    onDeclineMission();
  };

  return (
    <div className="relative mx-auto w-full max-w-[540px] lg:scale-[1.05] origin-top mb-4 select-none">
      {/* Transparent-background Kawaii Smartphone Artwork */}
      <img
        src="/assets/kawaii_phone.png"
        alt="Kawaii Smartphone"
        className="w-full h-auto block pointer-events-none drop-shadow-lg"
      />

      {/* Interactive Chat Overlay fitted cleanly inside the white screen region */}
      <div
        className="absolute flex flex-col justify-between overflow-hidden rounded-lg px-2.5 py-2"
        style={{
          top: '12.2%',
          bottom: '21.5%',
          left: '22.3%',
          right: '29.3%',
        }}
      >
        {/* Messaging Chat Header */}
        <div className="flex items-center gap-2 pb-1.5 border-b border-pink-100 shrink-0 bg-white/85 backdrop-blur-[2px] rounded-t-md">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-rose-300 flex items-center justify-center text-white text-sm shadow-xs">
              👩
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h4 className="text-sm font-bold text-slate-800 leading-none">Mom</h4>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate leading-tight">
              Online · Mini Mart
            </p>
          </div>
        </div>

        {/* Message Thread Body */}
        <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin text-xs sm:text-[13px] py-2 pr-0.5">
          {/* Mom's Initial Voice Message Bubble (No text shown; tap audio button to hear Mom & see words appear) */}
          <div className="flex items-start max-w-[98%]">
            <div
              onClick={() => handlePlayMomAudio(MOM_INTRO_TEXT)}
              className="group w-full flex items-center justify-between gap-2.5 bg-pink-50/95 hover:bg-pink-100/80 rounded-xl rounded-tl-xs px-2.5 py-2 shadow-xs border border-pink-200 text-slate-800 cursor-pointer transition-colors"
              title="Tap to hear Mom's message"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayMomAudio(MOM_INTRO_TEXT);
                }}
                className="w-9 h-9 rounded-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center shadow-xs shrink-0 active:scale-95 transition-transform"
                title="Listen to Mom's message"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              {/* Cute Voice Waveform Bars */}
              <div className="flex-1 flex items-center gap-0.5 h-5 px-1">
                {[35, 70, 50, 90, 65, 85, 45, 75, 55, 40, 65, 35].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-full bg-pink-300 group-hover:bg-pink-400 transition-colors"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* User Response Options */}
          {!mission && !isDismissed && (
            <div className="pt-1 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleDecline}
                  className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-semibold rounded-xl transition-all border border-slate-200 whitespace-nowrap"
                >
                  Sorry, Mom
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 py-1.5 px-2 bg-pink-500 hover:bg-pink-600 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Yes, Mom!</span>
                </button>
              </div>
            </div>
          )}

          {isDismissed && !mission && (
            <div className="flex items-center justify-center flex-col gap-2 py-2.5 text-center">
              <p className="text-xs text-slate-600 leading-snug">
                You declined Mom&apos;s request for now.
              </p>
              <button
                onClick={handleAccept}
                className="py-1.5 px-3 bg-pink-500 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-pink-600 active:scale-95 transition-all"
              >
                Help Mom Now
              </button>
            </div>
          )}

          {/* Active Mission Shopping List */}
          {mission && !mission.completed && (
            <div className="space-y-2">
              <div className="bg-pink-100/80 rounded-xl p-2 border border-pink-200 text-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-[11px] text-pink-950 uppercase tracking-wide">
                    Shopping List
                  </span>
                  <span className="text-[11px] font-bold text-pink-800">
                    {mission.requirements.filter((r) => r.collectedQty >= r.requiredQty).length}/
                    {mission.requirements.length}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {mission.requirements.map((req) => {
                    const isDone = req.collectedQty >= req.requiredQty;
                    const isWordSpeaking = speakingItemId === req.itemId;
                    return (
                      <div
                        key={req.itemId}
                        onClick={() => handlePlayItemAudio(req.itemId, req.itemName)}
                        className={`flex items-center justify-between px-2 py-1.5 rounded-xl transition-colors cursor-pointer ${
                          isDone
                            ? 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200'
                            : 'bg-white/90 hover:bg-pink-50 text-slate-800 border border-pink-100'
                        }`}
                        title={`Tap to hear "${req.itemName}"`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                          )}
                          <span
                            className={`font-bold capitalize text-xs sm:text-[13px] truncate ${
                              isDone ? 'line-through text-slate-500' : ''
                            }`}
                          >
                            {req.itemName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayItemAudio(req.itemId, req.itemName);
                            }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                              isWordSpeaking
                                ? 'bg-pink-500 text-white animate-pulse'
                                : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                            }`}
                            title={`Listen: ${req.itemName}`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <span
                            className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                              isDone
                                ? 'bg-emerald-200/70 text-emerald-800'
                                : 'bg-pink-200/60 text-pink-900'
                            }`}
                          >
                            {req.collectedQty}/{req.requiredQty}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Glowing Done Button when all items are gathered */}
              {isMissionCompleted && (
                <button
                  onClick={handleDoneClick}
                  className="w-full py-2 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-[13px] rounded-xl shadow-md shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-1.5 animate-bounce"
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Done! Bring to Mom ✨</span>
                </button>
              )}
            </div>
          )}

          {/* Mission Completed Celebration View with Audio */}
          {mission && mission.completed && (
            <div className="space-y-2 text-center py-1">
              <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-lg shadow-xs border border-amber-300">
                ⭐
              </div>
              <div
                onClick={() => handlePlayMomAudio(MOM_COMPLETE_TEXT)}
                className="relative bg-pink-50/90 hover:bg-pink-100/80 rounded-xl p-2 shadow-xs border border-pink-200 text-slate-800 text-left cursor-pointer"
                title="Tap to hear Mom's praise"
              >
                <p className="font-bold text-pink-700 text-[11px]">Mom:</p>
                <p className="mt-0.5 text-xs sm:text-[13px] leading-snug pr-6">
                  &ldquo;{MOM_COMPLETE_TEXT} 💖&rdquo;
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayMomAudio(MOM_COMPLETE_TEXT);
                  }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-pink-200 text-pink-800 hover:bg-pink-300 flex items-center justify-center"
                  title="Replay audio"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={() => {
                  sound.playPop();
                  onNewMission();
                }}
                className="w-full py-2 px-3 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs sm:text-[13px] rounded-xl shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>New Mission</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
