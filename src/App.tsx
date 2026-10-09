/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Item, UserProfile, MatchResult } from './types';
import { 
  getStoredItems, 
  getCurrentUser, 
  setCurrentUser, 
  getConversationsForUser, 
  getSupabaseConfig,
  createOrGetConversation 
} from './lib/supabase';
import { scanAllMatches } from './lib/matching';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SupabaseModal } from './components/SupabaseModal';

// Views
import { HomeView } from './views/HomeView';
import { BrowseItemsView } from './views/BrowseItemsView';
import { ReportItemView } from './views/ReportItemView';
import { ItemDetailsView } from './views/ItemDetailsView';
import { PossibleMatchesView } from './views/PossibleMatchesView';
import { MessagesView } from './views/MessagesView';
import { DashboardView } from './views/DashboardView';
import { InteractiveMapView } from './views/InteractiveMapView';
import { SafetyView } from './views/SafetyView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { AuthView } from './views/AuthView';

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [currentUser, setCurUser] = useState<UserProfile>(getCurrentUser());
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<any>({});
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);

  // Refresh items from store
  const refreshItems = () => {
    const loaded = getStoredItems();
    setItems(loaded);
  };

  // Initial load & reactive listener setup
  useEffect(() => {
    refreshItems();
    const config = getSupabaseConfig();
    setIsSupabaseConnected(config.isConnected);

    const handleItemsUpdated = () => refreshItems();
    const handleUserChanged = (e: any) => {
      if (e.detail) setCurUser(e.detail);
    };
    const handleConfigChanged = (e: any) => {
      if (e.detail) setIsSupabaseConnected(e.detail.isConnected);
    };

    window.addEventListener('items-updated', handleItemsUpdated);
    window.addEventListener('user-changed', handleUserChanged);
    window.addEventListener('supabase-config-changed', handleConfigChanged);

    return () => {
      window.removeEventListener('items-updated', handleItemsUpdated);
      window.removeEventListener('user-changed', handleUserChanged);
      window.removeEventListener('supabase-config-changed', handleConfigChanged);
    };
  }, []);

  // Compute active AI match count
  const allMatches = scanAllMatches(items, 60);
  const userMatches = allMatches.filter(
    (m) => m.lostItem.userId === currentUser.id || m.foundItem.userId === currentUser.id
  );
  const matchNotificationCount = userMatches.length > 0 ? userMatches.length : allMatches.length;

  // Navigation handler
  const handleNavigate = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User switcher
  const handleSwitchUser = (newUser: UserProfile) => {
    setCurrentUser(newUser);
    setCurUser(newUser);
  };

  // Open item detail
  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Contact item poster (opens private chat)
  const handleOpenChat = (item: Item) => {
    if (item.userId === currentUser.id) {
      alert("This is your own listing!");
      return;
    }
    const convo = createOrGetConversation(item, currentUser, item.userId, item.userName);
    handleNavigate('messages', { conversationId: convo.id });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      {/* Primary Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        unreadCount={unreadMsgCount}
        matchCount={matchNotificationCount}
        isSupabaseConnected={isSupabaseConnected}
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            items={items}
            onNavigate={handleNavigate}
            onSelectItem={handleSelectItem}
            onContactUser={handleOpenChat}
          />
        )}

        {currentPage === 'lost' && (
          <BrowseItemsView
            items={items}
            initialType="lost"
            initialKeyword={pageParams.keyword || ''}
            initialArea={pageParams.area || 'all'}
            onSelectItem={handleSelectItem}
            onContactUser={handleOpenChat}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'found' && (
          <BrowseItemsView
            items={items}
            initialType="found"
            initialKeyword={pageParams.keyword || ''}
            initialArea={pageParams.area || 'all'}
            onSelectItem={handleSelectItem}
            onContactUser={handleOpenChat}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'browse' && (
          <BrowseItemsView
            items={items}
            initialType="all"
            initialKeyword={pageParams.keyword || ''}
            initialArea={pageParams.area || 'all'}
            onSelectItem={handleSelectItem}
            onContactUser={handleOpenChat}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'report-lost' && (
          <ReportItemView
            initialType="lost"
            currentUser={currentUser}
            allItems={items}
            onSubmitSuccess={(newItem, matches) => {
              refreshItems();
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'report-found' && (
          <ReportItemView
            initialType="found"
            currentUser={currentUser}
            allItems={items}
            onSubmitSuccess={(newItem, matches) => {
              refreshItems();
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'details' && selectedItem && (
          <ItemDetailsView
            item={selectedItem}
            currentUser={currentUser}
            allItems={items}
            onBack={() => handleNavigate(selectedItem.type === 'lost' ? 'lost' : 'found')}
            onOpenChat={handleOpenChat}
            onNavigate={handleNavigate}
            onSelectItem={handleSelectItem}
          />
        )}

        {currentPage === 'matches' && (
          <PossibleMatchesView
            items={items}
            currentUser={currentUser}
            onSelectItem={handleSelectItem}
            onOpenChat={handleOpenChat}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'messages' && (
          <MessagesView
            currentUser={currentUser}
            initialConversationId={pageParams.conversationId}
            onSelectItem={handleSelectItem}
            allItems={items}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            items={items}
            onSelectItem={handleSelectItem}
            onOpenChat={handleOpenChat}
            onNavigate={handleNavigate}
            onRefreshItems={refreshItems}
          />
        )}

        {currentPage === 'map' && (
          <InteractiveMapView
            items={items}
            onSelectItem={handleSelectItem}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'safety' && <SafetyView />}

        {currentPage === 'about' && (
          <AboutView onOpenSupabaseModal={() => setSupabaseModalOpen(true)} />
        )}

        {currentPage === 'contact' && <ContactView />}

        {currentPage === 'auth' && (
          <AuthView
            currentUser={currentUser}
            onUserAuth={(user) => {
              setCurUser(user);
            }}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
      />

      {/* Supabase & Database Architecture Modal */}
      <SupabaseModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
        onRefreshData={refreshItems}
      />
    </div>
  );
}
