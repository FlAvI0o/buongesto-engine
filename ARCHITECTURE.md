# 🎨 Buongesto Engine - WebGL Fundraising Platform

A modern, interactive fundraising canvas inspired by r/place but optimized to make donations feel **entertaining, rewarding, and impactful**.

## 🎯 Core Features

### WebGL 3D Canvas
- **Dynamic Grid Shapes**: Hexagons, spirals, circles, waves, organic patterns
- **Smooth Animations**: Three.js powered with real-time camera movements
- **Particle Effects**: Visual feedback for interactions
- **Organization-Specific Branding**: Each campaign has its own aesthetic

### Real-Time Donation Experience
- **Live Feed**: See donations flowing in real-time with donor names and messages
- **Progress Visualization**: Animated progress bars showing campaign goals
- **Color Selection**: Donors choose their block color for personal connection
- **Payment Simulation**: Demo payment flow with card, crypto, and bank options

### Sound & Haptic Feedback
- **Audio Feedback**: Web Audio API for sound effects
- **Haptic Vibration**: Device vibration support for tactile feedback
- **Volume Control**: Toggle sound on/off

## 📁 Project Structure

```
src/
├── pages/
│   └── Engine.tsx                 # Main campaign canvas component
├── components/
│   └── WebGL/
│       ├── WebGLCanvas.tsx        # Three.js canvas renderer
│       └── LiveDonationFeed.tsx   # Real-time donation display
├── types/
│   └── campaign.ts                # TypeScript interfaces
├── data/
│   └── campaigns.ts               # Sample campaign data
├── utils/
│   ├── gridGeometry.ts            # Grid shape generators
│   └── soundEffects.ts            # Audio feedback system
└── hooks/
    └── useSoundEffects.ts         # Sound effects hook
```

## 🚀 How It Works

### 1. Campaign Selection
- Users see available campaigns with progress bars
- Brand colors and grid shapes vary by organization
- Each campaign has a unique visual identity

### 2. Block Placement
- Click blocks on the 3D canvas to select them
- Multiple selections supported (bulk purchasing)
- Real-time color picker for customization

### 3. Donation Flow
- Review selected blocks in purchase modal
- Choose payment method (demo)
- Complete transaction
- See blocks animate into the canvas
- Real-time feed updates with donation info

## 🛠️ Extending the Project

### Adding a New Campaign

```typescript
// In src/data/campaigns.ts
{
  id: 'c4',
  title: 'Your Campaign Title',
  organizer: 'Organization Name',
  description: 'Campaign description...',
  brandColor: '#FF6B6B',  // Primary color
  gridShape: 'spiral',    // hexagon, spiral, circle, wave, organic, square
  gridSize: 12,           // Blocks per dimension
  goal: 50000,
  raised: 0,
  blocks: [],
  topDonors: [],
  startDate: '2026-05-01',
  endDate: '2026-05-31',
}
```

### Creating Custom Grid Shapes

```typescript
// In src/utils/gridGeometry.ts
const generateMyCustomShape = (size: number): GridPosition[] => {
  const positions: GridPosition[] = [];
  
  for (let i = 0; i < size * size; i++) {
    // Your custom positioning logic
    positions.push({
      gridX: x,
      gridY: y,
      x: customX,
      y: customY,
      z: customZ,
    });
  }
  
  return positions;
};

// Add to generateGridPositions switch statement
case 'myshape':
  positions.push(...generateMyCustomShape(gridSize));
  break;
```

### Adding New Sound Effects

```typescript
// In src/utils/soundEffects.ts
SOUND_CONFIG['myeffect'] = {
  frequency: 700,
  duration: 0.2,
  volume: 0.2,
};

// Use it anywhere
playSound('myeffect');
```

### Customizing Visual Style

- **Campaign Colors**: Set `brandColor` in campaign data
- **Block Materials**: Edit Three.js material in `WebGLCanvas.tsx`
- **Animation Speed**: Adjust rotation speeds in the animation loop
- **Camera Movement**: Modify camera position calculations

## 🎬 Animation Highlights

- **Block Hover**: Smooth scale-up with glow effect
- **Block Selection**: Z-axis floating animation
- **Purchase Success**: Chord audio + green success message
- **Live Feed**: Cascade animation for new donations
- **Progress Bar**: Smooth percentage increase animation

## 🔊 Sound Design Philosophy

The sound effects are designed to:
1. **Provide Feedback** - Users know their action registered
2. **Create Excitement** - Success chord reinforces positive emotions
3. **Guide Interaction** - Different sounds for different actions
4. **Be Non-Intrusive** - Quiet volumes with toggle option

## 🎮 User Experience Flows

### First-Time User
1. Land on home page
2. See campaign descriptions
3. Click "Join Campaign"
4. Experience WebGL canvas
5. Follow on-screen instructions
6. Complete simulated donation
7. See block appear in real-time

### Returning Donor
1. See active campaigns with progress
2. Directly jump into favorite campaign
3. Quick block selection
4. Fast checkout
5. See impact immediately

## 🔮 Future Enhancements

- [ ] Real payment integration (Stripe, crypto wallets)
- [ ] Leaderboards with badges
- [ ] Campaign sharing
- [ ] Custom grid editor
- [ ] Replay system to see donation history
- [ ] AR visualization
- [ ] Collaborative team campaigns
- [ ] NFT certificates for donors
- [ ] AI-generated campaign promotions

## 📊 Analytics Opportunities

Track:
- Donation conversion rate
- Average donation amount
- Popular grid shapes
- Top campaign colors
- Peak donation times
- Donor retention

## 🎨 Design System

### Colors
- **Primary**: Campaign-specific (brandColor)
- **Background**: #F5F5F3 (off-white)
- **Text**: #1A1A1A (near-black)
- **Accents**: Donation colors

### Typography
- **Display**: Cormorant Garamond (serif)
- **Body**: System sans-serif
- **Mono**: Monaco/Courier (data)

### Spacing
- Base unit: 4px (Tailwind)
- Use consistent padding/margins
- Card padding: 1.5rem
- Section spacing: 3rem+

## ⚡ Performance Tips

- Three.js WebGL rendering is GPU-accelerated
- Particle system uses instancing for efficiency
- Lazy load campaign images
- Debounce mouse move for raycasting
- Cache grid positions on initialization

## 🐛 Troubleshooting

**WebGL not rendering?**
- Check browser supports WebGL
- Ensure Three.js is installed: `npm list three`
- Check browser console for errors

**Sound not working?**
- Verify AudioContext initialized
- Check browser audio permissions
- Sound plays after user interaction (browser policy)

**Grid shapes not showing?**
- Verify gridShape matches case in switch statement
- Check generateGridPositions function
- Ensure gridSize > 0

## 📝 License

This project is part of the Buongesto fundraising initiative. Feel free to fork, modify, and extend for your campaigns!

---

**Built with** ❤️ for donors who want their impact to be visible, entertaining, and beautiful.
