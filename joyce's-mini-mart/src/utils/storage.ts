import { Room } from '../types/game';
import { DEFAULT_ROOMS } from '../data/defaultRooms';

const STORAGE_KEY_ROOMS = 'joyce_minimart_rooms_v1';
const STORAGE_KEY_ACTIVE_ROOM = 'joyce_minimart_active_room_v1';
const STORAGE_KEY_UNLOCKED = 'joyce_minimart_unlocked_items_v1';

export function loadSavedRooms(): Room[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ROOMS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const valid = parsed.filter(
          (r): r is Room =>
            Boolean(r) &&
            typeof r.id === 'string' &&
            typeof r.name === 'string' &&
            Array.isArray(r.items)
        );
        if (valid.length > 0) {
          return valid;
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load rooms from localStorage, using defaults', e);
  }
  return DEFAULT_ROOMS;
}

export function saveRooms(rooms: Room[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
  } catch (e) {
    console.warn('Failed to save rooms to localStorage', e);
  }
}

export function loadActiveRoomId(rooms: Room[]): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_ROOM);
    if (saved && rooms.some((r) => r.id === saved)) {
      return saved;
    }
  } catch {
    // fallback
  }
  return rooms[0]?.id || DEFAULT_ROOMS[0].id;
}

export function saveActiveRoomId(roomId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ROOM, roomId);
  } catch {
    // ignore
  }
}

export function loadUnlockedItems(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_UNLOCKED);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((id): id is string => typeof id === 'string');
      }
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveUnlockedItems(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_UNLOCKED, JSON.stringify(ids));
  } catch {
    // ignore
  }
}
