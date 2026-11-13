import { Room, StoreItem } from '../types/game';

export interface ParsedCsvResult {
  roomsToSave: Room[];
  importedCount: number;
  targetRoomId: string;
  warnings: string[];
}

/**
 * Parses raw CSV text into a 2D array of trimmed cell strings.
 * Supports quoted fields, escaped quotes (""), BOM, CRLF/LF, and comma or semicolon delimiters.
 */
export function parseCsvRows(csvText: string): string[][] {
  const cleaned = csvText.replace(/^\uFEFF/, '').trim();
  if (!cleaned) return [];

  // Detect delimiter from first line (comma vs semicolon)
  const firstLineEnd = cleaned.search(/\r?\n/);
  const firstLine = firstLineEnd >= 0 ? cleaned.slice(0, firstLineEnd) : cleaned;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const delimiter = semiCount > commaCount ? ';' : ',';

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    const next = cleaned[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        currentField += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        currentField += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (ch === '\r' && next === '\n') {
        currentRow.push(currentField.trim());
        if (currentRow.some((cell) => cell !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
        i++;
      } else if (ch === '\n' || ch === '\r') {
        currentRow.push(currentField.trim());
        if (currentRow.some((cell) => cell !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += ch;
      }
    }
  }

  currentRow.push(currentField.trim());
  if (currentRow.some((cell) => cell !== '')) {
    rows.push(currentRow);
  }

  return rows;
}

function normalizeHeader(h: string): string {
  return h
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, '');
}

/**
 * Generates a downloadable sample CSV template for teachers
 */
export function generateSampleCsv(): string {
  const header = 'name,word,price,category,hint,image_url,slot,unit';
  const rows = [
    'Apple,apple,2,Fruits,Sweet crunchy red fruit,,1,',
    'Banana,banana,1,Fruits,Long yellow curved fruit,,2,',
    'Milk,milk,3,Dairy,White drink from cows,,3,',
    'Bread,bread,2,Bakery,Soft baked loaf,,4,',
  ];
  return [header, ...rows].join('\n');
}

/**
 * Converts parsed CSV content into Room/StoreItem updates.
 * - If a `unit` / `room` column is provided, matches existing rooms by name or creates new rooms.
 * - Otherwise, imports items into the currently active room.
 */
export function importItemsFromCsv(
  csvText: string,
  existingRooms: Room[],
  activeRoomId: string
): ParsedCsvResult {
  const rows = parseCsvRows(csvText);
  if (rows.length < 2) {
    throw new Error('CSV file needs a header row and at least one item row.');
  }

  const headers = rows[0].map(normalizeHeader);
  const findCol = (aliases: string[]) =>
    headers.findIndex((h) => aliases.includes(h));

  const nameIdx = findCol(['name', 'displayname', 'item', 'itemname', 'title']);
  const wordIdx = findCol(['word', 'spelling', 'target', 'targetword', 'english']);
  const priceIdx = findCol(['price', 'cost', 'dollar']);
  const categoryIdx = findCol(['category', 'type', 'group']);
  const hintIdx = findCol(['hint', 'clue', 'description']);
  const imageIdx = findCol(['image', 'imageurl', 'url', 'img', 'photo', 'picture']);
  const slotIdx = findCol(['slot', 'slotindex', 'position', 'pos']);
  const unitIdx = findCol(['unit', 'room', 'unitname', 'roomname']);
  const scaleIdx = findCol(['scale', 'size']);

  if (nameIdx === -1 && wordIdx === -1) {
    throw new Error(
      'CSV must include a "name" or "word" column header (e.g. name,word,price,category,hint,image_url,slot).'
    );
  }

  const nextRooms: Room[] = existingRooms.map((r) => ({
    ...r,
    items: [...r.items],
  }));

  const warnings: string[] = [];
  let importedCount = 0;
  let lastTargetRoomId = activeRoomId;
  const autoSlotCursor = new Map<string, number>();

  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const rawName = nameIdx >= 0 ? (cells[nameIdx] || '').trim() : '';
    const rawWord = wordIdx >= 0 ? (cells[wordIdx] || '').trim() : '';

    const cleanWord = (rawWord || rawName).toLowerCase().trim();
    const cleanName = (rawName || rawWord).trim();

    if (!cleanWord) {
      warnings.push(`Row ${r + 1}: skipped (missing name/word).`);
      continue;
    }

    // Determine target room
    let targetRoom: Room | undefined;
    const rawUnit = unitIdx >= 0 ? (cells[unitIdx] || '').trim() : '';
    if (rawUnit) {
      targetRoom = nextRooms.find(
        (rm) => rm.name.toLowerCase() === rawUnit.toLowerCase()
      );
      if (!targetRoom) {
        targetRoom = {
          id: `room-csv-${Date.now()}-${r}`,
          name: rawUnit,
          description: 'Imported from CSV',
          items: [],
        };
        nextRooms.push(targetRoom);
      }
    } else {
      targetRoom =
        nextRooms.find((rm) => rm.id === activeRoomId) || nextRooms[0];
    }

    if (!targetRoom) continue;
    lastTargetRoomId = targetRoom.id;

    // Determine slotIndex (CSV accepts 1..20; if missing, auto-fill sequentially 0..19)
    let slotIndex = -1;
    const rawSlot = slotIdx >= 0 ? (cells[slotIdx] || '').trim() : '';
    if (rawSlot !== '') {
      const parsedSlot = parseInt(rawSlot, 10);
      if (!Number.isNaN(parsedSlot) && parsedSlot >= 1 && parsedSlot <= 20) {
        slotIndex = parsedSlot - 1;
      }
    }

    if (slotIndex === -1) {
      const cursor = autoSlotCursor.get(targetRoom.id) ?? 0;
      if (cursor >= 20) {
        warnings.push(
          `Row ${r + 1} ("${cleanName}"): skipped (room "${targetRoom.name}" already filled 20 slots).`
        );
        continue;
      }
      slotIndex = cursor;
      autoSlotCursor.set(targetRoom.id, cursor + 1);
    } else {
      autoSlotCursor.set(
        targetRoom.id,
        Math.max(autoSlotCursor.get(targetRoom.id) ?? 0, slotIndex + 1)
      );
    }

    const rawPrice = priceIdx >= 0 ? parseInt(cells[priceIdx] || '', 10) : NaN;
    const price = !Number.isNaN(rawPrice) ? Math.max(1, Math.min(99, rawPrice)) : 2;
    const category =
      categoryIdx >= 0 && cells[categoryIdx] ? cells[categoryIdx].trim() : 'General';
    const hint = hintIdx >= 0 && cells[hintIdx] ? cells[hintIdx].trim() : '';
    const imageUrl =
      imageIdx >= 0 && cells[imageIdx] ? cells[imageIdx].trim() : '';
    const rawScale =
      scaleIdx >= 0 ? parseFloat(cells[scaleIdx] || '') : NaN;
    const scale =
      !Number.isNaN(rawScale) && rawScale >= 0.5 && rawScale <= 1.5
        ? rawScale
        : 1;

    // Replace existing item in the same slot if any, keeping fallback iconSvg if no new imageUrl
    const prevAtSlot = targetRoom.items.find((i) => i.slotIndex === slotIndex);
    const filtered = targetRoom.items.filter((i) => i.slotIndex !== slotIndex);

    const newItem: StoreItem = {
      id: `csv-${Date.now()}-${r}-${slotIndex}`,
      name: cleanName,
      word: cleanWord,
      category,
      price,
      hint,
      scale,
      slotIndex,
      customImageDataUrl: imageUrl || prevAtSlot?.customImageDataUrl,
      iconSvg: !imageUrl ? prevAtSlot?.iconSvg : undefined,
    };

    targetRoom.items = [...filtered, newItem].sort(
      (a, b) => a.slotIndex - b.slotIndex
    );
    importedCount++;
  }

  return {
    roomsToSave: nextRooms,
    importedCount,
    targetRoomId: lastTargetRoomId,
    warnings,
  };
}
