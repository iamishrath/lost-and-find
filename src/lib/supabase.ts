import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Item, Conversation, Message, UserProfile, ChennaiArea } from '../types';

// Storage keys
const STORAGE_ITEMS_KEY = 'lost_found_chennai_items_v2';
const STORAGE_CONVOS_KEY = 'lost_found_chennai_convos_v2';
const STORAGE_MESSAGES_KEY = 'lost_found_chennai_messages_v2';
const STORAGE_USER_KEY = 'lost_found_chennai_current_user_v2';
const STORAGE_CONFIG_KEY = 'lost_found_chennai_supabase_config_v2';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

// Default initial mock users
export const DEMO_USERS: UserProfile[] = [
  {
    id: 'usr-karthik',
    name: 'Karthik Raja',
    email: 'karthik.it@chennai.edu',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    phoneMasked: '+91 9840X XXX12',
    area: 'Velachery',
    joinedDate: '2026-08-15',
    verified: true,
  },
  {
    id: 'usr-priya',
    name: 'Priya Sundaram',
    email: 'priya.sundaram@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    phoneMasked: '+91 9444X XXX78',
    area: 'T. Nagar',
    joinedDate: '2026-09-02',
    verified: true,
  },
  {
    id: 'usr-murugan',
    name: 'Murugan V (Driver Partner)',
    email: 'murugan.auto@yahoo.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    phoneMasked: '+91 9791X XXX54',
    area: 'Chennai Central',
    joinedDate: '2026-07-20',
    verified: true,
  },
  {
    id: 'usr-deepa',
    name: 'Deepa Lakshmi',
    email: 'deepa.lakshmi@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    phoneMasked: '+91 9884X XXX33',
    area: 'Anna Nagar',
    joinedDate: '2026-09-10',
    verified: true,
  },
];

