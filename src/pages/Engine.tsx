import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WebGLCanvas } from '@/components/WebGL/WebGLCanvas';
import { LiveDonationFeed } from '@/components/WebGL/LiveDonationFeed';
import { SAMPLE_CAMPAIGNS, getCampaignById, addBlockToCampaign } from '@/data/campaigns';
import type { Campaign, CampaignBlock, DonationTransaction } from '@/types/campaign';
import { generateGridPositions } from '@/utils/gridGeometry';

const Engine: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'live' | 'campaigns' | 'leaderboards'>('live');
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<CampaignBlock | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<CampaignBlock | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [blockColors, setBlockColors] = useState<Record<string, string>>({});
  const [boughtBlocks, setBoughtBlocks] = useState<Record<string, string>>({});
  const [selectedMessages, setSelectedMessages] = useState<Record<string, string>>({});
  const [donorName, setDonorName] = useState('You');
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | 'bank'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [donations, setDonations] = useState<DonationTransaction[]>([]);

  const fullGridBlocks = useMemo(() => {
    if (!currentCampaign) return [];

    const positions = generateGridPositions(currentCampaign.gridShape, currentCampaign.gridSize);
    return positions.map((position) => {
      const ownedBlock = currentCampaign.blocks.find(
        (block) => block.gridX === position.gridX && block.gridY === position.gridY
      );

      if (ownedBlock) {
        return {
          ...ownedBlock,
          x: position.x,
          y: position.y,
          z: position.z,
        };
      }

      return {
        id: `open-${position.gridX}-${position.gridY}`,
        x: position.x,
        y: position.y,
        z: position.z,
        color: '#d9d9d9',
        owner: 'Available',
        message: 'Claim this spot with a message',
        amount: 120,
        timestamp: Date.now(),
        gridX: position.gridX,
        gridY: position.gridY,
      } as CampaignBlock;
    });
  }, [currentCampaign]);

  const selectedBlockObjects = fullGridBlocks.filter((block) => selectedBlocks.includes(block.id));
  const purchaseTotal = selectedBlockObjects.reduce((sum, block) => sum + block.amount, 0);

  // Initialize with first campaign
  useEffect(() => {
    if (!currentCampaign && SAMPLE_CAMPAIGNS.length > 0) {
      setCurrentCampaign(SAMPLE_CAMPAIGNS[0]);
    }
  }, []);

  const handleToggleSelect = useCallback((block: CampaignBlock) => {
    setSelectedBlock((prev) => (prev?.id === block.id ? null : block));

    if (block.owner !== 'Available') {
      return;
    }

    setSelectedBlocks((prev) => {
      const active = prev.includes(block.id);
      if (active) {
        setSelectedMessages((messages) => {
          const updated = { ...messages };
          delete updated[block.id];
          return updated;
        });
        return prev.filter((id) => id !== block.id);
      }
      return [...prev, block.id];
    });

    setBlockColors((prev) => ({
      ...prev,
      [block.id]: prev[block.id] ?? block.color,
    }));
  }, []);

  const handleColorChange = useCallback((blockId: string, color: string) => {
    setBlockColors((prev) => ({ ...prev, [blockId]: color }));
  }, []);

  const handleMessageChange = useCallback((blockId: string, message: string) => {
    setSelectedMessages((prev) => ({ ...prev, [blockId]: message }));
  }, []);

  const openPurchaseModal = useCallback(() => {
    setPurchaseModalOpen(true);
    setReceipt(null);
  }, []);

  const handleConfirmPurchase = useCallback(() => {
    if (!selectedBlockObjects.length || !currentCampaign) return;

    setIsProcessing(true);
    setTimeout(() => {
      const donor = donorName.trim() || 'You';
      const newDonations: DonationTransaction[] = selectedBlockObjects.map((block) => {
        const finalMessage = selectedMessages[block.id] ?? block.message;
        return {
          id: Math.random().toString(36),
          campaignId: currentCampaign!.id,
          amount: block.amount,
          color: blockColors[block.id] ?? block.color,
          donor,
          message: finalMessage,
          timestamp: Date.now(),
          paymentMethod,
        };
      });

      setDonations((prev) => [...prev, ...newDonations]);

      const purchased = selectedBlockObjects.reduce<Record<string, string>>((acc, block) => {
        acc[block.id] = blockColors[block.id] ?? block.color;
        return acc;
      }, {});

      setBoughtBlocks((prev) => ({ ...prev, ...purchased }));
      setSelectedBlocks([]);
      setSelectedMessages({});
      setSelectedBlock(null);
      setIsProcessing(false);
      setReceipt(
        `Payment successful with ${paymentMethod === 'card' ? 'Card' : paymentMethod === 'crypto' ? 'Crypto' : 'Bank Transfer'}. Receipt #${Math.floor(Math.random() * 900000 + 100000)}.`
      );

      // Update campaign
      let updatedCampaign = currentCampaign;
      selectedBlockObjects.forEach((block) => {
        const finalMessage = selectedMessages[block.id] ?? block.message;
        const purchasedBlock = {
          ...block,
          owner: donor,
          message: finalMessage,
        } as CampaignBlock;
        updatedCampaign = addBlockToCampaign(updatedCampaign, purchasedBlock);
      });
      setCurrentCampaign(updatedCampaign);
    }, 900);
  }, [selectedBlockObjects, currentCampaign, blockColors, selectedMessages, paymentMethod, donorName]);

  const HomeView = () => (
    <div className="flex flex-col justify-between min-h-[calc(100vh-80px)]">
      <div className="px-8 max-w-5xl mx-auto text-center pt-24">
        <h1 className="text-8xl md:text-9xl tracking-tighter lowercase mb-6 font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          buongesto.
        </h1>
        <p className="font-sans text-[12px] tracking-[0.4em] uppercase text-[#1A1A1A]/60 mb-8 max-w-2xl mx-auto">
          Collaborative fundraising where every pixel counts. Like r/place, but for causes that matter. Make your donation visible, animated, and part of something bigger.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button
            onClick={() => {
              setCurrentView('live');
              setCurrentCampaign(SAMPLE_CAMPAIGNS[0]);
            }}
            className="border-2 border-[#1A1A1A] px-8 py-4 font-mono text-[10px] uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#F5F5F3] transition-colors rounded-full"
          >
            Join Active Campaign
          </button>
          <button
            onClick={() => setCurrentView('campaigns')}
            className="border-2 border-[#1A1A1A]/30 px-8 py-4 font-mono text-[10px] uppercase tracking-widest hover:border-[#1A1A1A] transition-colors rounded-full"
          >
            Browse Campaigns
          </button>
        </div>
      </div>

      <div className="border-t border-[#1A1A1A]/10 py-12 px-8 overflow-hidden mt-24">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#1A1A1A]/40 mb-6 text-center">
          Supported by leading organizations
        </p>
        <div className="flex justify-center gap-16 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <div className="font-sans font-bold text-xl tracking-tighter">STUDIO_ALPHA</div>
          <div className="font-sans font-bold text-xl tracking-tighter">FINTECH_CORE</div>
          <div className="font-sans font-bold text-xl tracking-tighter">PONDERA</div>
        </div>
      </div>
    </div>
  );

  const LiveCanvasView = () => (
    <div className="h-[calc(100vh-80px)] w-full relative overflow-hidden flex items-center justify-center">
      {currentCampaign && <WebGLCanvas 
        blocks={fullGridBlocks}
        gridShape={currentCampaign.gridShape}
        gridSize={currentCampaign.gridSize}
        brandColor={currentCampaign.brandColor}
        onBlockClick={handleToggleSelect}
        onBlockHover={setHoveredBlock}
        selectedBlockId={selectedBlock?.id}
        boughtBlocks={boughtBlocks}
      />}

      {/* Campaign info and instructions */}
      <div className="absolute top-8 left-8 w-full max-w-sm border-2 rounded-2xl bg-[#F5F5F3]/98 backdrop-blur-md p-6 z-40 shadow-2xl" style={{ borderColor: currentCampaign?.brandColor || '#1A1A1A' }}>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] mb-2" style={{ color: currentCampaign?.brandColor }}>
          {currentCampaign?.organizer}
        </p>
        <h2 className="text-2xl font-bold mb-3 lowercase" style={{ fontFamily: "'Cormorant Garamond', serif", color: currentCampaign?.brandColor }}>
          {currentCampaign?.title}
        </h2>
        <p className="text-[12px] text-[#1A1A1A]/80 mb-4 leading-relaxed">{currentCampaign?.description}</p>

        <div className="mb-4 p-3 rounded-lg bg-white/60 border border-gray-200">
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-600 mb-2">How it works:</p>
          <ul className="text-[11px] space-y-1 text-gray-700">
            <li>✨ Click blocks to select them</li>
            <li>🎨 Choose your color in the modal</li>
            <li>💳 Complete payment simulation</li>
            <li>🎉 Your block joins the canvas</li>
          </ul>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={openPurchaseModal}
            disabled={!selectedBlocks.length}
            className="rounded-full border-2 px-4 py-2 text-[10px] uppercase tracking-widest transition-all disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              borderColor: currentCampaign?.brandColor,
              color: currentCampaign?.brandColor,
            }}
          >
            Purchase {selectedBlocks.length > 0 ? selectedBlocks.length : ''}
          </button>
          <button
            onClick={() => {
              setSelectedBlocks([]);
              setSelectedMessages({});
            }}
            disabled={!selectedBlocks.length}
            className="rounded-full border-2 border-gray-300 px-4 py-2 text-[10px] uppercase tracking-widest transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:border-gray-600"
          >
            Clear
          </button>
        </div>

        {selectedBlocks.length > 0 && (
          <div className="p-3 rounded-lg bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(135deg, ${currentCampaign?.brandColor}20, ${currentCampaign?.brandColor}10)` }}>
            <p className="text-[11px] font-semibold">Selected: {selectedBlocks.length} block{selectedBlocks.length > 1 ? 's' : ''}</p>
            <p className="text-[13px] font-bold" style={{ color: currentCampaign?.brandColor }}>
              €{purchaseTotal}
            </p>
          </div>
        )}
      </div>

      {/* Live feed */}
      {currentCampaign && (
        <LiveDonationFeed
          transactions={donations}
          totalRaised={currentCampaign.raised + donations.reduce((sum, d) => sum + d.amount, 0)}
          goal={currentCampaign.goal}
          brandColor={currentCampaign.brandColor}
        />
      )}

      {/* Info card on hover */}
      <AnimatePresence>
        {hoveredBlock && selectedBlock?.id !== hoveredBlock.id && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-8 left-8 border-2 rounded-xl bg-white p-5 max-w-sm z-40 shadow-xl"
            style={{ borderColor: hoveredBlock.color }}
          >
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">By {hoveredBlock.owner}</p>
            <p className="text-lg font-semibold mb-2 italic">"{hoveredBlock.message}"</p>
            <p className="text-[12px] text-gray-600">Amount: €{hoveredBlock.amount}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedBlock && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-8 border-2 rounded-xl bg-white p-6 max-w-sm z-50 shadow-2xl"
          style={{ borderColor: selectedBlock.color }}
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase tracking-widest text-gray-500">Block #{selectedBlock.id}</span>
            <button onClick={() => setSelectedBlock(null)} className="text-[12px] hover:text-red-600">
              ✕
            </button>
          </div>
          <p className="text-2xl leading-tight mb-4 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            "{selectedBlock.message}"
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase text-gray-500 mb-1">By {selectedBlock.owner}</p>
              <p className="text-[12px] font-semibold">€{selectedBlock.amount}</p>
            </div>
            <div className="w-12 h-12 rounded-lg shadow-md" style={{ backgroundColor: selectedBlock.color }} />
          </div>
        </motion.div>
      )}

      {/* Purchase Modal */}
      <AnimatePresence>
        {purchaseModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-3xl rounded-3xl border-2 bg-white p-8 shadow-2xl max-h-[80vh] overflow-y-auto"
              style={{ borderColor: currentCampaign?.brandColor }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">Payment Simulation</p>
                  <h3 className="text-3xl font-bold">Complete Your Donation</h3>
                </div>
                <button
                  onClick={() => setPurchaseModalOpen(false)}
                  className="text-2xl text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {receipt ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border-2 border-green-200 bg-green-50 p-8 text-center">
                  <p className="text-2xl mb-2">✨ Thank You! ✨</p>
                  <p className="text-[15px] mb-4 text-gray-700">{receipt}</p>
                  <p className="text-[13px] text-gray-600 mb-6">
                    You successfully purchased {selectedBlockObjects.length} block{selectedBlockObjects.length > 1 ? 's' : ''} for the canvas.
                  </p>
                  <button
                    onClick={() => {
                      setPurchaseModalOpen(false);
                      setReceipt(null);
                    }}
                    className="px-6 py-3 rounded-full bg-green-600 text-white font-semibold text-[12px] uppercase tracking-wider hover:bg-green-700 transition-colors"
                  >
                    See Your Blocks
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2 mb-6">
                    {/* Blocks Section */}
                    <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-600 mb-3">Selected Blocks ({selectedBlockObjects.length})</p>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {selectedBlockObjects.map((block) => (
                          <div key={block.id} className="rounded-lg bg-white p-3 border border-gray-200">
                            <div className="flex items-center justify-between gap-3 mb-3">
                              <div>
                                <p className="text-[11px] font-semibold">{block.owner}</p>
                                <p className="text-[10px] text-gray-500">"{block.message}"</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="font-mono text-[12px] font-bold">€{block.amount}</p>
                                <input
                                  type="color"
                                  value={blockColors[block.id] ?? block.color}
                                  onChange={(e) => handleColorChange(block.id, e.target.value)}
                                  className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                                />
                              </div>
                            </div>
                            <textarea
                              value={selectedMessages[block.id] ?? block.message}
                              onChange={(e) => handleMessageChange(block.id, e.target.value)}
                              placeholder="Leave your message for this piece"
                              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-[11px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                              rows={3}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Method Section */}
                    <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-600 mb-3">Your Details</p>
                      <div className="mb-4">
                        <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">Name</label>
                        <input
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/10"
                        />
                      </div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-600 mb-3">Payment Method</p>
                      <div className="space-y-2 mb-6">
                        {[
                          { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                          { id: 'crypto', label: 'Crypto Wallet', icon: '₿' },
                          { id: 'bank', label: 'Bank Transfer', icon: '🏦' },
                        ].map((option) => (
                          <label
                            key={option.id}
                            className="flex items-center gap-3 rounded-lg bg-white p-3 border-2 cursor-pointer transition-all hover:border-gray-400"
                            style={{
                              borderColor: paymentMethod === option.id ? currentCampaign?.brandColor : '#e5e7eb',
                              backgroundColor: paymentMethod === option.id ? currentCampaign?.brandColor + '10' : 'white',
                            }}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={option.id}
                              checked={paymentMethod === option.id}
                              onChange={() => setPaymentMethod(option.id as 'card' | 'crypto' | 'bank')}
                              className="w-4 h-4"
                            />
                            <span className="text-lg">{option.icon}</span>
                            <span className="text-[11px] font-semibold">{option.label}</span>
                          </label>
                        ))}
                      </div>

                      <div className="rounded-xl p-4" style={{ backgroundColor: currentCampaign?.brandColor + '15' }}>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-600 mb-2">Total Amount</p>
                        <p className="text-3xl font-bold" style={{ color: currentCampaign?.brandColor }}>
                          €{purchaseTotal}
                        </p>
                        <p className="text-[11px] text-gray-600 mt-2">
                          {selectedBlockObjects.length} block{selectedBlockObjects.length > 1 ? 's' : ''} selected
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-[11px] text-gray-600">
                      <p className="font-mono uppercase tracking-[0.2em] mb-1 text-gray-500">Simulated Payment</p>
                      <p>This is a demo. Payment and blocks are simulated but your impact is real!</p>
                    </div>
                    <button
                      onClick={handleConfirmPurchase}
                      disabled={isProcessing}
                      className="rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.3em] font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                      style={{ backgroundColor: currentCampaign?.brandColor }}
                    >
                      {isProcessing ? 'Processing...' : 'Confirm & Donate'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const CampaignsView = () => (
    <div className="min-h-[calc(100vh-80px)] p-8 bg-gradient-to-b from-[#F5F5F3] to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold mb-12 lowercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Active Campaigns
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_CAMPAIGNS.map((campaign) => (
            <motion.div
              key={campaign.id}
              whileHover={{ y: -5 }}
              className="rounded-2xl border-2 overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
              style={{ borderColor: campaign.brandColor }}
              onClick={() => {
                setCurrentCampaign(campaign);
                setCurrentView('live');
              }}
            >
              <div
                className="h-32 relative flex items-center justify-center text-white text-center p-4"
                style={{ backgroundColor: campaign.brandColor }}
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest opacity-80">{campaign.organizer}</p>
                  <h3 className="text-2xl font-bold lowercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {campaign.title}
                  </h3>
                </div>
              </div>

              <div className="p-4">
                <p className="text-[12px] text-gray-600 mb-4">{campaign.description}</p>

                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-semibold">Progress</span>
                    <span className="text-[10px] text-gray-500">{Math.round((campaign.raised / campaign.goal) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        backgroundColor: campaign.brandColor,
                        width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-[11px] mb-4">
                  <span>€{campaign.raised.toLocaleString()}</span>
                  <span className="text-gray-500">of €{campaign.goal.toLocaleString()}</span>
                </div>

                <button
                  className="w-full py-2 rounded-lg font-semibold text-[11px] uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: campaign.brandColor }}
                >
                  Join Campaign
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const LeaderboardsView = () => (
    <div className="min-h-[calc(100vh-80px)] p-8 lg:p-24 max-w-6xl mx-auto">
      <h2 className="text-5xl font-bold mb-12 lowercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Global Impact
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-mono text-[11px] tracking-widest uppercase border-b-2 border-[#1A1A1A] pb-4 mb-6">Total Raised</h3>
          <p className="text-5xl font-bold text-green-600">€{SAMPLE_CAMPAIGNS.reduce((sum, c) => sum + c.raised, 0).toLocaleString()}</p>
          <p className="text-[12px] text-gray-500 mt-2">Across all campaigns</p>
        </div>

        <div>
          <h3 className="font-mono text-[11px] tracking-widest uppercase border-b-2 border-[#1A1A1A] pb-4 mb-6">Active Campaigns</h3>
          <p className="text-5xl font-bold">{SAMPLE_CAMPAIGNS.length}</p>
          <p className="text-[12px] text-gray-500 mt-2">Making impact now</p>
        </div>

        <div>
          <h3 className="font-mono text-[11px] tracking-widest uppercase border-b-2 border-[#1A1A1A] pb-4 mb-6">Total Donors</h3>
          <p className="text-5xl font-bold">{new Set(SAMPLE_CAMPAIGNS.flatMap((c) => c.blocks.map((b) => b.owner))).size}</p>
          <p className="text-[12px] text-gray-500 mt-2">People making a difference</p>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="font-mono text-[11px] tracking-[0.3em] uppercase border-b border-[#1A1A1A] pb-4 mb-6">Top Campaigns</h3>
          <ul className="flex flex-col gap-6">
            {SAMPLE_CAMPAIGNS.map((campaign, idx) => (
              <li key={campaign.id} className="flex justify-between items-end border-b border-gray-200 pb-4">
                <div>
                  <p className="text-lg font-semibold">{idx + 1}. {campaign.title}</p>
                  <p className="text-[12px] text-gray-500">{campaign.organizer}</p>
                </div>
                <p className="font-mono text-[14px] font-bold">€{campaign.raised.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-[11px] tracking-[0.3em] uppercase border-b border-[#1A1A1A] pb-4 mb-6">Top Donors</h3>
          <ul className="flex flex-col gap-6">
            {Array.from(
              new Map(
                SAMPLE_CAMPAIGNS.flatMap((c) =>
                  c.blocks.map((b) => [b.owner, { name: b.owner, amount: b.amount }])
                )
              ).values()
            )
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 6)
              .map((donor, idx) => (
                <li key={donor.name} className="flex justify-between items-end border-b border-gray-200 pb-4">
                  <p className="text-lg font-semibold">{idx + 1}. {donor.name}</p>
                  <p className="font-mono text-[14px] font-bold">€{donor.amount}</p>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-[#F5F5F3]">
      <nav className="h-[80px] px-8 flex justify-between items-center border-b-2 border-[#1A1A1A]/10 bg-[#F5F5F3]">
        <button
          onClick={() => setCurrentView('home')}
          className="text-3xl lowercase tracking-tighter font-bold"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          buongesto.
        </button>
        <div className="flex gap-8 font-mono text-[9px] uppercase tracking-widest">
          <button
            onClick={() => setCurrentView('live')}
            className={`hover:text-[#1A1A1A] transition-colors ${
              currentView === 'live' ? 'border-b-2 border-[#1A1A1A]' : 'text-[#1A1A1A]/50'
            }`}
          >
            Live Canvas
          </button>
          <button
            onClick={() => setCurrentView('campaigns')}
            className={`hover:text-[#1A1A1A] transition-colors ${
              currentView === 'campaigns' ? 'border-b-2 border-[#1A1A1A]' : 'text-[#1A1A1A]/50'
            }`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setCurrentView('leaderboards')}
            className={`hover:text-[#1A1A1A] transition-colors ${
              currentView === 'leaderboards' ? 'border-b-2 border-[#1A1A1A]' : 'text-[#1A1A1A]/50'
            }`}
          >
            Impact
          </button>
        </div>
      </nav>

      <main className="w-full">
        {currentView === 'home' && <HomeView />}
        {currentView === 'live' && <LiveCanvasView />}
        {currentView === 'campaigns' && <CampaignsView />}
        {currentView === 'leaderboards' && <LeaderboardsView />}
      </main>
    </div>
  );
};

export default Engine;
