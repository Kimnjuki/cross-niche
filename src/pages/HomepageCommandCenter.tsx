import React, { useState, useEffect } from 'react';
import CyberCard from '../components/ui/cyber/CyberCard';
import HolographicButton from '../components/ui/cyber/HolographicButton';
import TerminalInput from '../components/ui/cyber/TerminalInput';
import RadialMenu from '../components/ui/cyber/RadialMenu';
import RankSystem from '../components/ui/cyber/RankSystem';
import VoiceCommand from '../components/ui/cyber/VoiceCommand';
import { useRouter } from 'next/navigation';

const HomepageCommandCenter: React.FC = () => {
  const router = useRouter();
  const [liveThreats, setLiveThreats] = useState([]);
  const [securityStatus, setSecurityStatus] = useState('SECURE');
  const [threatLevel, setThreatLevel] = useState('LOW');
  const [systemHealth, setSystemHealth] = useState(100);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    // Simulate live threat data
    const interval = setInterval(() => {
      setLiveThreats(prev => [
        ...prev.slice(-4),
        {
          id: Date.now(),
          type: ['Malware', 'Phishing', 'DDoS', 'Vulnerability'][Math.floor(Math.random() * 4)],
          severity: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)],
          timestamp: new Date().toISOString()
        }
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleCommand = (command: string) => {
    console.log('Executing command:', command);
    if (command === 'scan') {
      setScanning(true);
      setTimeout(() => {
        setScanning(false);
        setSecurityStatus(['SECURE', 'WARNING', 'CRITICAL'][Math.floor(Math.random() * 3)]);
        setThreatLevel(['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)]);
        setSystemHealth(Math.max(20, Math.floor(Math.random() * 100)));
      }, 2000);
    } else if (command === 'status') {
      alert(`Security Status: ${securityStatus}\nThreat Level: ${threatLevel}\nSystem Health: ${systemHealth}%`);
    }
  };

  const securityModules = [
    {
      id: 'nexus-guard',
      title: 'NexusGuard',
      subtitle: 'AI-Powered Threat Detection',
      icon: '🛡️',
      action: () => router.push('/tools/NexusGuard')
    },
    {
      id: 'breach-simulator',
      title: 'Breach Simulator',
      subtitle: 'Cyber Training',
      icon: '🎮',
      action: () => router.push('/tools/BreachSimulator')
    },
    {
      id: 'threat-intelligence',
      title: 'Threat Intel',
      subtitle: 'Real-time Analysis',
      icon: '🔍',
      action: () => router.push('/tools/ThreatIntelligence')
    },
    {
      id: 'security-audit',
      title: 'Security Audit',
      subtitle: 'System Assessment',
      icon: '📊',
      action: () => router.push('/tools/SecurityAudit')
    }
  ];

  return (
    <div className="cyberpunk-theme min-h-screen p-8">
      {/* Header - Command Center */}
      <div className="cyberpunk-text text-5xl font-bold mb-8">
        SECURITY COMMAND CENTER
      </div>

      {/* System Status Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <CyberCard
          title="SECURITY STATUS"
          subtitle={securityStatus}
          variant={securityStatus === 'CRITICAL' ? 'hologram' : 'default'}
        >
          <div className="cyberpunk-text text-lg">
            {securityStatus === 'SECURE' && '🟢 All systems operational'}
            {securityStatus === 'WARNING' && '🟡 Potential threats detected'}
            {securityStatus === 'CRITICAL' && '🔴 Critical security breach!'}
          </div>
        </CyberCard>

        <CyberCard title="THREAT LEVEL" subtitle={threatLevel}>
          <div className="cyberpunk-text text-lg">
            {threatLevel === 'LOW' && '🟢 Low risk environment'}
            {threatLevel === 'MEDIUM' && '🟡 Medium threat activity'}
            {threatLevel === 'HIGH' && '🔴 High threat level detected'}
          </div>
        </CyberCard>

        <CyberCard title="SYSTEM HEALTH" subtitle={`${systemHealth}%`}>
          <div className="cyberpunk-text text-lg">
            {systemHealth > 80 && '🟢 Optimal performance'}
            {systemHealth > 50 && '🟡 Some issues detected'}
            {systemHealth <= 50 && '🔴 Critical system issues'}
          </div>
        </CyberCard>
      </div>

      {/* Live Threat Ticker */}
      <div className="cyberpunk-terminal mb-8 p-4">
        <div className="cyberpunk-text text-sm">
          LIVE THREAT MONITORING - {new Date().toLocaleTimeString()}
        </div>
        <div className="cyberpunk-text text-xs mt-2">
          {liveThreats.map(threat => (
            <div key={threat.id} className="mb-1">
              [{threat.timestamp.split('T')[1].split('.')[0]}] {threat.type} - {threat.severity}
            </div>
          ))}
        </div>
      </div>

      {/* Security Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {securityModules.map(module => (
          <CyberCard
            key={module.id}
            title={module.title}
            subtitle={module.subtitle}
            onClick={module.action}
          >
            <div className="cyberpunk-text text-3xl">{module.icon}</div>
          </CyberCard>
        ))}
      </div>

      {/* Command Terminal */}
      <div className="cyberpunk-terminal p-6 mb-8">
        <div className="cyberpunk-text text-lg mb-4">
          SECURITY COMMAND TERMINAL
        </div>
        <TerminalInput
          placeholder="Enter command (scan, status, help)"
          onCommand={handleCommand}
          autoFocus
        />
      </div>

      {/* Quick Actions Radial Menu */}
      <RadialMenu
        items={[
          {
            id: 'quick-scan',
            label: 'Quick Scan',
            icon: '⚡',
            action: () => handleCommand('scan')
          },
          {
            id: 'system-status',
            label: 'System Status',
            icon: '📊',
            action: () => handleCommand('status')
          },
          {
            id: 'help',
            label: 'Help',
            icon: '❓',
            action: () => alert('Available commands: scan, status, help')
          }
        ]}
        position="bottom-right"
      />

{/* Rank System */}
      <RankSystem />

      {/* Voice Command */}
      <VoiceCommand />

      {/* Footer - System Info */}
      <div className="cyberpunk-text text-xs text-cyber-purple mt-8">
        THE GRID NEXUS - CYBERSECURITY COMMAND CENTER v1.0
      </div>
    </div>
  );
};

export default HomepageCommandCenter;