// High-fidelity seed items across Chennai
const INITIAL_SEED_ITEMS: Item[] = [
  {
    id: 'item-1',
    type: 'lost',
    title: 'Apple iPhone 14 (Midnight Blue, 128GB)',
    category: 'electronics',
    description: 'Lost my midnight blue iPhone 14 with a clear Spigen back cover. Lockscreen has a picture of Marina Beach lighthouse. Battery was at 45% when lost. Has my college study notes inside.',
    imageUrl: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=800&q=80',
    date: '2026-10-07',
    area: 'Chennai Central',
    locationDescription: 'Platform 4 passenger waiting hall near the IRCTC tea kiosk.',
    coordinates: { lat: 13.0827, lng: 80.2755 },
    userId: 'usr-karthik',
    userName: 'Karthik Raja',
    userEmail: 'karthik.it@chennai.edu',
    status: 'active',
    createdAt: '2026-10-07T14:20:00Z',
    reward: '₹2,000 & deep gratitude',
    identifyingMarks: 'Small scratch near camera bump, Marina Beach wallpaper',
    contactPreference: 'chat',
  },
  {
    id: 'item-2',
    type: 'found',
    title: 'Apple iPhone in transparent bumper case',
    category: 'electronics',
    description: 'Found a dark blue Apple smartphone lying on the metal bench near the Chennai Central suburban line exit. Switched on, locked with PIN code.',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02543?auto=format&fit=crop&w=800&q=80',
    date: '2026-10-07',
    area: 'Chennai Central',
    locationDescription: 'Platform 4 waiting bench, handed safe custody to Railway Helpdesk supervisor.',
    coordinates: { lat: 13.0831, lng: 80.2760 },
    userId: 'usr-murugan',
    userName: 'Murugan V (Driver Partner)',
    userEmail: 'murugan.auto@yahoo.com',
    status: 'active',
    createdAt: '2026-10-07T16:45:00Z',
    verificationQuestion: 'What picture is set on the lockscreen wallpaper?',
    contactPreference: 'chat',
  },
  {
    id: 'item-3',
    type: 'lost',
    title: 'Titan Men Brown Leather Bi-fold Wallet',
    category: 'wallets',
    description: 'Lost my dark brown leather wallet containing Tamil Nadu driving license, SBI debit card, and Chennai Metro travel pass in name of Priya S.',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    date: '2026-10-08',
    area: 'T. Nagar',
    locationDescription: 'While walking from Panagal Park to Ranganathan Street Saravana Stores.',
    coordinates: { lat: 13.0418, lng: 80.2341 },
    userId: 'usr-priya',
    userName: 'Priya Sundaram',
    userEmail: 'priya.sundaram@gmail.com',
    status: 'active',
    createdAt: '2026-10-08T11:15:00Z',
    reward: '₹1,000 for returning cards safely',
    identifyingMarks: 'White stitch border, silver Titan metal logo',
    contactPreference: 'chat',
  },
  {
    id: 'item-4',
    type: 'found',
    title: 'Brown leather wallet with Chennai Metro Smart Card',
    category: 'wallets',
    description: 'Found brown gents wallet dropped on pavement near Usman Road flyover entry. Contains bank cards and metro smart card. Safe with shopkeeper at Usman road.',
    imageUrl: 'https://images.unsplash.com/photo-1556774687-0e2fdd0116c0?auto=format&fit=crop&w=800&q=80',
    date: '2026-10-08',
    area: 'T. Nagar',
    locationDescription: 'Near Panagal Park auto rickshaw stand, Usman Road corner.',
    coordinates: { lat: 13.0425, lng: 80.2345 },
    userId: 'usr-deepa',
    userName: 'Deepa Lakshmi',
    userEmail: 'deepa.lakshmi@gmail.com',
    status: 'active',
    createdAt: '2026-10-08T13:30:00Z',
    verificationQuestion: 'What is the full name printed on the driving license inside?',
    contactPreference: 'chat',
  },
  {
    id: 'item-5',
    type: 'lost',
    title: 'Wildcraft Black College Backpack (15.6" Laptop Inside)',
    category: 'bags',
    description: 'Black Wildcraft waterproof college bag containing HP Pavilion laptop (Grey), engineering semester 4 notebooks, and blue Tupperware water bottle.',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    date: '2026-10-06',
    area: 'Velachery',
    locationDescription: 'Phoenix Marketcity ground floor food court / basement bike parking.',
    coordinates: { lat: 12.9815, lng: 80.2180 },
    userId: 'usr-karthik',
    userName: 'Karthik Raja',
    userEmail: 'karthik.it@chennai.edu',
    status: 'active',
    createdAt: '2026-10-06T19:00:00Z',
    reward: '₹3,000 reward (project files are critical)',
    identifyingMarks: 'Yellow reflective band on zipper, stickers of GitHub and Linux on laptop',
    contactPreference: 'chat',
  },
  {
    id: 'item-6',
    type: 'found',
    title: 'Wildcraft backpack with HP laptop charger',
    category: 'bags',
    description: 'Found unattended black Wildcraft backpack on a dining chair at Phoenix Marketcity food court. Deposited with Mall Security Desk (Customer service counter).',
    imageUrl: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=800&q=80',
    date: '2026-10-06',
    area: 'Velachery',
    locationDescription: 'Deposited at Customer Service Desk, Ground Floor Phoenix Marketcity.',
    coordinates: { lat: 12.9812, lng: 80.2175 },
    userId: 'usr-priya',
    userName: 'Priya Sundaram',
    userEmail: 'priya.sundaram@gmail.com',
    status: 'active',
    createdAt: '2026-10-06T20:30:00Z',
    verificationQuestion: 'What stickers are attached to the laptop lid?',
    contactPreference: 'chat',
  },
  {
    id: 'item-7',
    type: 'lost',
    title: 'Anna University Student ID Card & Key Ring',
    category: 'documents',
    description: 'College lanyard with blue strap holding Anna University B.Tech ID badge and two bike keys with a brass keychain.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    date: '2026-10-05',
    area: 'Guindy',
    locationDescription: 'Near Guindy Kathipara bus bay while boarding 21G bus towards Broadway.',
    coordinates: { lat: 13.0067, lng: 80.2025 },
    userId: 'usr-karthik',
    userName: 'Karthik Raja',
    userEmail: 'karthik.it@chennai.edu',
    status: 'active',
    createdAt: '2026-10-05T09:10:00Z',
    reward: '₹500',
    identifyingMarks: 'Department of IT stamp on the back',
    contactPreference: 'chat',
  },
  {
    id: 'item-8',
    type: 'found',
    title: 'Honda Activa Bike Key with Red Bell Keychain',
    category: 'keys',
    description: 'Single Honda motorcycle key attached to a small decorative brass bell and red woven string.',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    date: '2026-10-07',
    area: 'Besant Nagar',
    locationDescription: 'Elliot Beach promenade sitting wall near police patrol booth.',
    coordinates: { lat: 13.0008, lng: 80.2670 },
    userId: 'usr-deepa',
    userName: 'Deepa Lakshmi',
    userEmail: 'deepa.lakshmi@gmail.com',
    status: 'active',
    createdAt: '2026-10-07T18:00:00Z',
    verificationQuestion: 'What letter is embossed on the key handle?',
    contactPreference: 'chat',
  },
  {
    id: 'item-9',
    type: 'lost',
    title: 'Fossil Gen 6 Smartwatch (Smoky Black Strap)',
    category: 'jewellery',
    description: 'Fossil Gen 6 stainless steel case smartwatch with black silicone sport strap. Display has minor scratch on upper bezel.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    date: '2026-10-04',
    area: 'Anna Nagar',
    locationDescription: 'Anna Nagar Tower Park jogging track during morning walk around 6:30 AM.',
    coordinates: { lat: 13.0850, lng: 80.2101 },
    userId: 'usr-priya',
    userName: 'Priya Sundaram',
    userEmail: 'priya.sundaram@gmail.com',
    status: 'active',
    createdAt: '2026-10-04T08:00:00Z',
    reward: '₹1,500',
    identifyingMarks: 'Serial code ends in 8941',
    contactPreference: 'chat',
  },
  {
    id: 'item-10',
    type: 'found',
    title: 'Smart Fitness Wristwatch (Black Silicone Band)',
    category: 'jewellery',
    description: 'Found a black touchscreen smartwatch near 3rd Avenue bus stop bench in Anna Nagar.',
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    date: '2026-10-04',
    area: 'Anna Nagar',
    locationDescription: '3rd Avenue, Near Anna Nagar Roundtana bus shelter.',
    coordinates: { lat: 13.0855, lng: 80.2110 },
    userId: 'usr-deepa',
    userName: 'Deepa Lakshmi',
    userEmail: 'deepa.lakshmi@gmail.com',
    status: 'active',
    createdAt: '2026-10-04T10:15:00Z',
    verificationQuestion: 'What brand name is etched on the buckle of the strap?',
    contactPreference: 'chat',
  },
];

