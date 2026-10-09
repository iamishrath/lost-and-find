import { Item, MatchResult } from '../types';

/**
 * Calculates geographical distance in kilometers between two coordinates using the Haversine formula.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Clean & tokenize text into normalized keywords, removing common filler stop words.
 */
function tokenize(text: string): Set<string> {
  const stopWords = new Set([
    'a', 'an', 'the', 'in', 'on', 'at', 'near', 'by', 'of', 'and', 'or', 'with', 'for', 'to',
    'lost', 'found', 'my', 'item', 'chennai', 'color', 'please', 'help', 'is', 'was', 'around'
  ]);
  
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word))
  );
}

/**
 * Jaccard token similarity between two text strings (0 to 1).
 */
function calculateTextSimilarity(text1: string, text2: string): number {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  const intersection = new Set([...tokens1].filter((x) => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);

  return intersection.size / union.size;
}

/**
 * Extract distinct identifiers, colors, and brands from text.
 */
const COMMON_BRANDS = [
  'iphone', 'apple', 'samsung', 'oneplus', 'redmi', 'realme', 'vivo', 'oppo', 'dell', 'lenovo',
  'hp', 'fastrack', 'titan', 'casio', 'boat', 'wildcraft', 'american tourister', 'skybags', 'fossil',
  'sony', 'bose', 'macbook', 'airpods', 'noise', 'fire-boltt', 'tumi', 'woodland', 'hidesign'
];

const COMMON_COLORS = [
  'black', 'brown', 'blue', 'navy', 'silver', 'grey', 'gray', 'gold', 'white', 'red', 'green', 'yellow'
];

function extractKeyAttributes(text: string) {
  const lower = text.toLowerCase();
  const brands = COMMON_BRANDS.filter((brand) => lower.includes(brand));
  const colors = COMMON_COLORS.filter((color) => lower.includes(color));
  return { brands, colors };
}

/**
 * Compares a lost item and a found item to generate an intelligent match score and reasoning.
 */
export function compareLostAndFoundItems(
  lost: Item,
  found: Item
): { score: number; reasons: string[]; distanceKm: number; dateDiffDays: number } {
  // Ensure we compare lost vs found
  if (lost.type === found.type) {
    return { score: 0, reasons: [], distanceKm: 999, dateDiffDays: 999 };
  }

  const lostItem = lost.type === 'lost' ? lost : found;
  const foundItem = lost.type === 'found' ? lost : found;

  let totalScore = 0;
  const reasons: string[] = [];

  // 1. Category Similarity (Weight: 25%)
  if (lostItem.category === foundItem.category) {
    totalScore += 25;
    reasons.push(`Exact category match: ${lostItem.category.toUpperCase()}`);
  } else if (
    (lostItem.category === 'wallets' && foundItem.category === 'documents') ||
    (lostItem.category === 'documents' && foundItem.category === 'wallets')
  ) {
    totalScore += 18;
    reasons.push(`High category cross-affinity (Wallet & ID Documents often co-occur)`);
  }

  // 2. Title & Keywords Similarity (Weight: 35%)
  const titleSimilarity = calculateTextSimilarity(lostItem.title, foundItem.title);
  const descSimilarity = calculateTextSimilarity(
    `${lostItem.title} ${lostItem.description}`,
    `${foundItem.title} ${foundItem.description}`
  );

  const textScore = Math.min(35, Math.round(titleSimilarity * 25 + descSimilarity * 20));
  totalScore += textScore;
  if (textScore >= 15) {
    reasons.push(`Strong keyword & title overlap (${Math.round(titleSimilarity * 100)}% lexical match)`);
  }

  // Brand and Color extraction bonus
  const lostAttr = extractKeyAttributes(`${lostItem.title} ${lostItem.description}`);
  const foundAttr = extractKeyAttributes(`${foundItem.title} ${foundItem.description}`);

  const sharedBrands = lostAttr.brands.filter((b) => foundAttr.brands.includes(b));
  if (sharedBrands.length > 0) {
    totalScore += 12;
    reasons.push(`Specific brand match detected: ${sharedBrands.join(', ').toUpperCase()}`);
  }

  const sharedColors = lostAttr.colors.filter((c) => foundAttr.colors.includes(c));
  if (sharedColors.length > 0) {
    totalScore += 8;
    reasons.push(`Matching color attributes: ${sharedColors.join(', ')}`);
  }

  // 3. Location Proximity (Weight: 25%)
  const distanceKm = calculateHaversineDistance(
    lostItem.coordinates.lat,
    lostItem.coordinates.lng,
    foundItem.coordinates.lat,
    foundItem.coordinates.lng
  );

  if (lostItem.area === foundItem.area) {
    totalScore += 15;
    reasons.push(`Same Chennai neighborhood: ${lostItem.area}`);
  }

  if (distanceKm <= 1.5) {
    totalScore += 10;
    reasons.push(`Very close proximity: Within ${distanceKm} km radius`);
  } else if (distanceKm <= 5.0) {
    totalScore += 6;
    reasons.push(`Nearby location: ${distanceKm} km away`);
  } else if (distanceKm <= 12.0) {
    totalScore += 2;
  }

  // 4. Temporal Consistency (Weight: 15%)
  const lostDate = new Date(lostItem.date).getTime();
  const foundDate = new Date(foundItem.date).getTime();
  const diffDays = Math.round((foundDate - lostDate) / (1000 * 60 * 60 * 24));

  // Ideally found on or after lost date, or within 1 day (due to late reporting)
  if (diffDays >= -1 && diffDays <= 3) {
    totalScore += 15;
    reasons.push(`Close timeline: Found within 72 hours of loss report`);
  } else if (diffDays > 3 && diffDays <= 14) {
    totalScore += 10;
    reasons.push(`Chronologically consistent: Found ${diffDays} days after loss`);
  } else if (diffDays > 14 && diffDays <= 45) {
    totalScore += 4;
  } else if (diffDays < -3) {
    // Found well before lost date is improbable
    totalScore -= 20;
  }

  // Normalize score between 0 and 99%
  const finalScore = Math.min(98, Math.max(0, Math.round(totalScore)));

  return {
    score: finalScore,
    reasons,
    distanceKm,
    dateDiffDays: Math.abs(diffDays),
  };
}

/**
 * Finds all candidate matches for a single item against a full item pool.
 */
export function findMatchesForItem(targetItem: Item, allItems: Item[], minScore = 40): MatchResult[] {
  const matches: MatchResult[] = [];

  for (const item of allItems) {
    if (item.id === targetItem.id) continue;
    if (item.type === targetItem.type) continue; // Must be opposite type
    if (item.status === 'resolved') continue;

    const lost = targetItem.type === 'lost' ? targetItem : item;
    const found = targetItem.type === 'found' ? targetItem : item;

    const { score, reasons, distanceKm, dateDiffDays } = compareLostAndFoundItems(lost, found);

    if (score >= minScore) {
      matches.push({
        id: `match-${lost.id}-${found.id}`,
        lostItem: lost,
        foundItem: found,
        score,
        reasons,
        distanceKm,
        dateDiffDays,
        matchLevel: score >= 80 ? 'High' : score >= 60 ? 'Moderate' : 'Possible',
      });
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Scans the entire dataset for cross matches between all active lost and found items.
 */
export function scanAllMatches(allItems: Item[], minScore = 45): MatchResult[] {
  const lostItems = allItems.filter((i) => i.type === 'lost' && i.status === 'active');
  const foundItems = allItems.filter((i) => i.type === 'found' && i.status === 'active');

  const results: MatchResult[] = [];

  for (const lost of lostItems) {
    for (const found of foundItems) {
      const { score, reasons, distanceKm, dateDiffDays } = compareLostAndFoundItems(lost, found);
      if (score >= minScore) {
        results.push({
          id: `match-${lost.id}-${found.id}`,
          lostItem: lost,
          foundItem: found,
          score,
          reasons,
          distanceKm,
          dateDiffDays,
          matchLevel: score >= 80 ? 'High' : score >= 60 ? 'Moderate' : 'Possible',
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
