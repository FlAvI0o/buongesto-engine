## 🚀 Quick Start - Buongesto Engine WebGL Platform

Your fundraising canvas is ready! Here's how to launch and test it:

### 1. **Install Dependencies** (if needed)
```bash
npm install
```

### 2. **Start Development Server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the URL shown in terminal)

### 3. **Navigate the Platform**

**Home Page** (`/`)
- See campaign descriptions
- Click "Join Active Campaign" or "Browse Campaigns"
- Notice the hero graphics and smooth animations

**Live Canvas View** (`/live`)
- **Left Panel**: Campaign info and purchase instructions
- **Center**: 3D WebGL grid with colored blocks
- **Right Panel**: Real-time donation feed showing recent purchases
- **Hover Effects**: Blocks scale and glow when you hover
- **Click to Select**: Click blocks to add them to your cart

### 4. **Test Purchase Flow**

1. Click 2-3 blocks on the canvas
2. Click "Purchase Selected Blocks" button
3. In the modal:
   - Use the color picker to choose your block color
   - Select a payment method (Card, Crypto, Bank)
   - Click "Confirm Purchase"
4. Watch the success animation
5. See your donation appear in the live feed
6. Observe blocks changing to your selected color

### 5. **Explore Views**

**Campaigns** (navigation bar)
- Browse all active campaigns
- See progress bars and fundraising goals
- Click any campaign to switch to it
- Watch grid shape change based on campaign

**Leaderboards** (navigation bar)
- View top-performing campaigns
- See top donors across all campaigns
- Track total fundraising metrics

**Sound** (navigation bar)
- Toggle sound effects on/off
- Test by making donations (success chord plays)
- See haptic feedback work on supported devices

### 6. **Inspect WebGL Canvas**

Open browser DevTools (F12) and check:
- No console errors
- WebGL canvas rendering at 60fps
- Three.js metrics in console (if installed)

### 7. **Testing Sound Effects**

If sound isn't working:
1. Check browser volume isn't muted
2. Ensure browser permissions allow audio
3. Note: Audio plays after first user interaction (browser policy)
4. Try making a purchase - success chord should play

## 🎨 Customization Quick Tips

### Add New Campaign
Edit `src/data/campaigns.ts`:
```typescript
{
  id: 'c4',
  title: 'My Campaign',
  brandColor: '#FF6B6B',
  gridShape: 'spiral',
  goal: 25000,
  ...
}
```

### Change Grid Shape
Set `gridShape` in campaign to one of:
- `hexagon` - Honeyomb layout
- `spiral` - Logarithmic spiral
- `circle` - Concentric rings
- `wave` - Sinusoidal waves
- `organic` - Random poisson disk
- `square` - Traditional grid

### Adjust Colors
- `brandColor` - Main campaign color
- `blocks[].color` - Individual block color (set by donor)

### Add More Blocks to Campaign
In `src/data/campaigns.ts`, add to campaign's `blocks` array:
```typescript
{
  id: 'b1',
  x: 0, y: 0, z: 0,
  color: '#3498db',
  owner: 'Sample Donor',
  message: 'Great cause!',
  amount: 50,
  timestamp: new Date().toISOString(),
  gridX: 2,
  gridY: 3,
}
```

## 🔧 Available Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## 📊 Understanding the Data Flow

```
User clicks blocks on canvas
    ↓
WebGLCanvas triggers onBlockClick callback
    ↓
Engine.tsx adds to selectedBlocks state
    ↓
Purchase modal opens with color picker
    ↓
User confirms purchase with payment method
    ↓
DonationTransaction created
    ↓
Blocks marked as "bought" with new color
    ↓
LiveDonationFeed updates in real-time
    ↓
Animation plays (success chord + haptics)
```

## 🎬 Animation Features

- **Block Hover**: Smooth scale + glow
- **Block Selection**: Z-axis floating
- **Purchase Modal**: Slide in with Framer Motion
- **Success Receipt**: Fade in with confetti
- **Live Feed**: Cascade animation for new items
- **Progress Bar**: Smooth percentage animation

## 🐛 Troubleshooting

**WebGL not rendering?**
- Check browser supports WebGL (WebGL 2 tab in DevTools)
- Try Chrome/Firefox (most stable)

**Sound not working?**
- Browser blocks audio until user interaction (click/touch first)
- Check volume settings
- Check browser console for AudioContext errors

**Grid looks weird?**
- Make sure gridSize is 4-20
- Verify gridShape matches available shapes
- Check browser DevTools for console errors

**Blocks not appearing on purchase?**
- Open browser DevTools → Console
- Check for TypeScript errors
- Verify blocks array is being updated

## 📚 File Reference

| File | Purpose |
|------|---------|
| `src/pages/Engine.tsx` | Main app orchestrator |
| `src/components/WebGL/WebGLCanvas.tsx` | 3D rendering |
| `src/components/WebGL/LiveDonationFeed.tsx` | Donation display |
| `src/types/campaign.ts` | TypeScript interfaces |
| `src/utils/gridGeometry.ts` | Grid shape generators |
| `src/utils/soundEffects.ts` | Audio feedback |
| `src/data/campaigns.ts` | Sample data |
| `ARCHITECTURE.md` | Full documentation |

## 🎯 Next: Real Backend Integration

When ready to go live:
1. Replace mock payment with real Stripe/Adyen integration
2. Connect to database for persistent donations
3. Add user authentication
4. Implement real-time WebSocket updates
5. Deploy to Vercel (already configured in vercel.json)

---

**You now have a fully functional, entertainment-focused fundraising platform!** 🎉

Ask if you need any modifications, feature additions, or help testing.
