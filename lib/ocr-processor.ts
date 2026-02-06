/**
 * ENHANCED OCR PROCESSOR - PRODUCTION READY
 * Optimized for maximum accuracy on production/waste forms
 */

import { ALL_ITEMS } from './items-list';

// Common OCR character mistakes and corrections
const OCR_CORRECTIONS: Record<string, string> = {
  // Numbers often confused with letters
  '0': 'O',
  '1': 'I',
  '5': 'S',
  '8': 'B',
  
  // Letters often confused with numbers
  'O': '0',
  'I': '1',
  'l': '1',
  'S': '5',
  'B': '8',
  'Z': '2',
  
  // Common character swaps
  'rn': 'm',
  'vv': 'w',
  'cl': 'd',
};

// Known employee name patterns (you can customize)
const COMMON_NAMES = [
  'john', 'sarah', 'mike', 'emily', 'david', 'maria',
  'chris', 'jessica', 'robert', 'jennifer', 'michael',
  'ashley', 'william', 'amanda', 'james', 'melissa'
];

// Shift patterns
const SHIFT_PATTERNS = ['AM', 'PM', 'NIGHT', 'MORNING', 'EVENING', 'OVERNIGHT'];

/**
 * Advanced string similarity using Levenshtein distance
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1, // substitution
          dp[i - 1][j] + 1,     // deletion
          dp[i][j - 1] + 1      // insertion
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Calculate similarity ratio (0-1)
 */
function similarityRatio(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1.0;
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - distance / maxLen;
}

/**
 * Clean and normalize text from OCR
 */
function cleanOcrText(text: string): string {
  let cleaned = text
    .trim()
    .replace(/[^\w\s.-]/g, '') // Remove special chars except .-
    .replace(/\s+/g, ' ');     // Normalize whitespace

  // Apply common OCR corrections
  Object.entries(OCR_CORRECTIONS).forEach(([wrong, right]) => {
    const regex = new RegExp(wrong, 'gi');
    cleaned = cleaned.replace(regex, right);
  });

  return cleaned;
}

/**
 * Extract numbers from text with confidence
 */
function extractNumber(text: string): { value: number; confidence: number } {
  // Remove common OCR mistakes in numbers
  const cleaned = text
    .replace(/[Oo]/g, '0')
    .replace(/[Il|]/g, '1')
    .replace(/[Ss$]/g, '5')
    .replace(/[Bb]/g, '8')
    .replace(/[Zz]/g, '2');

  const match = cleaned.match(/\d+/);
  
  if (match) {
    return {
      value: parseInt(match[0], 10),
      confidence: 0.9
    };
  }

  return { value: 0, confidence: 0 };
}

/**
 * Match item name with fuzzy search
 */
export function matchItemName(ocrText: string, threshold: number = 0.6): {
  matched: string | null;
  confidence: number;
  alternatives: string[];
} {
  const cleaned = cleanOcrText(ocrText);
  const words = cleaned.toLowerCase().split(' ');

  let bestMatch: string | null = null;
  let bestScore = 0;
  const alternatives: Array<{ item: string; score: number }> = [];

  // Check each inventory item
  for (const item of ALL_ITEMS) {
    const itemLower = item.toLowerCase();
    
    // Exact match (best case)
    if (cleaned.toLowerCase() === itemLower) {
      return {
        matched: item,
        confidence: 1.0,
        alternatives: []
      };
    }

    // Check if OCR text contains item name
    if (cleaned.toLowerCase().includes(itemLower)) {
      if (1.0 > bestScore) {
        bestScore = 0.95;
        bestMatch = item;
      }
    }

    // Word-by-word matching
    for (const word of words) {
      if (word.length < 3) continue; // Skip short words
      
      if (itemLower.includes(word)) {
        const score = 0.8;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = item;
        }
      }
    }

    // Fuzzy similarity matching
    const similarity = similarityRatio(cleaned, item);
    if (similarity > threshold && similarity > bestScore) {
      bestScore = similarity;
      bestMatch = item;
    }

    // Track alternatives
    if (similarity > threshold) {
      alternatives.push({ item, score: similarity });
    }
  }

  // Sort alternatives by score
  alternatives.sort((a, b) => b.score - a.score);

  return {
    matched: bestMatch,
    confidence: bestScore,
    alternatives: alternatives.slice(0, 3).map(a => a.item)
  };
}

