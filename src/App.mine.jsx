import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import LotterySystem from './components/LotterySystem';
import VotingSystem from './components/VotingSystem';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import EnchantedRealm from './components/EnchantedRealm';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEnchantedRealm, setShowEnchantedRealm] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { 
      name: 'Stake', 
      href: 'https://staking.mine-token.com', 
      isExternal: true,
      icon: '⛏️',
      highlight: true 
    },
    { name: 'Tokenomics', href: '#tokenomics' },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'Ecosystem', href: '#ecosystem' },
    { name: 'Lottery', href: '#lottery' },
    { name: 'Vote', to: '/vote', isRoute: true },
    { name: 'Enchanted Realm', onClick: () => setShowEnchantedRealm(true) },
    { name: 'Buy Now', href: 'https://jup.ag/swap/USDC-GaHu73uhhWrcGLF3CWUi26ZBzv5mZAy8PLrvzoM5XMZh', isExternal: true },
  ];

  const ecosystemProjects = [
    {
      name: 'Frens Factory',
      description: 'Premier raffle platform accepting $MINE tokens for exclusive NFT raffles. Join the mining community and win rare digital treasures.',
      logo: '🎲',
      link: '#',
      partnerType: 'raffle'
    },
    {
      name: 'Stoned Ape',
      description: 'Join Stoned Ape Crew missions using $MINE. Explore the cosmos and earn incredible rewards.',
      logo: '🚀',
      link: 'https://www.stonedapecrew.com/space-missions',
      partnerType: 'missions'
    },
    {
      name: 'Mutants',
      description: 'Enter exclusive raffles powered by $MINE tokens. Every raffle is a chance to expand your mining empire.',
      logo: '🧬',
      link: '#',
      partnerType: 'raffle'
    },
    {
      name: 'Sol Sniper',
      description: 'Snipe the best deals in the secondary market using $MINE. Perfect for miners looking to expand their collections.',
      logo: '🎯',
      link: '#',
      partnerType: 'marketplace'
    }
  ];

  return (
    <>  
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen w-screen bg-mine-dark text-white overflow-x-hidden bg-mine-pattern">
            {/* Cave Background Texture */}
            <div className="fixed inset-0 bg-cave-texture opacity-20 pointer-events-none" />
            <div className="fixed inset-0 bg-crystal-pattern opacity-10 pointer-events-none" />

            {/* Mining Ambience Elements */}
            {/* Water Drips */}
            <div className="fixed inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={`drip-${i}`}
                  className="absolute animate-water-drip"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                >
                  💧
                </div>
              ))}
            </div>

            {/* Cave Bats */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              <div className="animate-bat-fly text-2xl" style={{ animationDelay: '0s' }}>🦇</div>
              <div className="animate-bat-fly text-2xl" style={{ animationDelay: '5s' }}>🦇</div>
            </div>

            {/* Mining Equipment */}
            <div className="fixed bottom-10 left-10 animate-dig pointer-events-none">⛏️</div>
            <div className="fixed bottom-10 right-10 animate-drill-spin pointer-events-none">🔧</div>

            {/* Floating Ores */}
            <div className="fixed inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <div
                  key={`gold-${i}`}
                  className="absolute animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 2}s`
                  }}
                >
                  <span className="text-mine-gold animate-ore-pulse">●</span>
                </div>
              ))}
              {[...Array(3)].map((_, i) => (
                <div
                  key={`silver-${i}`}
                  className="absolute animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 2 + 1}s`
                  }}
                >
                  <span className="text-mine-silver animate-ore-pulse">●</span>
                </div>
              ))}
            </div>

            {/* Mining Elevator */}
            <div className="fixed right-20 inset-y-0 pointer-events-none">
              <div className="h-full flex items-center">
                <div className="animate-elevator-move">
                  <div className="bg-mine-dark/50 p-4 rounded-lg border border-mine-green/30">
                    <span className="text-2xl">🪜</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wall Torches */}
            <div className="fixed left-0 inset-y-0 pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <div
                  key={`torch-${i}`}
                  className="absolute left-4 animate-torch-flicker"
                  style={{ top: `${25 * (i + 1)}%` }}
                >
                  🔥
                </div>
              ))}
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-20">
                  <div className="flex-shrink-0">
                    <span className="text-3xl font-bold text-mine-green animate-crystal-shine">$MINE</span>
                  </div>
                  
                  {/* Desktop Navigation */}
                  <div className="hidden md:block">
                    <div className="flex items-center space-x-8">
                      {navItems.map((item, index) => (
                        item.onClick ? (
                          <button
                            key={item.name}
                            onClick={item.onClick}
                            className={`px-4 py-2 rounded-md text-lg font-medium transition-all flex items-center space-x-2
                              ${item.highlight 
                                ? 'bg-mine-green/20 text-mine-crystal hover:bg-mine-green/30 hover:text-mine-green animate-pulse-glow' 
                                : 'text-gray-300 hover:text-mine-crystal hover:bg-black/30'}`}
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            {item.icon && <span className="animate-pickaxe-swing">{item.icon}</span>}
                            <span>{item.name}</span>
                          </button>
                        ) : item.isRoute ? (
                          <Link
                            key={item.name}
                            to={item.to}
                            className={`px-4 py-2 rounded-md text-lg font-medium transition-all flex items-center space-x-2
                              ${item.highlight 
                                ? 'bg-mine-green/20 text-mine-crystal hover:bg-mine-green/30 hover:text-mine-green animate-pulse-glow' 
                                : 'text-gray-300 hover:text-mine-crystal hover:bg-black/30'}`}
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            {item.icon && <span className="animate-pickaxe-swing">{item.icon}</span>}
                            <span>{item.name}</span>
                          </Link>
                        ) : (
                          <a
                            key={item.name}
                            href={item.href}
                            target={item.isExternal ? "_blank" : "_self"}
                            rel={item.isExternal ? "noopener noreferrer" : ""}
                            className={`px-4 py-2 rounded-md text-lg font-medium transition-all flex items-center space-x-2
                              ${item.highlight 
                                ? 'bg-mine-green/20 text-mine-crystal hover:bg-mine-green/30 hover:text-mine-green animate-pulse-glow' 
                                : 'text-gray-300 hover:text-mine-crystal hover:bg-black/30'}`}
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            {item.icon && <span className="animate-pickaxe-swing">{item.icon}</span>}
                            <span>{item.name}</span>
                            {item.isExternal && (
                              <span className="text-sm ml-1">↗️</span>
                            )}
                          </a>
                        )
                      ))}
                      <button onClick={() => window.open('https://enchantedminers.xyz/', '_blank')} className="px-4 py-2 rounded-md text-base font-medium flex items-center space-x-2 text-gray-300 hover:text-mine-crystal hover:bg-black/30">
                        Casino
                      </button>
                    </div>
                  </div>

                  {/* Mobile menu button */}
                  <div className="md:hidden">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-black/30"
                    >
                      <span className="sr-only">Open main menu</span>
                      {menuOpen ? '✕' : '☰'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              {menuOpen && (
                <div className="md:hidden">
                  <div className="px-2 pt-2 pb-3 space-y-1">
                    {navItems.map((item) => (
                      item.onClick ? (
                        <button
                          key={item.name}
                          onClick={item.onClick}
                          className={`block px-4 py-2 rounded-md text-base font-medium flex items-center space-x-2
                            ${item.highlight 
                              ? 'bg-mine-green/20 text-mine-crystal hover:bg-mine-green/30 hover:text-mine-green' 
                              : 'text-gray-300 hover:text-mine-crystal hover:bg-black/30'}`}
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.icon && <span>{item.icon}</span>}
                          <span>{item.name}</span>
                        </button>
                      ) : item.isRoute ? (
                        <Link
                          key={item.name}
                          to={item.to}
                          className={`block px-4 py-2 rounded-md text-base font-medium flex items-center space-x-2
                            ${item.highlight 
                              ? 'bg-mine-green/20 text-mine-crystal hover:bg-mine-green/30 hover:text-mine-green' 
                              : 'text-gray-300 hover:text-mine-crystal hover:bg-black/30'}`}
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.icon && <span>{item.icon}</span>}
                          <span>{item.name}</span>
                        </Link>
                      ) : (
                        <a
                          key={item.name}
                          href={item.href}
                          target={item.isExternal ? "_blank" : "_self"}
                          rel={item.isExternal ? "noopener noreferrer" : ""}
                          className={`block px-4 py-2 rounded-md text-base font-medium flex items-center space-x-2
                            ${item.highlight 
                              ? 'bg-mine-green/20 text-mine-crystal hover:bg-mine-green/30 hover:text-mine-green' 
                              : 'text-gray-300 hover:text-mine-crystal hover:bg-black/30'}`}
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.icon && <span>{item.icon}</span>}
                          <span>{item.name}</span>
                          {item.isExternal && (
                            <span className="text-sm ml-1">↗️</span>
                          )}
                        </a>
                      )
                    ))}
                    <button onClick={() => window.open('https://enchantedminers.xyz/', '_blank')} className="px-4 py-2 rounded-md text-base font-medium flex items-center space-x-2 text-gray-300 hover:text-mine-crystal hover:bg-black/30">
                      Casino
                    </button>
                  </div>
                </div>
              )}
            </nav>

            {/* Hero Section */}
            <section id="home" className="min-h-screen w-full pt-20">
              <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-black/80" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
                  <div className="text-center">
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 text-mine-green animate-float animate-glow">
                      Enchanted Miners
                    </h1>
                    <p className="text-2xl md:text-3xl mb-12 text-gray-300 animate-fade-in">
                      Join the magical mining revolution with our community of hardworking elves! 🧝‍♂️⛏️
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                      <button onClick={() => window.open('https://jup.ag/swap/USDC-GaHu73uhhWrcGLF3CWUi26ZBzv5mZAy8PLrvzoM5XMZh', '_blank')} className="px-12 py-4 bg-mine-green hover:bg-mine-green-dark rounded-full text-xl font-semibold transition-all transform hover:scale-105 animate-bounce-subtle">
                        Buy Now
                      </button>
                      <button onClick={() => window.open('https://discord.gg/xptqZ2kp', '_blank')} className="px-12 py-4 bg-black/50 hover:bg-black/70 rounded-full text-xl font-semibold transition-all border-2 border-mine-green transform hover:scale-105 animate-pulse-glow">
                        Join Community
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-32 w-full relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                  <h2 className="text-5xl font-bold text-mine-green mb-6">About $MINE</h2>
                  <p className="text-2xl text-gray-300">
                    The ultimate gaming and utility token in the magical mining realm
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative" style={{ isolation: 'isolate' }}>
                  <FeatureCard
                    title="Casino & Gaming"
                    description="Enter our magical casino realm at Enchanted Miners. Play, bet, and win with $MINE tokens across multiple games and events."
                    icon="🎰"
                    link="https://enchantedminers.xyz/"
                  />
                  <FeatureCard
                    title="Weekly Events"
                    description="Participate in weekly lotteries and exciting race betting events. Every week brings new chances to win big!"
                    icon="🎲"
                  />
                  <RaffleCard
                    title="Multi-Platform Raffles"
                    description="Enter exclusive raffles across our trusted partner platforms. Use $MINE to participate in multiple raffle opportunities!"
                    icon="🎯"
                    link="https://raffles.frenslabs.io/"
                  />
                  <FeatureCard
                    title="Community Events"
                    description="Join our vibrant community events and earn rewards. Connect with fellow miners and participate in exciting activities!"
                    icon="🎯"
                  />
                  <FeatureCard
                    title="Art & Collectibles"
                    description="Unlock exclusive art upgrades and rare 1/1 pieces. Transform your NFTs into unique masterpieces with $MINE."
                    icon="🎨"
                    link="https://docs.google.com/forms/d/e/1FAIpQLSdX_JuEJJgB5SgzznGtoBemNtqgDzVtwvYTmZITwPSEr9j5_A/viewform?pli=1"
                  />
                  <FeatureCard
                    title="Space Missions"
                    description="Join Stoned Ape Crew missions using $MINE. Explore the cosmos and earn incredible rewards."
                    icon="🚀"
                  />
                  <FeatureCard
                    title="Trading Bot"
                    description="Coming Soon: Advanced trading bot using $MINE as gas fees. Trade smarter and faster with our automated solutions."
                    icon="🤖"
                  />
                </div>

                {/* Coming Soon Features */}
                <div className="mt-16">
                  <h3 className="text-3xl font-bold text-mine-crystal mb-8 text-center animate-crystal-shine">Coming Soon</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-black/30 rounded-xl p-6 border border-mine-green/30 group hover:border-mine-green transition-all">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3 animate-pulse-glow">🎮</span>
                        <h4 className="text-xl font-bold text-mine-crystal">Gaming Platform</h4>
                      </div>
                      <p className="text-gray-300">Our dedicated casino and gaming platform featuring multiple games and betting options.</p>
                    </div>
                    
                    <div className="bg-black/30 rounded-xl p-6 border border-mine-green/30 group hover:border-mine-green transition-all">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3 animate-pulse-glow">👕</span>
                        <h4 className="text-xl font-bold text-mine-crystal">$MINE Merch</h4>
                      </div>
                      <p className="text-gray-300">Exclusive merchandise store accepting $MINE tokens. Wear your mining pride!</p>
                    </div>
                    
                    <div className="bg-black/30 rounded-xl p-6 border border-mine-green/30 group hover:border-mine-green transition-all">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3 animate-pulse-glow">🔄</span>
                        <h4 className="text-xl font-bold text-mine-crystal">Trading Features</h4>
                      </div>
                      <p className="text-gray-300">Enhanced trading capabilities with automated bots and advanced trading tools.</p>
                    </div>
                  </div>
                </div>

                {/* Use Cases Summary */}
                <div className="mt-16 text-center">
                  <div className="inline-flex flex-wrap justify-center gap-4 bg-black/30 rounded-xl p-6 border border-mine-green/30">
                    <span className="text-mine-crystal flex items-center">
                      <span className="animate-pickaxe-swing mr-2">⛏️</span> Casino Gaming
                    </span>
                    <span className="text-mine-crystal flex items-center">
                      <span className="animate-crystal-shine mr-2">💎</span> Art Upgrades
                    </span>
                    <span className="text-mine-crystal flex items-center">
                      <span className="animate-pulse-glow mr-2">🎲</span> Weekly Lotteries
                    </span>
                    <span className="text-mine-crystal flex items-center">
                      <span className="animate-float mr-2">🏇</span> Race Betting
                    </span>
                    <span className="text-mine-crystal flex items-center">
                      <span className="animate-bounce-subtle mr-2">🎯</span> Multiple Raffles
                    </span>
                    <span className="text-mine-crystal flex items-center">
                      <span className="animate-spin-slow mr-2">🤖</span> Trading Bot
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Tokenomics Section */}
            <section id="tokenomics" className="py-32 w-full bg-black/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                  <h2 className="text-5xl font-bold text-mine-green mb-6">Tokenomics</h2>
                  <p className="text-2xl text-gray-300">
                    Fair distribution for all miners in the realm
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <TokenomicCard
                    title="Total Supply"
                    value="1,000,000,000"
                    description="$MINE tokens"
                  />
                  <TokenomicCard
                    title="Mining Tax"
                    value="3/3"
                    description="Buy/Sell Tax"
                  />
                  <TokenomicCard
                    title="Burned"
                    value="50%"
                    description="Initial Burn"
                  />
                  <TokenomicCard
                    title="Locked"
                    value="1 Year"
                    description="Liquidity Lock"
                  />
                </div>
              </div>
            </section>

            {/* Roadmap Section */}
            <section id="roadmap" className="py-32 w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                  <h2 className="text-5xl font-bold text-mine-green mb-6">Mining Roadmap</h2>
                  <p className="text-2xl text-gray-300">
                    Our journey through the magical mines
                  </p>
                </div>

                <div className="space-y-8">
                  <RoadmapPhase
                    phase="Phase 1: The Awakening"
                    items={[
                      "Website Launch",
                      "Community Building",
                      "Initial Marketing Push",
                      "CoinGecko/CMC Listings"
                    ]}
                  />
                  <RoadmapPhase
                    phase="Phase 2: The Expansion"
                    items={[
                      "CEX Listings",
                      "NFT Collection Launch",
                      "Enhanced Marketing",
                      "Partnership Announcements"
                    ]}
                  />
                  <RoadmapPhase
                    phase="Phase 3: The Evolution"
                    items={[
                      "Mining Game Launch",
                      "DAO Implementation",
                      "Major CEX Listings",
                      "Global Marketing Campaign"
                    ]}
                  />
                </div>
              </div>
            </section>

            {/* Ecosystem Section */}
            <section id="ecosystem" className="py-32 w-full bg-black/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                  <h2 className="text-5xl font-bold text-mine-green mb-6">Trusted Ecosystem</h2>
                  <p className="text-2xl text-gray-300">
                    Explore the magical realm of projects powered by $MINE
                  </p>
                </div>
                
                {/* Mining Equipment Decorations */}
                <div className="absolute left-4 animate-dig">⛏️</div>
                <div className="absolute right-4 animate-drill-spin">🔧</div>
                
                {/* Ecosystem Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {ecosystemProjects.map((project, index) => (
                    <div 
                      key={project.name}
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <EcosystemCard {...project} />
                    </div>
                  ))}
                </div>
                
                {/* Floating Gems */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={`ecosystem-gem-${i}`}
                      className="absolute animate-float"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${i * 2}s`
                      }}
                    >
                      <span className="text-xl animate-crystal-shine">💎</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Lottery Section */}
            <section id="lottery" className="py-32 w-full bg-gray-900">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">Weekly Lottery</h2>
                <LotterySystem />
              </div>
            </section>

            {/* Vote Section */}
            <section id="vote" className="py-32 w-full bg-gray-900">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">Voting System</h2>
                <VotingSystem />
              </div>
            </section>

            {/* Buy Now Section */}
            <section id="buy" className="py-32 w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                  <h2 className="text-5xl font-bold text-mine-green mb-6">Buy Now</h2>
                  <p className="text-2xl text-gray-300 mb-12">
                    Get your $MINE tokens today!
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-12 w-full bg-black/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-3xl font-bold text-mine-green mb-8 md:mb-0">
                    $MINE
                  </div>
                  <div className="flex space-x-12">
                    <a href="#" className="text-xl text-gray-300 hover:text-mine-crystal transition-colors">
                      Twitter
                    </a>
                    <a href="#" className="text-xl text-gray-300 hover:text-mine-crystal transition-colors">
                      Telegram
                    </a>
                    <a href="#" className="text-xl text-gray-300 hover:text-mine-crystal transition-colors">
                      Discord
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        } />
        <Route path="/vote" element={<VotingSystem />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>

      {/* Enchanted Realm Modal */}
      {showEnchantedRealm && createPortal(
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80" onClick={() => setShowEnchantedRealm(false)}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl">
              <button 
                onClick={() => setShowEnchantedRealm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              <EnchantedRealm />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function FeatureCard({ title, description, icon, link }) {
  return (
    <div className="p-8 bg-black/30 rounded-xl border border-mine-green/30 hover:border-mine-green transition-all transform hover:scale-105 group relative overflow-hidden">
      <div className="absolute top-2 right-2 text-xl animate-torch-flicker">🔥</div>
      <div className="text-5xl mb-6 group-hover:animate-pickaxe-swing">{icon}</div>
      <h3 className="text-2xl font-bold text-mine-crystal mb-4 animate-crystal-shine">{title}</h3>
      <p className="text-lg text-gray-300 mb-4">{description}</p>
      {link && (
        <a 
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-mine-crystal hover:text-mine-green transition-colors"
        >
          Visit Platform <span className="ml-2 group-hover:animate-pickaxe-swing">↗️</span>
        </a>
      )}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-mine-green/20 animate-mine-dust" />
      {Math.random() > 0.5 && (
        <div className="absolute top-1/2 right-4 text-sm animate-water-drip">💎</div>
      )}
    </div>
  );
}

function RaffleCard({ title, description, icon, link }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (link) {
      window.open(link, '_blank');
    } else {
      setIsOpen(true);
    }
  };

  const raffleLinks = [
    {
      name: 'Frens Labs',
      url: 'https://raffles.frenslabs.io/',
      icon: '🎲'
    },
    {
      name: 'Mutants',
      url: 'https://mutantsonsolanacrew.com/raffles',
      icon: '🧬'
    },
    {
      name: 'Monet',
      url: 'https://monet.community/raffles',
      icon: '🎯'
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.raffle-dropdown-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="p-8 bg-black/30 rounded-xl border border-mine-green/30 hover:border-mine-green transition-all transform hover:scale-105 group">
      <div className="absolute top-2 right-2 text-xl animate-torch-flicker">🔥</div>
      <div className="text-5xl mb-6 group-hover:animate-pickaxe-swing">{icon}</div>
      <h3 className="text-2xl font-bold text-mine-crystal mb-4 animate-crystal-shine">{title}</h3>
      <p className="text-lg text-gray-300 mb-4">{description}</p>
      
      <div className="relative raffle-dropdown-container">
        <button
          onClick={handleClick}
          className="w-full px-4 py-2 bg-mine-green/20 rounded-lg text-mine-crystal hover:bg-mine-green/30 transition-colors flex items-center justify-between"
        >
          <span>Choose Raffle Platform</span>
          <span className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
        </button>
        
        {isOpen && (
          <div className="absolute z-50 left-full top-0 ml-2 bg-black/90 rounded-lg border border-mine-green/30 overflow-hidden animate-slide-in-right shadow-xl shadow-mine-green/20 w-64">
            {raffleLinks.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-3 hover:bg-mine-green/20 transition-colors text-mine-crystal"
              >
                <span className="animate-bounce-subtle">{platform.icon}</span>
                <span>{platform.name}</span>
                <span className="ml-auto">↗️</span>
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-mine-green/20 animate-mine-dust" />
      <div className="absolute bottom-2 right-2 text-sm animate-drill-spin">🔧</div>
    </div>
  );
}

function TokenomicCard({ title, value, description }) {
  const oreTypes = ['🪙', '💎', '⚜️'];
  return (
    <div className="p-8 bg-black/30 rounded-xl border border-mine-green/30 hover:border-mine-green transition-all transform hover:scale-105 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-mine-green/20 animate-mine-dust" />
      <div className="absolute top-2 right-2 text-xl animate-ore-pulse">
        {oreTypes[Math.floor(Math.random() * oreTypes.length)]}
      </div>
      <h3 className="text-2xl font-bold text-mine-crystal mb-4 animate-crystal-shine">{title}</h3>
      <div className="text-4xl font-bold text-white mb-2 group-hover:animate-sparkle">{value}</div>
      <p className="text-lg text-gray-300">{description}</p>
      <div className="absolute bottom-2 right-2 text-sm animate-float">💎</div>
    </div>
  );
}

function RoadmapPhase({ phase, items }) {
  return (
    <div className="p-8 bg-black/30 rounded-xl border border-mine-green/30 hover:border-mine-green transition-all transform hover:scale-105 relative overflow-hidden group">
      <div className="absolute top-2 right-2 text-xl animate-lantern-flicker">🏮</div>
      <div className="absolute top-2 left-2 text-xl animate-torch-flicker">🔥</div>
      <h3 className="text-2xl font-bold text-mine-crystal mb-6 animate-crystal-shine">{phase}</h3>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li 
            key={index} 
            className="flex items-center mb-4"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <span className="text-2xl text-mine-green group-hover:animate-pickaxe-swing">⛏️</span>
            <span className="text-lg text-gray-300 group-hover:text-mine-crystal transition-colors">{item}</span>
            {index % 2 === 0 && (
              <span className="text-sm animate-float ml-2">💎</span>
            )}
          </li>
        ))}
      </ul>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-mine-green/20 animate-mine-dust" />
      <div className="absolute bottom-2 right-2 text-sm animate-drill-spin">🔧</div>
    </div>
  );
}

function EcosystemCard({ name, description, logo, link, partnerType }) {
  const partnerIcons = {
    'raffle': '🎲',
    'missions': '🚀',
    'flip': '🎰',
    'burn': '🔥',
    'marketplace': '🎯',
  };

  const partnerColors = {
    'raffle': 'text-purple-400',
    'missions': 'text-blue-400',
    'flip': 'text-yellow-400',
    'burn': 'text-red-400',
    'marketplace': 'text-green-400',
  };

  return (
    <div className="p-8 bg-black/30 rounded-xl border border-mine-green/30 hover:border-mine-green transition-all transform hover:scale-105 relative overflow-hidden group">
      <div className="absolute top-2 right-2 text-xl animate-crystal-shine">{partnerIcons[partnerType]}</div>
      <div className="absolute top-0 left-0 w-full h-1 bg-mine-green/20 animate-mine-dust" />
      
      <div className="flex items-center mb-6">
        <div className={`w-16 h-16 rounded-full bg-black/50 flex items-center justify-center text-3xl animate-float ${partnerColors[partnerType]}`}>
          {logo}
        </div>
        <div className="ml-4">
          <h3 className="text-2xl font-bold text-mine-crystal animate-crystal-shine">{name}</h3>
          <span className={`text-sm ${partnerColors[partnerType]} uppercase`}>{partnerType}</span>
        </div>
      </div>
      
      <p className="text-lg text-gray-300 mb-4">{description}</p>
      
      <a 
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center ${partnerColors[partnerType]} hover:text-mine-green transition-colors`}
      >
        Visit Project <span className="ml-2 group-hover:animate-pickaxe-swing">⛏️</span>
      </a>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-mine-green/20 animate-mine-dust" />
      <div className="absolute -right-2 bottom-2 text-sm animate-float delay-100">💎</div>
    </div>
  );
}

export default App;
