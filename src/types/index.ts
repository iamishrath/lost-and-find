export type ItemType = 'lost' | 'found';

export type ItemCategory = 
  | 'electronics' 
  | 'wallets' 
  | 'keys' 
  | 'documents' 
  | 'jewellery' 
  | 'bags' 
  | 'pets' 
  | 'vehicles' 
  | 'clothing' 
  | 'other';

export type ChennaiArea =
  | 'T. Nagar'
  | 'Anna Nagar'
  | 'Velachery'
  | 'Tambaram'
  | 'Guindy'
  | 'Adyar'
  | 'Chennai Central'
  | 'Mylapore'
  | 'Besant Nagar'
  | 'OMR / Sholinganallur'
  | 'Porur'
  | 'Koyambedu'
  | 'Nungambakkam'
  | 'Egmore'
  | 'Saidapet'
  | 'Kodambakkam'
  | 'Thiruvanmiyur'
  | 'Chromepet'
  | 'Perambur'
  | 'Pallavaram';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  category: ItemCategory;
  description: string;
  imageUrl: string;
  date: string; // YYYY-MM-DD
  area: ChennaiArea;
  locationDescription: string;
  coordinates: Coordinates;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'active' | 'resolved';
  createdAt: string;
  verificationQuestion?: string;
  reward?: string;
  identifyingMarks?: string;
  contactPreference?: 'chat' | 'verified_only';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phoneMasked?: string;
  area: ChennaiArea;
  joinedDate: string;
  verified: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
  isVerificationPrompt?: boolean;
  isResolvedNotification?: boolean;
}

export interface Conversation {
  id: string;
  itemId: string;
  itemTitle: string;
  itemType: ItemType;
  itemImage: string;
  participant1Id: string;
  participant1Name: string;
  participant2Id: string;
  participant2Name: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount?: number;
}

export interface MatchResult {
  id: string;
  lostItem: Item;
  foundItem: Item;
  score: number; // 0 to 100
  reasons: string[];
  distanceKm: number;
  dateDiffDays: number;
  matchLevel: 'High' | 'Moderate' | 'Possible';
}

export interface SafeLocation {
  id: string;
  name: string;
  area: ChennaiArea;
  address: string;
  coordinates: Coordinates;
  type: 'police_station' | 'metro_station' | 'railway_rpf' | 'bus_terminus';
  timings: string;
  contactNumber: string;
  recommendationReason: string;
}