// Initial seed conversation
const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    itemId: 'item-2',
    itemTitle: 'Apple iPhone in transparent bumper case',
    itemType: 'found',
    itemImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02543?auto=format&fit=crop&w=800&q=80',
    participant1Id: 'usr-karthik',
    participant1Name: 'Karthik Raja',
    participant2Id: 'usr-murugan',
    participant2Name: 'Murugan V (Driver Partner)',
    lastMessage: 'Vanakkam Murugan sir! I think that is my lost iPhone 14. The wallpaper is indeed Marina Beach lighthouse at sunset!',
    updatedAt: '2026-10-07T17:15:00Z',
    unreadCount: 0,
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'usr-murugan',
    senderName: 'Murugan V (Driver Partner)',
    text: 'Vanakkam! I found this iPhone at Central Station Platform 4. To make sure it is yours, what is set as the lockscreen wallpaper?',
    createdAt: '2026-10-07T17:00:00Z',
    isVerificationPrompt: true,
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'usr-karthik',
    senderName: 'Karthik Raja',
    text: 'Vanakkam Murugan sir! I think that is my lost iPhone 14. The wallpaper is indeed Marina Beach lighthouse at sunset! Also has a small scratch near top right.',
    createdAt: '2026-10-07T17:15:00Z',
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'usr-murugan',
    senderName: 'Murugan V (Driver Partner)',
    text: 'Yes தம்பி! The lockscreen photo exactly matches Marina lighthouse! I have deposited it at the Chennai Central RPF Railway Police Helpdesk. You can collect it there safely with your ID proof.',
    createdAt: '2026-10-07T17:25:00Z',
  },
];

// Helpers for localStorage sync
function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    if (!val) return fallback;
    return JSON.parse(val);
  } catch (err) {
    console.error(`Error reading storage key ${key}:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing storage key ${key}:`, err);
  }
}

// Global Supabase Client instance (dynamically configured)
let supabaseClient: SupabaseClient | null = null;

