import React, { useState, useEffect } from 'react';
import HolographicButton from './HolographicButton';

interface Rank {
  id: string;
  name: string;
  title: string;
  color: string;
  icon: string;
  xpRequired: number;
  description: string;
}

const ranks: Rank[] = [
  {
    id: 'novice',
    name: 'Novice',
    title: 'Security Novice',
    color: '#00FF41',
    icon: '🌱',
    xpRequired: 0,
    description: 'Just starting your security journey'
  },
  {
    id: 'guardian',
    name: 'Guardian',
    title: 'Security Guardian',
    color: '#00D4FF',
    icon: '🛡️',
    xpRequired: 100,
    description: 'Protecting systems from basic threats'
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    title: 'Security Sentinel',
    color: '#8B5CF6',
    icon: '👁️',
    xpRequired: 500,
    description: 'Advanced threat detection specialist'
  },
  {
    id: 'architect',
    name: 'Architect',
    title: 'Security Architect',
    color: '#FF6B35',
    icon: '🏗️',
    xpRequired: 1500,
    description: 'Designing secure systems and protocols'
  },
  {
    id: 'legend',
    name: 'Legend',
    title: 'Security Legend',
    color: '#FF2D55',
    icon: '🌟',
    xpRequired: 5000,
    description: 'Master of cybersecurity'
  }
];

const RankSystem: React.FC = () => {
  const [currentRank, setCurrentRank] = useState<Rank | null>(null);
  const [currentXP, setCurrentXP] = useState(0);
  const [nextRankXP, setNextRankXP] = useState(0);

  useEffect(() => {
    // Load rank progress from local storage
    const savedRank = localStorage.getItem('securityRank');
    const savedXP = localStorage.getItem('securityXP');

    if (savedRank && savedXP) {
      const rankIndex = ranks.findIndex(r => r.id === savedRank);
      setCurrentRank(ranks[rankIndex]);
      setCurrentXP(parseInt(savedXP));
      setNextRankXP(ranks[rankIndex + 1]?.xpRequired || 0);
    } else {
      setCurrentRank(ranks[0]);
      setCurrentXP(0);
      setNextRankXP(ranks[1]?.xpRequired || 0);
    }
  }, []);

  const addXP = (xp: number) => {
    setCurrentXP(prev => {
      const newXP = prev + xp;
      const newRank = ranks.find(r => newXP >= r.xpRequired);
      if (newRank) {
        setCurrentRank(newRank);
        const nextRank = ranks[ranks.indexOf(newRank) + 1];
        setNextRankXP(nextRank?.xpRequired || 0);
        localStorage.setItem('securityRank', newRank.id);
      }
      localStorage.setItem('securityXP', newXP.toString());
      return newXP;
    });
  };

  const getProgress = () => {
    if (!currentRank || !nextRankXP) return 0;
    const currentRankIndex = ranks.indexOf(currentRank);
    const prevRankXP = currentRankIndex > 0 ? ranks[currentRankIndex - 1].xpRequired : 0;
    const progress = ((currentXP - prevRankXP) / (nextRankXP - prevRankXP)) * 100;
    return Math.min(100, progress);
  };

  return (
    <div className="cyberpunk-hologram p-6 mb-8">
      <div className="cyberpunk-text text-2xl mb-4">
        SECURITY RANK SYSTEM
      </div>
      <div className="cyberpunk-text text-base mb-4">
        Earn experience points by completing security challenges, training modules, and real-world threat analysis.
      </div>

      {/* Current Rank Display */}
      {currentRank && (
        <div className="mb-6 p-4 bg-cyber-mid rounded-lg border border-cyber-purple">
          <div className="flex items-center mb-3">
            <div className="cyberpunk-text text-4xl mr-4">{currentRank.icon}</div>
            <div>
              <div className="cyberpunk-text text-xl font-bold">
                {currentRank.title}
              </div>
              <div className="cyberpunk-text text-sm text-neutral">
                Rank: {currentRank.name}
              </div>
            </div>
          </div>
          <div className="cyberpunk-text text-sm text-neutral mb-3">
            {currentRank.description}
          </div>
          <div className="cyberpunk-text text-sm text-neutral">
            XP: {currentXP} / {nextRankXP} (Next: {ranks[ranks.indexOf(currentRank) + 1]?.name || 'MAX'})
          </div>
        </div>
      )}

      {/* XP Progress Bar */}
      <div className="mb-6">
        <div className="cyberpunk-text text-sm text-neutral mb-2">
          XP Progress
        </div>
        <div className="w-full bg-cyber-dark rounded-full h-2 mb-2">
          <div
            className="bg-matrix-green h-2 rounded-full"
            style={{ width: `${getProgress()}%` }}
          ></div>
        </div>
        <div className="cyberpunk-text text-xs text-neutral">
          {Math.floor(getProgress())}% to next rank
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <HolographicButton
          onClick={() => addXP(10)}
          size="sm"
          className="text-xs"
        >
          🔬 Analyze Threat
        </HolographicButton>
        <HolographicButton
          onClick={() => addXP(25)}
          size="sm"
          className="text-xs"
        >
          🎮 Complete Training
        </HolographicButton>
        <HolographicButton
          onClick={() => addXP(50)}
          size="sm"
          className="text-xs"
        >
          🛡️ Security Audit
        </HolographicButton>
      </div>

      {/* Rank Benefits */}
      <div className="cyberpunk-text text-sm text-neutral mb-4">
        <div className="cyberpunk-text text-lg mb-2 font-bold">
          RANK BENEFITS
        </div>
        <div className="mb-2">
          <span className="cyberpunk-text text-green-500 mr-2">🌱 Novice:</span>
          Basic security tools access
        </div>
        <div className="mb-2">
          <span className="cyberpunk-text text-blue-500 mr-2">🛡️ Guardian:</span>
          Advanced threat detection
        </div>
        <div className="mb-2">
          <span className="cyberpunk-text text-purple-500 mr-2">👁️ Sentinel:</span>
          Real-time monitoring
        </div>
        <div className="mb-2">
          <span className="cyberpunk-text text-orange-500 mr-2">🏗️ Architect:</span>
          Custom security protocols
        </div>
        <div>
          <span className="cyberpunk-text text-red-500 mr-2">🌟 Legend:</span>
          All features unlocked
        </div>
      </div>
    </div>
  );
};

export default RankSystem;