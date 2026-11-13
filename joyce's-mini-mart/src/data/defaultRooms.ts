import { Room, StoreItem } from '../types/game';

// Cute Kawaii SVGs crafted with rounded geometry, soft pastel gradients, cute eye dots & blush!
export const ITEM_SVGS: Record<string, string> = {
  apple: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 18 C52 10, 60 8, 64 6 C62 14, 56 18, 50 18 Z" fill="#4ADE80" stroke="#16A34A" stroke-width="2"/>
    <path d="M50 22 C48 14, 45 10, 42 6" stroke="#854D0E" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 25 C34 18, 14 30, 16 58 C18 82, 36 94, 48 94 C50 94, 50 91, 52 91 C54 91, 54 94, 56 94 C68 94, 84 82, 86 58 C88 30, 68 18, 50 25 Z" fill="#EF4444" stroke="#DC2626" stroke-width="3"/>
    <circle cx="36" cy="48" r="4.5" fill="#1F2937"/>
    <circle cx="64" cy="48" r="4.5" fill="#1F2937"/>
    <circle cx="38" cy="46" r="1.5" fill="#FFFFFF"/>
    <circle cx="66" cy="46" r="1.5" fill="#FFFFFF"/>
    <ellipse cx="28" cy="56" rx="5" ry="3" fill="#F87171" opacity="0.6"/>
    <ellipse cx="72" cy="56" rx="5" ry="3" fill="#F87171" opacity="0.6"/>
    <path d="M44 56 Q50 62 56 56" stroke="#1F2937" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="30" cy="34" rx="6" ry="12" fill="#FFFFFF" opacity="0.35" transform="rotate(-25 30 34)"/>
  </svg>`,

  banana: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M78 18 C78 18, 55 12, 34 26 C15 40, 14 68, 28 85 C42 102, 68 92, 80 72 C92 52, 84 26, 78 18 Z" fill="#FACC15" stroke="#EAB308" stroke-width="3"/>
    <path d="M78 18 L84 14" stroke="#65A30D" stroke-width="4" stroke-linecap="round"/>
    <path d="M22 88 L18 92" stroke="#854D0E" stroke-width="4" stroke-linecap="round"/>
    <circle cx="48" cy="46" r="4" fill="#1F2937"/>
    <circle cx="68" cy="50" r="4" fill="#1F2937"/>
    <circle cx="49" cy="45" r="1.5" fill="#FFFFFF"/>
    <circle cx="69" cy="49" r="1.5" fill="#FFFFFF"/>
    <ellipse cx="42" cy="53" rx="4" ry="2.5" fill="#F43F5E" opacity="0.5"/>
    <ellipse cx="74" cy="57" rx="4" ry="2.5" fill="#F43F5E" opacity="0.5"/>
    <path d="M54 55 Q60 60 64 56" stroke="#1F2937" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  orange: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="56" r="38" fill="#FB923C" stroke="#EA580C" stroke-width="3"/>
    <path d="M50 18 C52 10, 62 8, 66 6 C64 14, 58 18, 50 18 Z" fill="#22C55E" stroke="#16A34A" stroke-width="2"/>
    <circle cx="50" cy="18" r="3" fill="#854D0E"/>
    <circle cx="36" cy="52" r="4" fill="#1F2937"/>
    <circle cx="64" cy="52" r="4" fill="#1F2937"/>
    <circle cx="38" cy="50" r="1.5" fill="#FFFFFF"/>
    <circle cx="66" cy="50" r="1.5" fill="#FFFFFF"/>
    <ellipse cx="28" cy="60" rx="5" ry="3" fill="#F97316" opacity="0.6"/>
    <ellipse cx="72" cy="60" rx="5" ry="3" fill="#F97316" opacity="0.6"/>
    <path d="M44 60 Q50 66 56 60" stroke="#1F2937" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="32" cy="38" rx="6" ry="10" fill="#FFFFFF" opacity="0.35" transform="rotate(-30 32 38)"/>
  </svg>`,

  strawberry: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 24 C24 24, 18 45, 26 70 C34 94, 50 96, 50 96 C50 96, 66 94, 74 70 C82 45, 76 24, 50 24 Z" fill="#F43F5E" stroke="#E11D48" stroke-width="3"/>
    <path d="M50 10 L50 20 M35 16 Q45 22 50 24 Q55 22 65 16 M26 24 Q38 28 50 25 Q62 28 74 24" stroke="#22C55E" stroke-width="4" stroke-linecap="round" fill="none"/>
    <circle cx="38" cy="50" r="4" fill="#1F2937"/>
    <circle cx="62" cy="50" r="4" fill="#1F2937"/>
    <circle cx="39" cy="48" r="1.5" fill="#FFFFFF"/>
    <circle cx="63" cy="48" r="1.5" fill="#FFFFFF"/>
    <ellipse cx="30" cy="58" rx="4" ry="2.5" fill="#FDA4AF"/>
    <ellipse cx="70" cy="58" rx="4" ry="2.5" fill="#FDA4AF"/>
    <path d="M46 58 Q50 63 54 58" stroke="#1F2937" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="35" cy="74" r="1.5" fill="#FDE047"/>
    <circle cx="65" cy="74" r="1.5" fill="#FDE047"/>
    <circle cx="50" cy="80" r="1.5" fill="#FDE047"/>
    <circle cx="50" cy="40" r="1.5" fill="#FDE047"/>
  </svg>`,

  watermelon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 45 C12 78, 38 92, 50 92 C62 92, 88 78, 88 45 Z" fill="#16A34A" stroke="#15803D" stroke-width="3"/>
    <path d="M16 45 C16 75, 40 88, 50 88 C60 88, 84 75, 84 45 Z" fill="#DCFCE7"/>
    <path d="M20 45 C20 72, 42 84, 50 84 C58 84, 80 72, 80 45 Z" fill="#F43F5E"/>
    <circle cx="40" cy="54" r="3.5" fill="#1F2937"/>
    <circle cx="60" cy="54" r="3.5" fill="#1F2937"/>
    <circle cx="41" cy="53" r="1.2" fill="#FFFFFF"/>
    <circle cx="61" cy="53" r="1.2" fill="#FFFFFF"/>
    <path d="M47 62 Q50 66 53 62" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
    <circle cx="32" cy="52" r="1.5" fill="#1F2937"/>
    <circle cx="68" cy="52" r="1.5" fill="#1F2937"/>
    <circle cx="50" cy="70" r="1.5" fill="#1F2937"/>
    <circle cx="36" cy="68" r="1.5" fill="#1F2937"/>
    <circle cx="64" cy="68" r="1.5" fill="#1F2937"/>
  </svg>`,

  carrot: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 20 C42 8, 36 6, 32 4 M50 20 C50 6, 52 4, 54 2 M50 20 C58 8, 64 6, 68 4" stroke="#22C55E" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 22 C64 22, 70 30, 66 45 C60 66, 52 92, 50 96 C48 92, 40 66, 34 45 C30 30, 36 22, 50 22 Z" fill="#F97316" stroke="#EA580C" stroke-width="3"/>
    <circle cx="44" cy="42" r="3.5" fill="#1F2937"/>
    <circle cx="58" cy="42" r="3.5" fill="#1F2937"/>
    <circle cx="45" cy="41" r="1.2" fill="#FFFFFF"/>
    <circle cx="59" cy="41" r="1.2" fill="#FFFFFF"/>
    <ellipse cx="38" cy="48" rx="3.5" ry="2" fill="#FB923C"/>
    <ellipse cx="64" cy="48" rx="3.5" ry="2" fill="#FB923C"/>
    <path d="M48 50 Q51 54 54 50" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
    <path d="M38 60 Q44 61 48 60 M54 70 Q60 71 64 70" stroke="#EA580C" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  grapes: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 22 C50 14, 52 8, 56 6" stroke="#854D0E" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 22 C56 16, 66 18, 70 20 C64 26, 58 24, 50 22 Z" fill="#22C55E"/>
    <g fill="#A855F7" stroke="#7E22CE" stroke-width="2.5">
      <circle cx="36" cy="34" r="12"/>
      <circle cx="64" cy="34" r="12"/>
      <circle cx="50" cy="30" r="12"/>
      <circle cx="30" cy="52" r="12"/>
      <circle cx="50" cy="48" r="12"/>
      <circle cx="70" cy="52" r="12"/>
      <circle cx="40" cy="68" r="11"/>
      <circle cx="60" cy="68" r="11"/>
      <circle cx="50" cy="84" r="10"/>
    </g>
    <circle cx="44" cy="46" r="3.5" fill="#1F2937"/>
    <circle cx="56" cy="46" r="3.5" fill="#1F2937"/>
    <circle cx="45" cy="45" r="1.2" fill="#FFFFFF"/>
    <circle cx="57" cy="45" r="1.2" fill="#FFFFFF"/>
    <path d="M47 52 Q50 56 53 52" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  broccoli: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M42 58 L40 90 C40 94, 60 94, 60 90 L58 58" fill="#86EFAC" stroke="#22C55E" stroke-width="3"/>
    <g fill="#22C55E" stroke="#15803D" stroke-width="3">
      <circle cx="30" cy="44" r="18"/>
      <circle cx="70" cy="44" r="18"/>
      <circle cx="50" cy="28" r="20"/>
      <circle cx="38" cy="32" r="16"/>
      <circle cx="62" cy="32" r="16"/>
    </g>
    <circle cx="44" cy="40" r="3.5" fill="#1F2937"/>
    <circle cx="56" cy="40" r="3.5" fill="#1F2937"/>
    <circle cx="45" cy="39" r="1.2" fill="#FFFFFF"/>
    <circle cx="57" cy="39" r="1.2" fill="#FFFFFF"/>
    <ellipse cx="38" cy="46" rx="3.5" ry="2" fill="#F472B6" opacity="0.6"/>
    <ellipse cx="62" cy="46" rx="3.5" ry="2" fill="#F472B6" opacity="0.6"/>
    <path d="M47 46 Q50 50 53 46" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  tomato: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="56" r="38" fill="#EF4444" stroke="#B91C1C" stroke-width="3"/>
    <path d="M50 16 C50 10, 52 8, 54 6" stroke="#15803D" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 18 L42 22 M50 18 L58 22 M50 18 L48 26 M50 18 L38 18 M50 18 L62 18" stroke="#22C55E" stroke-width="4" stroke-linecap="round"/>
    <circle cx="36" cy="52" r="4" fill="#1F2937"/>
    <circle cx="64" cy="52" r="4" fill="#1F2937"/>
    <circle cx="38" cy="50" r="1.5" fill="#FFFFFF"/>
    <circle cx="66" cy="50" r="1.5" fill="#FFFFFF"/>
    <ellipse cx="28" cy="60" rx="5" ry="3" fill="#F87171"/>
    <ellipse cx="72" cy="60" rx="5" ry="3" fill="#F87171"/>
    <path d="M44 60 Q50 66 56 60" stroke="#1F2937" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="32" cy="36" rx="6" ry="10" fill="#FFFFFF" opacity="0.4" transform="rotate(-30 32 36)"/>
  </svg>`,

  corn: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 20 C62 20, 68 40, 66 70 C64 88, 56 94, 50 94 C44 94, 36 88, 34 70 C32 40, 38 20, 50 20 Z" fill="#FACC15" stroke="#CA8A04" stroke-width="3"/>
    <path d="M26 84 C22 62, 34 46, 38 34 C30 52, 32 78, 44 92" fill="#4ADE80" stroke="#16A34A" stroke-width="3"/>
    <path d="M74 84 C78 62, 66 46, 62 34 C70 52, 68 78, 56 92" fill="#4ADE80" stroke="#16A34A" stroke-width="3"/>
    <circle cx="44" cy="46" r="3.5" fill="#1F2937"/>
    <circle cx="56" cy="46" r="3.5" fill="#1F2937"/>
    <circle cx="45" cy="45" r="1.2" fill="#FFFFFF"/>
    <circle cx="57" cy="45" r="1.2" fill="#FFFFFF"/>
    <path d="M47 52 Q50 56 53 52" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  peach: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 18 C52 10, 60 8, 64 6 C62 14, 56 18, 50 18 Z" fill="#22C55E" stroke="#16A34A" stroke-width="2"/>
    <path d="M50 24 C34 16, 14 30, 16 58 C18 82, 38 94, 50 94 C62 94, 82 82, 84 58 C86 30, 66 16, 50 24 Z" fill="#FCA5A5" stroke="#F87171" stroke-width="3"/>
    <path d="M50 24 Q50 56 50 94" stroke="#F87171" stroke-width="2" opacity="0.6"/>
    <circle cx="36" cy="50" r="4" fill="#1F2937"/>
    <circle cx="64" cy="50" r="4" fill="#1F2937"/>
    <circle cx="38" cy="48" r="1.5" fill="#FFFFFF"/>
    <circle cx="66" cy="48" r="1.5" fill="#FFFFFF"/>
    <ellipse cx="28" cy="58" rx="5" ry="3" fill="#FDA4AF"/>
    <ellipse cx="72" cy="58" rx="5" ry="3" fill="#FDA4AF"/>
    <path d="M44 58 Q50 64 56 58" stroke="#1F2937" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  avocado: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 14 C36 14, 28 32, 24 54 C20 76, 32 94, 50 94 C68 94, 80 76, 76 54 C72 32, 64 14, 50 14 Z" fill="#15803D" stroke="#166534" stroke-width="3"/>
    <path d="M50 18 C38 18, 32 34, 28 54 C24 74, 34 90, 50 90 C66 90, 76 74, 72 54 C68 34, 62 18, 50 18 Z" fill="#BBF7D0"/>
    <circle cx="50" cy="65" r="16" fill="#92400E" stroke="#78350F" stroke-width="2.5"/>
    <circle cx="45" cy="40" r="3.5" fill="#1F2937"/>
    <circle cx="55" cy="40" r="3.5" fill="#1F2937"/>
    <circle cx="46" cy="39" r="1.2" fill="#FFFFFF"/>
    <circle cx="56" cy="39" r="1.2" fill="#FFFFFF"/>
    <path d="M47 46 Q50 50 53 46" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  lemon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="50" rx="42" ry="30" fill="#FDE047" stroke="#EAB308" stroke-width="3" transform="rotate(-30 50 50)"/>
    <path d="M18 68 L14 74 M82 32 L86 26" stroke="#CA8A04" stroke-width="3" stroke-linecap="round"/>
    <circle cx="42" cy="46" r="4" fill="#1F2937"/>
    <circle cx="62" cy="46" r="4" fill="#1F2937"/>
    <circle cx="43" cy="45" r="1.5" fill="#FFFFFF"/>
    <circle cx="63" cy="45" r="1.5" fill="#FFFFFF"/>
    <ellipse cx="36" cy="53" rx="4" ry="2.5" fill="#FEF08A"/>
    <ellipse cx="68" cy="53" rx="4" ry="2.5" fill="#FEF08A"/>
    <path d="M48 54 Q52 59 56 54" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  cherries: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 16 C50 16, 40 34, 34 60 M50 16 C50 16, 60 34, 68 62" stroke="#65A30D" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 16 C58 12, 64 12, 68 14 C64 20, 56 20, 50 16 Z" fill="#84CC16"/>
    <circle cx="32" cy="68" r="18" fill="#DC2626" stroke="#991B1B" stroke-width="3"/>
    <circle cx="68" cy="70" r="18" fill="#DC2626" stroke="#991B1B" stroke-width="3"/>
    <circle cx="28" cy="65" r="3" fill="#1F2937"/>
    <circle cx="36" cy="65" r="3" fill="#1F2937"/>
    <circle cx="64" cy="67" r="3" fill="#1F2937"/>
    <circle cx="72" cy="67" r="3" fill="#1F2937"/>
    <path d="M30 72 Q32 75 34 72 M66 74 Q68 77 70 74" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="24" cy="60" rx="3" ry="5" fill="#FFFFFF" opacity="0.4" transform="rotate(-25 24 60)"/>
    <ellipse cx="60" cy="62" rx="3" ry="5" fill="#FFFFFF" opacity="0.4" transform="rotate(-25 60 62)"/>
  </svg>`,

  pineapple: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10 L50 36 M38 16 Q44 26 50 34 M62 16 Q56 26 50 34 M30 24 Q42 32 50 36 M70 24 Q58 32 50 36" stroke="#22C55E" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="50" cy="64" rx="28" ry="32" fill="#EAB308" stroke="#CA8A04" stroke-width="3"/>
    <path d="M30 46 L70 82 M30 82 L70 46 M24 64 L76 64" stroke="#CA8A04" stroke-width="2" opacity="0.5"/>
    <circle cx="44" cy="58" r="4" fill="#1F2937"/>
    <circle cx="56" cy="58" r="4" fill="#1F2937"/>
    <circle cx="45" cy="57" r="1.5" fill="#FFFFFF"/>
    <circle cx="57" cy="57" r="1.5" fill="#FFFFFF"/>
    <path d="M47 66 Q50 70 53 66" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  mushroom: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="42" y="55" width="16" height="34" rx="8" fill="#F5F5F4" stroke="#D6D3D1" stroke-width="3"/>
    <path d="M14 56 C14 30, 32 18, 50 18 C68 18, 86 30, 86 56 Z" fill="#EF4444" stroke="#DC2626" stroke-width="3"/>
    <circle cx="34" cy="34" r="6" fill="#FFFFFF"/>
    <circle cx="66" cy="34" r="6" fill="#FFFFFF"/>
    <circle cx="50" cy="46" r="5" fill="#FFFFFF"/>
    <circle cx="45" cy="68" r="3" fill="#1F2937"/>
    <circle cx="55" cy="68" r="3" fill="#1F2937"/>
    <path d="M48 74 Q50 77 52 74" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  // Unit 2 Items: Bakery & Breakfast
  milk: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 38 L40 22 L60 22 L70 38 Z" fill="#93C5FD" stroke="#3B82F6" stroke-width="3"/>
    <rect x="30" y="38" width="40" height="54" rx="6" fill="#EFF6FF" stroke="#3B82F6" stroke-width="3"/>
    <rect x="30" y="52" width="40" height="20" fill="#BFDBFE"/>
    <text x="50" y="66" font-size="10" font-weight="bold" fill="#1E40AF" text-anchor="middle" font-family="sans-serif">MILK</text>
    <circle cx="44" cy="44" r="3.5" fill="#1F2937"/>
    <circle cx="56" cy="44" r="3.5" fill="#1F2937"/>
    <circle cx="45" cy="43" r="1.2" fill="#FFFFFF"/>
    <circle cx="57" cy="43" r="1.2" fill="#FFFFFF"/>
    <ellipse cx="38" cy="47" rx="3" ry="1.8" fill="#F472B6" opacity="0.6"/>
    <ellipse cx="62" cy="47" rx="3" ry="1.8" fill="#F472B6" opacity="0.6"/>
    <path d="M48 48 Q50 51 52 48" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  bread: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 54 C16 38, 28 26, 50 26 C72 26, 84 38, 80 54 C80 76, 74 84, 50 84 C26 84, 20 76, 20 54 Z" fill="#FBBF24" stroke="#D97706" stroke-width="3"/>
    <path d="M34 38 Q42 42 36 50 M50 36 Q58 40 52 48 M66 38 Q74 42 68 50" stroke="#B45309" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="42" cy="62" r="3.5" fill="#1F2937"/>
    <circle cx="58" cy="62" r="3.5" fill="#1F2937"/>
    <circle cx="43" cy="61" r="1.2" fill="#FFFFFF"/>
    <circle cx="59" cy="61" r="1.2" fill="#FFFFFF"/>
    <ellipse cx="36" cy="67" rx="3.5" ry="2" fill="#F472B6" opacity="0.6"/>
    <ellipse cx="64" cy="67" rx="3.5" ry="2" fill="#F472B6" opacity="0.6"/>
    <path d="M47 67 Q50 71 53 67" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  egg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 14 C32 14, 24 40, 24 62 C24 80, 36 92, 50 92 C64 92, 76 80, 76 62 C76 40, 68 14, 50 14 Z" fill="#FEF3C7" stroke="#F59E0B" stroke-width="3"/>
    <circle cx="44" cy="54" r="3.5" fill="#1F2937"/>
    <circle cx="56" cy="54" r="3.5" fill="#1F2937"/>
    <circle cx="45" cy="53" r="1.2" fill="#FFFFFF"/>
    <circle cx="57" cy="53" r="1.2" fill="#FFFFFF"/>
    <ellipse cx="36" cy="60" rx="3.5" ry="2" fill="#FCA5A5"/>
    <ellipse cx="64" cy="60" rx="3.5" ry="2" fill="#FCA5A5"/>
    <path d="M47 61 Q50 65 53 61" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="36" cy="36" rx="4" ry="8" fill="#FFFFFF" opacity="0.5" transform="rotate(-25 36 36)"/>
  </svg>`,

  cheese: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 66 L50 24 L84 46 L84 76 L16 76 Z" fill="#FBBF24" stroke="#D97706" stroke-width="3"/>
    <circle cx="34" cy="66" r="6" fill="#F59E0B"/>
    <circle cx="68" cy="64" r="8" fill="#F59E0B"/>
    <circle cx="52" cy="54" r="5" fill="#F59E0B"/>
    <circle cx="42" cy="42" r="3" fill="#1F2937"/>
    <circle cx="58" cy="42" r="3" fill="#1F2937"/>
    <path d="M48 48 Q50 51 52 48" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  donut: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="52" rx="38" ry="34" fill="#FDE68A" stroke="#D97706" stroke-width="3"/>
    <path d="M18 50 C18 34, 30 22, 50 22 C70 22, 82 34, 82 50 C80 56, 74 54, 70 58 C66 62, 60 56, 54 62 C48 66, 42 58, 36 62 C30 66, 24 58, 18 50 Z" fill="#F472B6" stroke="#DB2777" stroke-width="2.5"/>
    <ellipse cx="50" cy="52" rx="14" ry="12" fill="#FFFFFF" stroke="#D97706" stroke-width="3"/>
    <rect x="32" y="32" width="6" height="2.5" rx="1" fill="#FACC15" transform="rotate(30 32 32)"/>
    <rect x="62" y="34" width="6" height="2.5" rx="1" fill="#60A5FA" transform="rotate(-40 62 34)"/>
    <rect x="46" y="26" width="6" height="2.5" rx="1" fill="#4ADE80" transform="rotate(15 46 26)"/>
    <circle cx="42" cy="46" r="3" fill="#1F2937"/>
    <circle cx="58" cy="46" r="3" fill="#1F2937"/>
    <path d="M47 50 Q50 53 53 50" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  cookie: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="36" fill="#D97706" stroke="#92400E" stroke-width="3"/>
    <circle cx="34" cy="36" r="4.5" fill="#451A03"/>
    <circle cx="66" cy="38" r="4" fill="#451A03"/>
    <circle cx="28" cy="56" r="4" fill="#451A03"/>
    <circle cx="70" cy="62" r="4.5" fill="#451A03"/>
    <circle cx="50" cy="74" r="4" fill="#451A03"/>
    <circle cx="42" cy="48" r="3.5" fill="#1F2937"/>
    <circle cx="58" cy="48" r="3.5" fill="#1F2937"/>
    <circle cx="43" cy="47" r="1.2" fill="#FFFFFF"/>
    <circle cx="59" cy="47" r="1.2" fill="#FFFFFF"/>
    <ellipse cx="36" cy="54" rx="3.5" ry="2" fill="#F59E0B"/>
    <ellipse cx="64" cy="54" rx="3.5" ry="2" fill="#F59E0B"/>
    <path d="M47 56 Q50 60 53 56" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  croissant: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 66 C22 42, 40 32, 50 32 C60 32, 78 42, 84 66 C76 68, 68 56, 50 56 C32 56, 24 68, 16 66 Z" fill="#F59E0B" stroke="#B45309" stroke-width="3"/>
    <path d="M32 56 C36 46, 44 42, 50 42 C56 42, 64 46, 68 56" stroke="#D97706" stroke-width="2.5" fill="none"/>
    <circle cx="44" cy="46" r="3" fill="#1F2937"/>
    <circle cx="56" cy="46" r="3" fill="#1F2937"/>
    <path d="M47 51 Q50 54 53 51" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  juice: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="32" width="40" height="58" rx="6" fill="#FB923C" stroke="#EA580C" stroke-width="3"/>
    <path d="M52 14 L52 24 L60 32" stroke="#EF4444" stroke-width="4" stroke-linecap="round" fill="none"/>
    <circle cx="50" cy="58" r="12" fill="#FDE047"/>
    <circle cx="44" cy="44" r="3" fill="#1F2937"/>
    <circle cx="56" cy="44" r="3" fill="#1F2937"/>
    <path d="M47 49 Q50 52 53 49" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
    <text x="50" y="80" font-size="8" font-weight="bold" fill="#7C2D12" text-anchor="middle" font-family="sans-serif">JUICE</text>
  </svg>`,

  cupcake: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28 54 L34 88 C34 90, 66 90, 66 88 L72 54 Z" fill="#FDE68A" stroke="#D97706" stroke-width="3"/>
    <path d="M22 54 C20 40, 32 30, 50 30 C68 30, 80 40, 78 54 C74 58, 66 54, 60 58 C54 62, 46 54, 40 58 C34 62, 26 58, 22 54 Z" fill="#F472B6" stroke="#DB2777" stroke-width="3"/>
    <circle cx="50" cy="24" r="7" fill="#EF4444" stroke="#B91C1C" stroke-width="2"/>
    <circle cx="44" cy="44" r="3.5" fill="#1F2937"/>
    <circle cx="56" cy="44" r="3.5" fill="#1F2937"/>
    <circle cx="45" cy="43" r="1.2" fill="#FFFFFF"/>
    <circle cx="57" cy="43" r="1.2" fill="#FFFFFF"/>
    <ellipse cx="36" cy="49" rx="3.5" ry="2" fill="#FDA4AF"/>
    <ellipse cx="64" cy="49" rx="3.5" ry="2" fill="#FDA4AF"/>
    <path d="M47 49 Q50 53 53 49" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  yogurt: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28 40 L34 88 C34 90, 66 90, 66 88 L72 40 Z" fill="#E0F2FE" stroke="#0284C7" stroke-width="3"/>
    <ellipse cx="50" cy="40" rx="24" ry="8" fill="#BAE6FD" stroke="#0284C7" stroke-width="3"/>
    <circle cx="44" cy="56" r="3.5" fill="#1F2937"/>
    <circle cx="56" cy="56" r="3.5" fill="#1F2937"/>
    <path d="M47 62 Q50 66 53 62" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
    <text x="50" y="78" font-size="8" font-weight="bold" fill="#0369A1" text-anchor="middle" font-family="sans-serif">BERRY</text>
  </svg>`,

  jam: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="36" y="20" width="28" height="12" rx="3" fill="#F43F5E" stroke="#BE123C" stroke-width="2.5"/>
    <rect x="26" y="32" width="48" height="56" rx="10" fill="#FDA4AF" stroke="#E11D48" stroke-width="3"/>
    <rect x="32" y="44" width="36" height="24" rx="4" fill="#FFF1F2"/>
    <circle cx="44" cy="52" r="3" fill="#1F2937"/>
    <circle cx="56" cy="52" r="3" fill="#1F2937"/>
    <path d="M47 58 Q50 61 53 58" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
    <text x="50" y="66" font-size="6" font-weight="bold" fill="#BE123C" text-anchor="middle">JAM</text>
  </svg>`,

  pancake: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="74" rx="38" ry="14" fill="#F59E0B" stroke="#B45309" stroke-width="3"/>
    <ellipse cx="50" cy="58" rx="36" ry="13" fill="#FBBF24" stroke="#B45309" stroke-width="3"/>
    <ellipse cx="50" cy="42" rx="34" ry="12" fill="#FDE68A" stroke="#B45309" stroke-width="3"/>
    <rect x="42" y="26" width="16" height="12" rx="3" fill="#FEF08A" stroke="#CA8A04" stroke-width="2"/>
    <circle cx="42" cy="42" r="3" fill="#1F2937"/>
    <circle cx="58" cy="42" r="3" fill="#1F2937"/>
    <path d="M47 47 Q50 50 53 47" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  waffle: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="20" width="60" height="60" rx="12" fill="#FBBF24" stroke="#B45309" stroke-width="3"/>
    <g fill="#F59E0B">
      <rect x="28" y="28" width="10" height="10" rx="2"/>
      <rect x="44" y="28" width="10" height="10" rx="2"/>
      <rect x="60" y="28" width="10" height="10" rx="2"/>
      <rect x="28" y="44" width="10" height="10" rx="2"/>
      <rect x="60" y="44" width="10" height="10" rx="2"/>
      <rect x="28" y="60" width="10" height="10" rx="2"/>
      <rect x="44" y="60" width="10" height="10" rx="2"/>
      <rect x="60" y="60" width="10" height="10" rx="2"/>
    </g>
    <circle cx="44" cy="48" r="3" fill="#1F2937"/>
    <circle cx="56" cy="48" r="3" fill="#1F2937"/>
    <path d="M47 53 Q50 56 53 53" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  honey: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="36" y="22" width="28" height="10" rx="3" fill="#FDE047" stroke="#CA8A04" stroke-width="2.5"/>
    <path d="M26 40 C22 65, 30 88, 50 88 C70 88, 78 65, 74 40 Z" fill="#FBBF24" stroke="#D97706" stroke-width="3"/>
    <circle cx="44" cy="52" r="3.5" fill="#1F2937"/>
    <circle cx="56" cy="52" r="3.5" fill="#1F2937"/>
    <path d="M47 58 Q50 62 53 58" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
    <text x="50" y="74" font-size="8" font-weight="bold" fill="#78350F" text-anchor="middle">HONEY</text>
  </svg>`,

  butter: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="74" rx="40" ry="12" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3"/>
    <path d="M26 46 L74 46 L68 68 L20 68 Z" fill="#FEF08A" stroke="#EAB308" stroke-width="3"/>
    <circle cx="42" cy="56" r="3" fill="#1F2937"/>
    <circle cx="54" cy="56" r="3" fill="#1F2937"/>
    <path d="M45 61 Q48 64 51 61" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  pretzel: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 40 C20 40, 16 54, 24 68 C32 82, 50 80, 50 64 C50 80, 68 82, 76 68 C84 54, 80 40, 70 40 C56 40, 50 56, 50 56 C50 56, 44 40, 30 40 Z" fill="#B45309" stroke="#78350F" stroke-width="5" stroke-linejoin="round"/>
    <circle cx="44" cy="62" r="3" fill="#1F2937"/>
    <circle cx="56" cy="62" r="3" fill="#1F2937"/>
    <path d="M47 67 Q50 70 53 67" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
    <circle cx="28" cy="52" r="1.5" fill="#FFFFFF"/>
    <circle cx="72" cy="52" r="1.5" fill="#FFFFFF"/>
  </svg>`,

  // Unit 3 Items: School Supplies
  pencil: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M68 18 L82 32 L36 78 L22 84 L26 70 Z" fill="#FACC15" stroke="#CA8A04" stroke-width="3"/>
    <path d="M22 84 L26 70 L36 78 Z" fill="#FDE68A"/>
    <path d="M22 84 L25 79 L29 82 Z" fill="#1F2937"/>
    <path d="M68 18 L76 10 L88 22 L82 32 Z" fill="#F472B6" stroke="#DB2777" stroke-width="2"/>
    <circle cx="48" cy="52" r="3" fill="#1F2937"/>
    <circle cx="56" cy="44" r="3" fill="#1F2937"/>
    <path d="M49 48 Q54 51 52 46" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  book: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 24 C34 22, 46 26, 50 30 C54 26, 66 22, 78 24 L78 78 C66 76, 54 80, 50 84 C46 80, 34 76, 22 78 Z" fill="#60A5FA" stroke="#2563EB" stroke-width="3"/>
    <path d="M50 30 L50 84" stroke="#1D4ED8" stroke-width="3"/>
    <circle cx="36" cy="48" r="3.5" fill="#1F2937"/>
    <circle cx="64" cy="48" r="3.5" fill="#1F2937"/>
    <path d="M47 56 Q50 60 53 56" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  eraser: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 54 L44 30 L80 66 L56 90 Z" fill="#F472B6" stroke="#DB2777" stroke-width="3"/>
    <path d="M44 30 L56 42 L32 66 L20 54 Z" fill="#93C5FD" stroke="#3B82F6" stroke-width="2.5"/>
    <circle cx="52" cy="62" r="3" fill="#1F2937"/>
    <circle cx="62" cy="72" r="3" fill="#1F2937"/>
    <path d="M54 69 Q58 71 59 66" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  ruler: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="38" width="64" height="24" rx="4" fill="#FDE68A" stroke="#D97706" stroke-width="3"/>
    <path d="M26 38 L26 46 M34 38 L34 50 M42 38 L42 46 M50 38 L50 50 M58 38 L58 46 M66 38 L66 50 M74 38 L74 46" stroke="#B45309" stroke-width="2" stroke-linecap="round"/>
    <circle cx="44" cy="54" r="2.5" fill="#1F2937"/>
    <circle cx="56" cy="54" r="2.5" fill="#1F2937"/>
    <path d="M48 57 Q50 59 52 57" stroke="#1F2937" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,

  scissors: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 30 L58 58 L72 38" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
    <path d="M70 30 L42 58 L28 38" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
    <circle cx="34" cy="74" r="14" fill="#F472B6" stroke="#DB2777" stroke-width="3"/>
    <circle cx="34" cy="74" r="7" fill="#FFFFFF"/>
    <circle cx="66" cy="74" r="14" fill="#F472B6" stroke="#DB2777" stroke-width="3"/>
    <circle cx="66" cy="74" r="7" fill="#FFFFFF"/>
    <circle cx="50" cy="50" r="4" fill="#1F2937"/>
  </svg>`,

  backpack: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M38 24 C38 18, 62 18, 62 24" stroke="#9333EA" stroke-width="4" stroke-linecap="round" fill="none"/>
    <rect x="24" y="24" width="52" height="66" rx="14" fill="#C084FC" stroke="#9333EA" stroke-width="3"/>
    <rect x="32" y="48" width="36" height="32" rx="8" fill="#E9D5FF" stroke="#9333EA" stroke-width="2.5"/>
    <circle cx="44" cy="38" r="3.5" fill="#1F2937"/>
    <circle cx="56" cy="38" r="3.5" fill="#1F2937"/>
    <path d="M47 43 Q50 46 53 43" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  crayon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="36" y="32" width="28" height="56" rx="4" fill="#F43F5E" stroke="#E11D48" stroke-width="3"/>
    <path d="M36 32 L50 14 L64 32 Z" fill="#FB7185" stroke="#E11D48" stroke-width="2.5"/>
    <rect x="36" y="48" width="28" height="20" fill="#1F2937"/>
    <circle cx="44" cy="58" r="2.5" fill="#FFFFFF"/>
    <circle cx="56" cy="58" r="2.5" fill="#FFFFFF"/>
  </svg>`,

  glue: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="42" y="14" width="16" height="12" rx="2" fill="#F97316" stroke="#C2410C" stroke-width="2"/>
    <path d="M36 26 L64 26 L64 34 L36 34 Z" fill="#CBD5E1"/>
    <rect x="28" y="34" width="44" height="56" rx="8" fill="#F8FAFC" stroke="#64748B" stroke-width="3"/>
    <circle cx="44" cy="50" r="3.5" fill="#1F2937"/>
    <circle cx="56" cy="50" r="3.5" fill="#1F2937"/>
    <path d="M47 56 Q50 60 53 56" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
    <text x="50" y="76" font-size="8" font-weight="bold" fill="#0284C7" text-anchor="middle">GLUE</text>
  </svg>`,

  notebook: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="28" y="18" width="52" height="68" rx="6" fill="#F472B6" stroke="#DB2777" stroke-width="3"/>
    <path d="M28 26 L20 26 M28 40 L20 40 M28 54 L20 54 M28 68 L20 68" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
    <circle cx="46" cy="46" r="3.5" fill="#1F2937"/>
    <circle cx="62" cy="46" r="3.5" fill="#1F2937"/>
    <path d="M51 53 Q54 57 57 53" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
    <rect x="38" y="64" width="32" height="4" rx="2" fill="#FFFFFF" opacity="0.8"/>
  </svg>`,

  pen: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="44" y="24" width="12" height="56" rx="4" fill="#3B82F6" stroke="#1D4ED8" stroke-width="2.5"/>
    <path d="M44 80 L50 94 L56 80 Z" fill="#94A3B8" stroke="#475569" stroke-width="2"/>
    <circle cx="50" cy="94" r="1.5" fill="#1F2937"/>
    <circle cx="48" cy="44" r="2" fill="#FFFFFF"/>
    <circle cx="52" cy="44" r="2" fill="#FFFFFF"/>
  </svg>`,

  sharpener: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="26" y="28" width="48" height="48" rx="8" fill="#4ADE80" stroke="#16A34A" stroke-width="3"/>
    <circle cx="50" cy="52" r="12" fill="#15803D"/>
    <circle cx="44" cy="40" r="3" fill="#1F2937"/>
    <circle cx="56" cy="40" r="3" fill="#1F2937"/>
    <path d="M47 45 Q50 48 53 45" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  paint: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 50 C20 30, 40 20, 60 20 C80 20, 88 36, 88 56 C88 76, 70 84, 52 84 C42 84, 38 74, 32 74 C26 74, 20 66, 20 50 Z" fill="#FDE68A" stroke="#D97706" stroke-width="3"/>
    <circle cx="36" cy="74" r="5" fill="#FFFFFF" stroke="#D97706" stroke-width="2"/>
    <circle cx="34" cy="38" r="6" fill="#EF4444"/>
    <circle cx="52" cy="32" r="6" fill="#3B82F6"/>
    <circle cx="70" cy="38" r="6" fill="#22C55E"/>
    <circle cx="74" cy="56" r="6" fill="#A855F7"/>
  </svg>`,

  marker: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="40" y="34" width="20" height="52" rx="5" fill="#A3E635" stroke="#65A30D" stroke-width="3"/>
    <path d="M42 16 L58 16 L56 34 L44 34 Z" fill="#65A30D"/>
    <circle cx="46" cy="52" r="2.5" fill="#1F2937"/>
    <circle cx="54" cy="52" r="2.5" fill="#1F2937"/>
    <path d="M48 58 Q50 61 52 58" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  clip: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M38 78 L38 34 C38 24, 62 24, 62 34 L62 70 C62 76, 48 76, 48 70 L48 40" stroke="#EC4899" stroke-width="6" stroke-linecap="round" fill="none"/>
    <circle cx="48" cy="34" r="2.5" fill="#1F2937"/>
  </svg>`,

  clock: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="36" fill="#FEF08A" stroke="#EAB308" stroke-width="4"/>
    <path d="M50 26 L50 50 L64 50" stroke="#1F2937" stroke-width="4" stroke-linecap="round"/>
    <circle cx="50" cy="50" r="4" fill="#EF4444"/>
    <circle cx="42" cy="62" r="3" fill="#1F2937"/>
    <circle cx="58" cy="62" r="3" fill="#1F2937"/>
    <path d="M47 67 Q50 70 53 67" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  globe: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="44" r="26" fill="#60A5FA" stroke="#2563EB" stroke-width="3"/>
    <path d="M38 36 Q46 32 54 38 Q58 48 50 52 Q42 56 38 48 Z" fill="#4ADE80"/>
    <path d="M50 14 C68 14, 76 30, 76 44 C76 58, 68 74, 50 74 L50 88 M36 88 L64 88" stroke="#64748B" stroke-width="4" stroke-linecap="round" fill="none"/>
    <circle cx="44" cy="44" r="2.5" fill="#1F2937"/>
    <circle cx="56" cy="44" r="2.5" fill="#1F2937"/>
    <path d="M48 48 Q50 51 52 48" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
};

export const DEFAULT_ROOMS: Room[] = [
  {
    id: 'room-fruits',
    name: 'Unit 1: Fruits & Veggies',
    description: 'Learn names of fresh fruits and vegetables!',
    items: [
      { id: 'item-1', name: 'Apple', word: 'apple', category: 'Fruits', slotIndex: 0, price: 1, hint: 'A sweet red fruit with a green leaf', iconSvg: ITEM_SVGS.apple },
      { id: 'item-2', name: 'Banana', word: 'banana', category: 'Fruits', slotIndex: 1, price: 2, hint: 'Monkeys love this yellow curved fruit', iconSvg: ITEM_SVGS.banana },
      { id: 'item-3', name: 'Orange', word: 'orange', category: 'Fruits', slotIndex: 2, price: 2, hint: 'Round citrus fruit with the same name as its color', iconSvg: ITEM_SVGS.orange },
      { id: 'item-4', name: 'Strawberry', word: 'strawberry', category: 'Fruits', slotIndex: 3, price: 3, hint: 'Red berry with tiny yellow seeds on the outside', iconSvg: ITEM_SVGS.strawberry },
      { id: 'item-5', name: 'Watermelon', word: 'watermelon', category: 'Fruits', slotIndex: 4, price: 4, hint: 'Giant juicy fruit green on outside, red inside', iconSvg: ITEM_SVGS.watermelon },
      { id: 'item-6', name: 'Carrot', word: 'carrot', category: 'Veggies', slotIndex: 5, price: 1, hint: 'Bunnies love this crunchy orange root vegetable', iconSvg: ITEM_SVGS.carrot },
      { id: 'item-7', name: 'Grapes', word: 'grapes', category: 'Fruits', slotIndex: 6, price: 3, hint: 'Clusters of small purple or green berries', iconSvg: ITEM_SVGS.grapes },
      { id: 'item-8', name: 'Broccoli', word: 'broccoli', category: 'Veggies', slotIndex: 7, price: 2, hint: 'Looks like a little green tree!', iconSvg: ITEM_SVGS.broccoli },
      { id: 'item-9', name: 'Tomato', word: 'tomato', category: 'Veggies', slotIndex: 8, price: 1, hint: 'Plump red fruit used in ketchup and pizza sauce', iconSvg: ITEM_SVGS.tomato },
      { id: 'item-10', name: 'Corn', word: 'corn', category: 'Veggies', slotIndex: 9, price: 2, hint: 'Golden yellow kernels on a cob', iconSvg: ITEM_SVGS.corn },
      { id: 'item-11', name: 'Peach', word: 'peach', category: 'Fruits', slotIndex: 10, price: 2, hint: 'Soft sweet fuzzy fruit with a pit', iconSvg: ITEM_SVGS.peach },
      { id: 'item-12', name: 'Avocado', word: 'avocado', category: 'Veggies', slotIndex: 11, price: 3, hint: 'Creamy green superfood with a big seed in center', iconSvg: ITEM_SVGS.avocado },
      { id: 'item-13', name: 'Lemon', word: 'lemon', category: 'Fruits', slotIndex: 12, price: 1, hint: 'Bright yellow and sour!', iconSvg: ITEM_SVGS.lemon },
      { id: 'item-14', name: 'Cherries', word: 'cherries', category: 'Fruits', slotIndex: 13, price: 3, hint: 'Pairs of sweet little red fruits on stems', iconSvg: ITEM_SVGS.cherries },
      { id: 'item-15', name: 'Pineapple', word: 'pineapple', category: 'Fruits', slotIndex: 14, price: 4, hint: 'Tropical fruit with spiky leaves on top', iconSvg: ITEM_SVGS.pineapple },
      { id: 'item-16', name: 'Mushroom', word: 'mushroom', category: 'Veggies', slotIndex: 15, price: 2, hint: 'Cute forest vegetable with an umbrella cap', iconSvg: ITEM_SVGS.mushroom },
    ],
  },
  {
    id: 'room-bakery',
    name: 'Unit 2: Bakery & Breakfast',
    description: 'Delicious bakery treats, dairy, and breakfast items!',
    items: [
      { id: 'item-101', name: 'Milk', word: 'milk', category: 'Dairy', slotIndex: 0, price: 2, hint: 'White drink that builds strong bones', iconSvg: ITEM_SVGS.milk },
      { id: 'item-102', name: 'Bread', word: 'bread', category: 'Bakery', slotIndex: 1, price: 2, hint: 'Loaf baked golden brown for sandwiches', iconSvg: ITEM_SVGS.bread },
      { id: 'item-103', name: 'Egg', word: 'egg', category: 'Breakfast', slotIndex: 2, price: 1, hint: 'Has a yellow yolk inside a smooth shell', iconSvg: ITEM_SVGS.egg },
      { id: 'item-104', name: 'Cheese', word: 'cheese', category: 'Dairy', slotIndex: 3, price: 3, hint: 'Yellow dairy block with holes, mice love it', iconSvg: ITEM_SVGS.cheese },
      { id: 'item-105', name: 'Donut', word: 'donut', category: 'Bakery', slotIndex: 4, price: 2, hint: 'Round pastry with a hole in the middle and frosting', iconSvg: ITEM_SVGS.donut },
      { id: 'item-106', name: 'Cookie', word: 'cookie', category: 'Bakery', slotIndex: 5, price: 1, hint: 'Crisp sweet baked treat with chocolate chips', iconSvg: ITEM_SVGS.cookie },
      { id: 'item-107', name: 'Croissant', word: 'croissant', category: 'Bakery', slotIndex: 6, price: 3, hint: 'Flaky crescent-shaped French pastry', iconSvg: ITEM_SVGS.croissant },
      { id: 'item-108', name: 'Juice', word: 'juice', category: 'Drinks', slotIndex: 7, price: 2, hint: 'Fruit drink squeezed fresh into a carton', iconSvg: ITEM_SVGS.juice },
      { id: 'item-109', name: 'Cupcake', word: 'cupcake', category: 'Bakery', slotIndex: 8, price: 3, hint: 'Mini cake baked in a cup with swirl frosting', iconSvg: ITEM_SVGS.cupcake },
      { id: 'item-110', name: 'Yogurt', word: 'yogurt', category: 'Dairy', slotIndex: 9, price: 2, hint: 'Creamy sweet berry cup eaten with a spoon', iconSvg: ITEM_SVGS.yogurt },
      { id: 'item-111', name: 'Jam', word: 'jam', category: 'Pantry', slotIndex: 10, price: 3, hint: 'Sweet fruit spread in a glass jar for toast', iconSvg: ITEM_SVGS.jam },
      { id: 'item-112', name: 'Pancake', word: 'pancake', category: 'Breakfast', slotIndex: 11, price: 4, hint: 'Flat round breakfast cake topped with syrup', iconSvg: ITEM_SVGS.pancake },
      { id: 'item-113', name: 'Waffle', word: 'waffle', category: 'Breakfast', slotIndex: 12, price: 3, hint: 'Crispy batter cake with square grid pockets', iconSvg: ITEM_SVGS.waffle },
      { id: 'item-114', name: 'Honey', word: 'honey', category: 'Pantry', slotIndex: 13, price: 4, hint: 'Sweet golden nectar made by busy bees', iconSvg: ITEM_SVGS.honey },
      { id: 'item-115', name: 'Butter', word: 'butter', category: 'Dairy', slotIndex: 14, price: 2, hint: 'Creamy yellow stick spread onto warm bread', iconSvg: ITEM_SVGS.butter },
      { id: 'item-116', name: 'Pretzel', word: 'pretzel', category: 'Bakery', slotIndex: 15, price: 2, hint: 'Knot-shaped golden baked bread with salt crystals', iconSvg: ITEM_SVGS.pretzel },
    ],
  },
  {
    id: 'room-school',
    name: 'Unit 3: School Supplies',
    description: 'Essential classroom stationery and learning tools!',
    items: [
      { id: 'item-201', name: 'Pencil', word: 'pencil', category: 'Writing', slotIndex: 0, price: 1, hint: 'Used for writing and drawing, with an eraser on top', iconSvg: ITEM_SVGS.pencil },
      { id: 'item-202', name: 'Book', word: 'book', category: 'Reading', slotIndex: 1, price: 4, hint: 'Filled with pages of stories and knowledge', iconSvg: ITEM_SVGS.book },
      { id: 'item-203', name: 'Eraser', word: 'eraser', category: 'Tools', slotIndex: 2, price: 1, hint: 'Rubs away pencil marks when you make a mistake', iconSvg: ITEM_SVGS.eraser },
      { id: 'item-204', name: 'Ruler', word: 'ruler', category: 'Tools', slotIndex: 3, price: 2, hint: 'Straight stick used to measure inches and centimeters', iconSvg: ITEM_SVGS.ruler },
      { id: 'item-205', name: 'Scissors', word: 'scissors', category: 'Crafts', slotIndex: 4, price: 3, hint: 'Has two blades used for cutting paper', iconSvg: ITEM_SVGS.scissors },
      { id: 'item-206', name: 'Backpack', word: 'backpack', category: 'Gear', slotIndex: 5, price: 5, hint: 'Bag worn on your back to carry books to school', iconSvg: ITEM_SVGS.backpack },
      { id: 'item-207', name: 'Crayon', word: 'crayon', category: 'Art', slotIndex: 6, price: 1, hint: 'Wax stick used for coloring pictures', iconSvg: ITEM_SVGS.crayon },
      { id: 'item-208', name: 'Glue', word: 'glue', category: 'Crafts', slotIndex: 7, price: 2, hint: 'Sticky liquid or stick to paste paper together', iconSvg: ITEM_SVGS.glue },
      { id: 'item-209', name: 'Notebook', word: 'notebook', category: 'Writing', slotIndex: 8, price: 3, hint: 'Book with lined pages for taking notes in class', iconSvg: ITEM_SVGS.notebook },
      { id: 'item-210', name: 'Pen', word: 'pen', category: 'Writing', slotIndex: 9, price: 2, hint: 'Writes smoothly with permanent ink', iconSvg: ITEM_SVGS.pen },
      { id: 'item-211', name: 'Sharpener', word: 'sharpener', category: 'Tools', slotIndex: 10, price: 1, hint: 'Makes blunt pencil tips sharp and pointy again', iconSvg: ITEM_SVGS.sharpener },
      { id: 'item-212', name: 'Paint', word: 'paint', category: 'Art', slotIndex: 11, price: 4, hint: 'Colorful pigments on a palette for making art', iconSvg: ITEM_SVGS.paint },
      { id: 'item-213', name: 'Marker', word: 'marker', category: 'Writing', slotIndex: 12, price: 2, hint: 'Felt-tip pen with bright bold highlighting colors', iconSvg: ITEM_SVGS.marker },
      { id: 'item-214', name: 'Paperclip', word: 'paperclip', category: 'Tools', slotIndex: 13, price: 1, hint: 'Bent wire clip that holds sheets of paper together', iconSvg: ITEM_SVGS.clip },
      { id: 'item-215', name: 'Clock', word: 'clock', category: 'Classroom', slotIndex: 14, price: 4, hint: 'Tells what hour and minute it is in class', iconSvg: ITEM_SVGS.clock },
      { id: 'item-216', name: 'Globe', word: 'globe', category: 'Classroom', slotIndex: 15, price: 5, hint: 'Round model of Earth with all oceans and countries', iconSvg: ITEM_SVGS.globe },
    ],
  },
];
