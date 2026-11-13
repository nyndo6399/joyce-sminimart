export interface StoreItem {
  id: string;
  name: string;
  word: string; // Spelling target in lowercase, e.g. "apple"
  category: string;
  iconSvg?: string; // Built-in SVG string
  customImageDataUrl?: string; // User-uploaded and background-removed image
  scale?: number;
  slotIndex: number; // 0 to 19
  price: number;
  hint?: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  items: StoreItem[];
}

export interface MissionItem {
  itemId: string;
  itemName: string;
  word: string;
  requiredQty: number;
  collectedQty: number;
  iconSvg?: string;
  customImageDataUrl?: string;
}

export interface MomMission {
  id: string;
  active: boolean;
  completed: boolean;
  requirements: MissionItem[];
  createdAt: number;
}