export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const stored = getFromStorage<SupabaseConfig>(STORAGE_CONFIG_KEY, {
    url: envUrl,
    anonKey: envKey,
    isConnected: Boolean(envUrl && envKey),
  });

  return stored;
}

export function saveSupabaseConfig(url: string, anonKey: string): SupabaseConfig {
  const isConnected = Boolean(url.trim() && anonKey.trim());
  const config: SupabaseConfig = {
    url: url.trim(),
    anonKey: anonKey.trim(),
    isConnected,
  };
  saveToStorage(STORAGE_CONFIG_KEY, config);
  
  if (isConnected) {
    try {
      supabaseClient = createClient(config.url, config.anonKey);
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      config.isConnected = false;
    }
  } else {
    supabaseClient = null;
  }

  // Notify listeners
  window.dispatchEvent(new CustomEvent('supabase-config-changed', { detail: config }));
  return config;
}

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;
  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      supabaseClient = createClient(config.url, config.anonKey);
      return supabaseClient;
    } catch {
      return null;
    }
  }
  return null;
}

// App data access APIs
export function getStoredItems(): Item[] {
  const items = getFromStorage<Item[]>(STORAGE_ITEMS_KEY, []);
  if (items.length === 0) {
    saveToStorage(STORAGE_ITEMS_KEY, INITIAL_SEED_ITEMS);
    return INITIAL_SEED_ITEMS;
  }
  return items;
}

export function saveItem(newItem: Omit<Item, 'id' | 'createdAt' | 'status'> & { id?: string }): Item {
  const items = getStoredItems();
  const item: Item = {
    id: newItem.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: newItem.type,
    title: newItem.title,
    category: newItem.category,
    description: newItem.description,
    imageUrl: newItem.imageUrl,
    date: newItem.date,
    area: newItem.area,
    locationDescription: newItem.locationDescription,
    coordinates: newItem.coordinates,
    userId: newItem.userId,
    userName: newItem.userName,
    userEmail: newItem.userEmail,
    status: 'active',
    createdAt: new Date().toISOString(),
    reward: newItem.reward,
    verificationQuestion: newItem.verificationQuestion,
    identifyingMarks: newItem.identifyingMarks,
    contactPreference: newItem.contactPreference || 'chat',
  };

  const updated = [item, ...items];
  saveToStorage(STORAGE_ITEMS_KEY, updated);

  // Dispatch custom reactive event for instant UI update
  window.dispatchEvent(new CustomEvent('items-updated', { detail: item }));

  // Also push to Supabase if configured
  const client = getSupabaseClient();
  if (client) {
    client.from('items').insert({
      id: item.id,
      user_id: item.userId,
      type: item.type,
      title: item.title,
      category: item.category,
      description: item.description,
      image_url: item.imageUrl,
      date_occurred: item.date,
      area: item.area,
      location_description: item.locationDescription,
      latitude: item.coordinates.lat,
      longitude: item.coordinates.lng,
      status: item.status,
      reward: item.reward,
      verification_question: item.verificationQuestion,
    }).then(({ error }) => {
      if (error) console.warn('Supabase items sync error:', error);
    });
  }

  return item;
}

export function updateItemStatus(itemId: string, status: 'active' | 'resolved'): void {
  const items = getStoredItems();
  const updated = items.map((i) => (i.id === itemId ? { ...i, status } : i));
  saveToStorage(STORAGE_ITEMS_KEY, updated);
  window.dispatchEvent(new CustomEvent('items-updated'));

  const client = getSupabaseClient();
  if (client) {
    client.from('items').update({ status }).eq('id', itemId).then();
  }
}

export function deleteItem(itemId: string): void {
  const items = getStoredItems();
  const updated = items.filter((i) => i.id !== itemId);
  saveToStorage(STORAGE_ITEMS_KEY, updated);
  window.dispatchEvent(new CustomEvent('items-updated'));

  const client = getSupabaseClient();
  if (client) {
    client.from('items').delete().eq('id', itemId).then();
  }
}

export function getCurrentUser(): UserProfile {
  const stored = getFromStorage<UserProfile>(STORAGE_USER_KEY, DEMO_USERS[0]);
  return stored;
}

export function setCurrentUser(user: UserProfile): void {
  saveToStorage(STORAGE_USER_KEY, user);
  window.dispatchEvent(new CustomEvent('user-changed', { detail: user }));
}

