import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, UserProfile, Item } from '../types';
import { 
  getConversationsForUser, 
  getMessages, 
  sendMessage, 
  updateItemStatus 
} from '../lib/supabase';
import { 
  Send, 
  ShieldAlert, 
  ShieldCheck, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Flag, 
  Ban, 
  MapPin, 
  MessageSquare,
  Search,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MessagesViewProps {
  currentUser: UserProfile;
  initialConversationId?: string;
  onSelectItem: (item: Item) => void;
  allItems: Item[];
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  currentUser,
  initialConversationId,
  onSelectItem,
  allItems,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(initialConversationId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [blockedUsers, setBlockedUsers] = useState<Set<string>>(new Set());
  const [showBlockNotice, setShowBlockNotice] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user conversations
  const loadConversations = () => {
    const userConvos = getConversationsForUser(currentUser.id);
    setConversations(userConvos);
    if (!activeConvoId && userConvos.length > 0) {
      setActiveConvoId(userConvos[0].id);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [currentUser.id]);

  useEffect(() => {
    if (initialConversationId) {
      setActiveConvoId(initialConversationId);
    }
  }, [initialConversationId]);

  // Load active messages
  useEffect(() => {
    if (!activeConvoId) {
      setMessages([]);
      return;
    }

    const msgs = getMessages(activeConvoId);
    setMessages(msgs);

    const handleNewMessage = (e: any) => {
      if (e.detail?.conversationId === activeConvoId) {
        setMessages((prev) => [...prev, e.detail]);
      }
    };

    window.addEventListener('message-sent', handleNewMessage);
    return () => window.removeEventListener('message-sent', handleNewMessage);
  }, [activeConvoId]);

  // Scroll to bottom on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeConversation = conversations.find((c) => c.id === activeConvoId);
  const activeItem = allItems.find((i) => i.id === activeConversation?.itemId);

  const otherParticipantName =
    activeConversation?.participant1Id === currentUser.id
      ? activeConversation?.participant2Name
      : activeConversation?.participant1Name;

  const otherParticipantId =
    activeConversation?.participant1Id === currentUser.id
      ? activeConversation?.participant2Id
      : activeConversation?.participant1Id;

  const isOtherUserBlocked = otherParticipantId ? blockedUsers.has(otherParticipantId) : false;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvoId || isOtherUserBlocked) return;

    sendMessage(activeConvoId, currentUser, inputText.trim());
    setInputText('');
    loadConversations();
  };

  // Helper action: Send verification question prompt
  const handleSendVerificationPrompt = () => {
    if (!activeConvoId || !activeItem) return;
    const promptText = activeItem.verificationQuestion
      ? `Verification Question: "${activeItem.verificationQuestion}". Please answer this accurately to confirm ownership.`
      : `Verification check: Could you please describe any unique marks, scratches, or details inside to confirm you are the rightful owner?`;

    sendMessage(activeConvoId, currentUser, promptText, { isVerificationPrompt: true });
    loadConversations();
  };

  // Helper action: Confirm reunion & celebrate
  const handleConfirmReunion = () => {
    if (!activeConvoId || !activeItem) return;
    updateItemStatus(activeItem.id, 'resolved');

    sendMessage(
      activeConvoId,
      currentUser,
      `🎉 Wonderful news! We have successfully coordinated and reunited this item in Chennai. Marked as resolved.`,
      { isResolvedNotification: true }
    );

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    loadConversations();
  };

  const handleBlockUser = () => {
    if (!otherParticipantId) return;
    setBlockedUsers((prev) => new Set([...prev, otherParticipantId]));
    setShowBlockNotice(true);
  };

  const handleReportUser = () => {
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setShowReportDialog(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Safety Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <strong>Private & Masked Communication:</strong> Personal phone numbers and home addresses are never shown.
            Never transfer money via UPI QR codes, courier fees, or disclose OTPs.
          </div>
        </div>
        <span className="hidden md:inline-block px-2.5 py-1 rounded bg-amber-200/60 font-bold text-[10px] uppercase">
          Safe Mode Active
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
        {/* Left Column: Conversations List */}
        <div className="md:col-span-4 border-r border-slate-200 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-200 bg-white">
              <h2 className="font-extrabold text-slate-900 text-base">In-App Messages</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Secure messages for lost & found items</p>
            </div>

            {/* Convo List */}
            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[520px]">
              {conversations.length > 0 ? (
                conversations.map((convo) => {
                  const isActive = convo.id === activeConvoId;
                  const otherName =
                    convo.participant1Id === currentUser.id
                      ? convo.participant2Name
                      : convo.participant1Name;

                  return (
                    <div
                      key={convo.id}
                      onClick={() => setActiveConvoId(convo.id)}
                      className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${
                        isActive ? 'bg-teal-50/80 border-l-4 border-teal-600' : 'hover:bg-slate-100/70'
                      }`}
                    >
                      <img
                        src={convo.itemImage}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover bg-slate-200 flex-shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-slate-900 text-xs truncate">{otherName}</h4>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                            convo.itemType === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-700'
                          }`}>
                            {convo.itemType}
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-700 truncate mt-0.5">
                          {convo.itemTitle}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {convo.lastMessage || 'Conversation active'}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                  <p>No messages yet. Open an item card to initiate a safe chat with the owner or finder.</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 border-t border-slate-200 bg-white text-[11px] text-slate-500 text-center">
            Signed in as: <strong className="text-slate-800">{currentUser.name}</strong>
          </div>
        </div>

        {/* Right Column: Chat Thread */}
        <div className="md:col-span-8 flex flex-col justify-between bg-white">
          {activeConversation ? (
            <>
              {/* Chat Thread Header */}
              <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    {otherParticipantName?.[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{otherParticipantName}</h3>
                      <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Masked Contact
                      </span>
                    </div>
                    {activeItem && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 truncate">
                        <span>Regarding: <strong className="text-slate-800">{activeItem.title}</strong></span>
                        <span>•</span>
                        <span>📍 {activeItem.area}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions: Reunited, Block, Report */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {activeItem && (
                    <button
                      type="button"
                      onClick={handleConfirmReunion}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Confirm Reunited</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowReportDialog(true)}
                    title="Report conversation"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleBlockUser}
                    title="Block user"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Item Context Ribbon */}
              {activeItem && (
                <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-700">
                  <div className="flex items-center gap-2 truncate">
                    <img src={activeItem.imageUrl} alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate">{activeItem.title} ({activeItem.locationDescription})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectItem(activeItem)}
                    className="text-teal-700 font-bold hover:underline flex items-center gap-1 flex-shrink-0"
                  >
                    <span>View Listing</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Message List */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[380px] space-y-4 flex-1 bg-slate-50/30">
                {messages.map((msg) => {
                  const isMine = msg.senderId === currentUser.id;

                  if (msg.isResolvedNotification) {
                    return (
                      <div key={msg.id} className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center text-xs font-semibold space-y-1">
                        <Sparkles className="w-5 h-5 mx-auto text-emerald-600 animate-bounce" />
                        <div>{msg.text}</div>
                        <div className="text-[10px] text-emerald-600">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                        <span>{isMine ? 'You' : msg.senderName}</span>
                        <span>•</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                          isMine
                            ? 'bg-teal-600 text-white rounded-br-sm'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                        } ${msg.isVerificationPrompt ? 'ring-2 ring-amber-400/80 bg-amber-50 text-amber-950 font-medium' : ''}`}
                      >
                        {msg.isVerificationPrompt && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 mb-1">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Ownership Verification Prompt</span>
                          </div>
                        )}
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Verification quick button */}
              <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleSendVerificationPrompt}
                  className="px-3 py-1 rounded-lg bg-white border border-slate-300 hover:bg-teal-50 hover:text-teal-700 text-slate-700 text-[11px] font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>Send Secret Verification Question</span>
                </button>

                <span className="text-[11px] text-slate-500">
                  Recommended meetup spot: <strong>T. Nagar R1 / Chennai Central RPF</strong>
                </span>
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  disabled={isOtherUserBlocked}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isOtherUserBlocked
                      ? 'You have blocked this participant.'
                      : 'Type a secure message (arrange safe handover, answer verification question)...'
                  }
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  disabled={isOtherUserBlocked || !inputText.trim()}
                  className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 my-auto space-y-2">
              <MessageSquare className="w-12 h-12 mx-auto text-slate-300" />
              <h3 className="font-bold text-slate-700 text-base">Select a conversation</h3>
              <p className="text-xs">Select any thread on the left or contact someone from an item card.</p>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {showReportDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Report Participant</h3>
            <p className="text-slate-600">
              Report this user for requesting unauthorized upfront money, sharing inappropriate content, or suspicious activity.
            </p>
            {reportSuccess ? (
              <div className="p-2 rounded bg-emerald-50 text-emerald-800 text-center font-bold">
                ✓ Report submitted to Chennai Safety team.
              </div>
            ) : (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowReportDialog(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportUser}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold"
                >
                  Confirm Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
