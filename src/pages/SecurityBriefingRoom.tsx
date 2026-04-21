import React, { useState, useEffect } from 'react';
import CyberCard from '../components/ui/cyber/CyberCard';
import HolographicButton from '../components/ui/cyber/HolographicButton';
import TerminalInput from '../components/ui/cyber/TerminalInput';
import { useRouter } from 'next/navigation';

const SecurityBriefingRoom: React.FC = () => {
  const router = useRouter();
  const [aiAssistant, setAiAssistant] = useState({
    status: 'ACTIVE' as 'ACTIVE' | 'ANALYZING' | 'IDLE',
    message: 'Ready to assist with security analysis'
  });
  const [threatReports, setThreatReports] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    overall: 'SECURE',
    components: {
      network: 'HEALTHY',
      endpoints: 'MONITORED',
      data: 'ENCRYPTED'
    }
  });
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    // Simulate threat reports
    const interval = setInterval(() => {
      setThreatReports(prev => [
        ...prev.slice(-3),
        {
          id: Date.now(),
          type: ['Malware', 'Phishing', 'DDoS', 'Vulnerability'][Math.floor(Math.random() * 4)],
          severity: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)],
          source: ['Internal', 'External', 'Unknown'][Math.floor(Math.random() * 3)],
          timestamp: new Date().toISOString()
        }
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleScan = async () => {
    setScanning(true);
    setAiAssistant({ status: 'ANALYZING', message: 'Analyzing system for threats...' });

    setTimeout(() => {
      const newStatus = Math.random() > 0.3 ? 'SECURE' : 'WARNING';
      const newComponents = {
        network: Math.random() > 0.2 ? 'HEALTHY' : 'COMPROMISED',
        endpoints: Math.random() > 0.3 ? 'MONITORED' : 'VULNERABLE',
        data: Math.random() > 0.1 ? 'ENCRYPTED' : 'AT_RISK'
      };

      setSystemStatus({
        overall: newStatus,
        components: newComponents
      });
      setAiAssistant({
        status: 'ACTIVE',
        message: 'Scan complete. System status updated.'
      });
      setScanning(false);
    }, 3000);
  };

  const securityTools = [
    {
      id: 'threat-detection',
      title: 'Threat Detection',
      subtitle: 'AI-Powered Analysis',
      icon: '🔍',
      action: () => router.push('/tools/NexusGuard')
    },
    {
      id: 'vulnerability-scan',
      title: 'Vulnerability Scan',
      subtitle: 'System Assessment',
      icon: '🛡️',
      action: () => router.push('/tools/SecurityScanner')
    },
    {
      id: 'incident-response',
      title: 'Incident Response',
      subtitle: 'Automated Actions',
      icon: '🚨',
      action: () => router.push('/tools/IncidentResponse')
    },
    {
      id: 'compliance-check',
      title: 'Compliance Check',
      subtitle: 'Regulatory Audit',
      icon: '📜',
      action: () => router.push('/tools/ComplianceChecker')
    }
  ];

  return (
    <div className="cyberpunk-theme min-h-screen p-8">
      {/* Header - Security Briefing Room */}
      <div className="cyberpunk-text text-5xl font-bold mb-8">
        SECURITY BRIEFING ROOM
      </div>

      {/* AI Assistant Panel */}
      <div className="cyberpunk-hologram p-6 mb-8">
        <div className="cyberpunk-text text-2xl mb-4">
          NEXUS AI ASSISTANT
        </div>
        <div className="cyberpunk-text text-lg mb-4">
          Status:{' '}
          {aiAssistant.status === 'ACTIVE' && (
            <span className="text-matrix-green">ACTIVE</span>
          )}
          {aiAssistant.status === 'ANALYZING' && (
            <span className="text-cyber-purple">ANALYZING</span>
          )}
          {aiAssistant.status === 'IDLE' && (
            <span className="text-neutral">IDLE</span>
          )}
        </div>
        <div className="cyberpunk-text text-base">
          {aiAssistant.message}
        </div>
        <HolographicButton
          onClick={handleScan}
          disabled={scanning}
          loading={scanning}
          className="mt-4"
        >
          {scanning ? 'SCANNING...' : 'RUN SECURITY SCAN'}
        </HolographicButton>
      </div>

      {/* System Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <CyberCard
          title="OVERALL STATUS"
          subtitle={systemStatus.overall}
          variant={systemStatus.overall === 'SECURE' ? 'default' : 'hologram'}
        >
          <div className="cyberpunk-text text-lg">
            {systemStatus.overall === 'SECURE' && '🟢 System secure and operational'}
            {systemStatus.overall === 'WARNING' && '🟡 Potential security issues detected'}
          </div>
        </CyberCard>

        <CyberCard title="NETWORK HEALTH" subtitle={systemStatus.components.network}>
          <div className="cyberpunk-text text-lg">
            {systemStatus.components.network === 'HEALTHY' && '🟢 Network traffic normal'}
            {systemStatus.components.network === 'COMPROMISED' && '🔴 Suspicious network activity'}
          </div>
        </CyberCard>

        <CyberCard title="DATA SECURITY" subtitle={systemStatus.components.data}>
          <div className="cyberpunk-text text-lg">
            {systemStatus.components.data === 'ENCRYPTED' && '🟢 All data encrypted'}
            {systemStatus.components.data === 'AT_RISK' && '🔴 Data encryption compromised'}
          </div>
        </CyberCard>
      </div>

      {/* Recent Threat Reports */}
      <div className="cyberpunk-terminal p-6 mb-8">
        <div className="cyberpunk-text text-lg mb-4">
          RECENT THREAT REPORTS
        </div>
        <div className="cyberpunk-text text-xs">
          {threatReports.length === 0 ? (
            <div className="cyberpunk-text text-center py-4">
              No recent threats detected
            </div>
          ) : (
            threatReports.map(threat => (
              <div
                key={threat.id}
                className="mb-2 p-2 rounded-lg border border-cyber-purple"
              >
                <div className="flex justify-between items-center">
                  <span className="cyberpunk-text">
                    {threat.type} - {threat.severity}
                  </span>
                  <span className="cyberpunk-text text-xs text-cyber-purple">
                    {threat.source}
                  </span>
                </div>
                <div className="cyberpunk-text text-xs text-neutral">
                  {new Date(threat.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Security Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {securityTools.map(tool => (
          <CyberCard
            key={tool.id}
            title={tool.title}
            subtitle={tool.subtitle}
            onClick={tool.action}
          >
            <div className="cyberpunk-text text-3xl">{tool.icon}</div>
          </CyberCard>
        ))}
      </div>

      {/* Command Terminal */}
      <div className="cyberpunk-terminal p-6 mb-8">
        <div className="cyberpunk-text text-lg mb-4">
          SECURITY COMMAND TERMINAL
        </div>
        <TerminalInput
          placeholder="Enter command (scan, status, help, report)"
          onCommand={(command) => {
            console.log('Security command:', command);
            if (command === 'status') {
              alert(`Overall: ${systemStatus.overall}\nNetwork: ${systemStatus.components.network}\nData: ${systemStatus.components.data}`);
            } else if (command === 'help') {
              alert('Available commands: scan, status, help, report');
            }
          }}
        />
      </div>

      {/* Footer - System Info */}
      <div className="cyberpunk-text text-xs text-cyber-purple mt-8">
        NEXUS SECURITY BRIEFING ROOM - AI-POWERED THREAT ANALYSIS
      </div>
    </div>
  );
};

export default SecurityBriefingRoom;