export function getConversationsForUser(userId: string): Conversation[] {
  const convos = getFromStorage<Conversation[]>(STORAGE_CONVOS_KEY, []);
  if (convos.length === 0) {
    saveToStorage(STORAGE_CONVOS_KEY, INITIAL_CONVERSATIONS);
    return INITIAL_CONVERSATIONS.filter(
      (c) => c.participant1Id === userId || c.participant2Id === userId
    );
  }
  return convos.filter(
    (c) => c.participant1Id === userId || c.participant2Id === userId
  );
}

export function getMessages(conversationId: string): Message[] {
  const msgs = getFromStorage<Message[]>(STORAGE_MESSAGES_KEY, []);
  if (msgs.length === 0) {
    saveToStorage(STORAGE_MESSAGES_KEY, INITIAL_MESSAGES);
    return INITIAL_MESSAGES.filter((m) => m.conversationId === conversationId);
  }
  return msgs.filter((m) => m.conversationId === conversationId);
}

export function sendMessage(
  conversationId: string,
  sender: UserProfile,
  text: string,
  options?: { isVerificationPrompt?: boolean; isResolvedNotification?: boolean }
): Message {
  const msgs = getFromStorage<Message[]>(STORAGE_MESSAGES_KEY, INITIAL_MESSAGES);
  const newMsg: Message = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    conversationId,
    senderId: sender.id,
    senderName: sender.name,
    text,
    createdAt: new Date().toISOString(),
    isVerificationPrompt: options?.isVerificationPrompt,
    isResolvedNotification: options?.isResolvedNotification,
  };

  const updatedMsgs = [...msgs, newMsg];
  saveToStorage(STORAGE_MESSAGES_KEY, updatedMsgs);

  // Update conversation last message
  const convos = getFromStorage<Conversation[]>(STORAGE_CONVOS_KEY, INITIAL_CONVERSATIONS);
  const updatedConvos = convos.map((c) =>
    c.id === conversationId
      ? { ...c, lastMessage: text, updatedAt: new Date().toISOString() }
      : c
  );
  saveToStorage(STORAGE_CONVOS_KEY, updatedConvos);

  window.dispatchEvent(new CustomEvent('message-sent', { detail: newMsg }));

  // Supabase sync if enabled
  const client = getSupabaseClient();
  if (client) {
    client.from('messages').insert({
      id: newMsg.id,
      conversation_id: conversationId,
      sender_id: sender.id,
      text: newMsg.text,
      is_verification_prompt: Boolean(newMsg.isVerificationPrompt),
      is_resolved_notification: Boolean(newMsg.isResolvedNotification),
    }).then();
  }

  return newMsg;
}

export function createOrGetConversation(
  item: Item,
  currentUser: UserProfile,
  targetUserId: string,
  targetUserName: string
): Conversation {
  const convos = getFromStorage<Conversation[]>(STORAGE_CONVOS_KEY, INITIAL_CONVERSATIONS);
  const existing = convos.find(
    (c) =>
      c.itemId === item.id &&
      ((c.participant1Id === currentUser.id && c.participant2Id === targetUserId) ||
        (c.participant1Id === targetUserId && c.participant2Id === currentUser.id))
  );

  if (existing) return existing;

  const newConvo: Conversation = {
    id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    itemId: item.id,
    itemTitle: item.title,
    itemType: item.type,
    itemImage: item.imageUrl,
    participant1Id: currentUser.id,
    participant1Name: currentUser.name,
    participant2Id: targetUserId,
    participant2Name: targetUserName,
    lastMessage: 'Conversation opened regarding this item.',
    updatedAt: new Date().toISOString(),
    unreadCount: 0,
  };

  const updated = [newConvo, ...convos];
  saveToStorage(STORAGE_CONVOS_KEY, updated);
  window.dispatchEvent(new CustomEvent('conversations-updated', { detail: newConvo }));
  return newConvo;
}

export function resetDemoData(): void {
  localStorage.removeItem(STORAGE_ITEMS_KEY);
  localStorage.removeItem(STORAGE_CONVOS_KEY);
  localStorage.removeItem(STORAGE_MESSAGES_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
  window.dispatchEvent(new CustomEvent('items-updated'));
}