/**
 * Extract employee name from text
 */
export function extractEmployeeName(text: string): {
  name: string | null;
  confidence: number;
} {
  const cleaned = cleanOcrText(text).toLowerCase();
  
  // Check for common names
  for (const name of COMMON_NAMES) {
    if (cleaned.includes(name)) {
      return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        confidence: 0.9
      };
    }
  }

  // Try to extract capitalized words (likely names)
  const words = text.split(/\s+/);
  for (const word of words) {
    if (word.length > 2 && /^[A-Z][a-z]+$/.test(word)) {
      return {
        name: word,
        confidence: 0.7
      };
    }
  }

  return { name: null, confidence: 0 };
}

/**
 * Extract shift from text
 */
export function extractShift(text: string): {
  shift: 'AM' | 'PM' | 'Night' | null;
  confidence: number;
} {
  const cleaned = cleanOcrText(text).toUpperCase();

  for (const pattern of SHIFT_PATTERNS) {
    if (cleaned.includes(pattern)) {
      let shift: 'AM' | 'PM' | 'Night';
      if (pattern.includes('AM') || pattern.includes('MORNING')) {
        shift = 'AM';
      } else if (pattern.includes('NIGHT') || pattern.includes('OVERNIGHT')) {
        shift = 'Night';
      } else {
        shift = 'PM';
      }
      
      return { shift, confidence: 0.95 };
    }
  }

  return { shift: null, confidence: 0 };
}

/**
 * Parse a production line entry
 */
export function parseProductionLine(line: string): {
  item: string | null;
  quantity: number | null;
  confidence: number;
  raw: string;
} {
  const cleaned = cleanOcrText(line);
  
  // Try to extract quantity
  const numResult = extractNumber(cleaned);
  
  // Try to match item name
  const itemResult = matchItemName(cleaned, 0.5);

  return {
    item: itemResult.matched,
    quantity: numResult.value || null,
    confidence: (itemResult.confidence + numResult.confidence) / 2,
    raw: line
  };
}

/**
 * Main OCR processing function
 */
export async function processImage(imageData: string, formType: 'production' | 'waste') {
  // Dynamic import for Tesseract
  const { createWorker } = await import('tesseract.js');
  
  const worker = await createWorker('eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
      }
    },
  });

  try {
    // Configure Tesseract for best accuracy
    await worker.setParameters({
      tessedit_pageseg_mode: '6', // Assume uniform block of text
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .-:/',
      preserve_interword_spaces: '1',
    });

    // Perform OCR
    const { data } = await worker.recognize(imageData);
    
    // Process the text
    const lines = data.text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    let employee: string | null = null;
    let shift: 'AM' | 'PM' | 'Night' | null = null;
    const items: Array<{ name: string; quantity: number; confidence: number }> = [];

    // Process each line
    for (const line of lines) {
      // Try to extract employee name
      if (!employee) {
        const empResult = extractEmployeeName(line);
        if (empResult.name && empResult.confidence > 0.6) {
          employee = empResult.name;
        }
      }

      // Try to extract shift
      if (!shift) {
        const shiftResult = extractShift(line);
        if (shiftResult.shift && shiftResult.confidence > 0.8) {
          shift = shiftResult.shift;
        }
      }

      // Try to parse production line
      const parsed = parseProductionLine(line);
      if (parsed.item && parsed.quantity && parsed.confidence > 0.5) {
        items.push({
          name: parsed.item,
          quantity: parsed.quantity,
          confidence: parsed.confidence
        });
      }
    }

    await worker.terminate();

    return {
      success: true,
      employee: employee || 'Unknown',
      shift: shift || 'AM',
      items: items,
      rawText: data.text,
      confidence: data.confidence / 100
    };

  } catch (error) {
    await worker.terminate();
    throw error;
  }
}

export default {
  processImage,
  matchItemName,
  extractEmployeeName,
  extractShift,
  parseProductionLine
};
