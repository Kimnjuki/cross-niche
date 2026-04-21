import React, { useState, useEffect } from 'react';
import CyberCard from '../components/ui/cyber/CyberCard';
import HolographicButton from '../components/ui/cyber/HolographicButton';
import TerminalInput from '../components/ui/cyber/TerminalInput';
import { useRouter } from 'next/navigation';

const VRCyberTraining: React.FC = () => {
  const router = useRouter();
  const [trainingModules, setTrainingModules] = useState([
    {
      id: 'phishing-defense',
      title: 'Phishing Defense',
      description: 'Identify and neutralize phishing attempts',
      difficulty: 'BEGINNER',
      completed: false,
      progress: 0
    },
    {
      id: 'malware-analysis',
      title: 'Malware Analysis',
      description: 'Analyze and disarm malicious code',
      difficulty: 'INTERMEDIATE',
      completed: false,
      progress: 0
    },
    {
      id: 'network-intrusion',
      title: 'Network Intrusion',
      description: 'Defend against network attacks',
      difficulty: 'ADVANCED',
      completed: false,
      progress: 0
    },
    {
      id: 'social-engineering',
      title: 'Social Engineering',
      description: 'Counter human-targeted attacks',
      difficulty: 'EXPERT',
      completed: false,
      progress: 0
    }
  ]);
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [simulationActive, setSimulationActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    // Load training progress from local storage
    const savedProgress = localStorage.getItem('cyberTrainingProgress');
    if (savedProgress) {
      setTrainingModules(JSON.parse(savedProgress));
    }
  }, []);

  const startSimulation = (moduleId: string) => {
    const module = trainingModules.find(m => m.id === moduleId);
    if (module) {
      setCurrentModule(moduleId);
      setSimulationActive(true);
      setScore(0);
      setTimeRemaining(60); // 60 seconds per simulation

      // Start countdown timer
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setSimulationActive(false);
            completeModule(moduleId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const completeModule = (moduleId: string) => {
    setTrainingModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, completed: true, progress: 100 } : m
    ));
    localStorage.setItem('cyberTrainingProgress', JSON.stringify(trainingModules));
  };

  const securityScenarios = [
    {
      id: 'data-breach',
      title: 'Data Breach Response',
      description: 'Handle a simulated data breach scenario',
      icon: '🚨',
      action: () => alert('Data breach simulation started!')
    },
    {
      id: 'ransomware-attack',
      title: 'Ransomware Attack',
      description: 'Defend against ransomware encryption',
      icon: '🔒',
      action: () => alert('Ransomware defense simulation started!')
    },
    {
      id: 'ddos-defense',
      title: 'DDoS Defense',
      description: 'Mitigate distributed denial-of-service attack',
      icon: '🌊',
      action: () => alert('DDoS defense simulation started!')
    }
  ];

  return (
    <div className="cyberpunk-theme min-h-screen p-8">
      {/* Header - VR Cyber Training */}
      <div className="cyberpunk-text text-5xl font-bold mb-8">
        VR CYBER TRAINING
      </div>

      {/* Training Overview */}
      <div className="cyberpunk-hologram p-6 mb-8">
        <div className="cyberpunk-text text-2xl mb-4">
          IMMERSIVE CYBERSECURITY TRAINING
        </div>
        <div className="cyberpunk-text text-base mb-4">
          Experience realistic cybersecurity scenarios in a virtual environment.{' '}
          Complete training modules to improve your security skills and earn certifications.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="cyberpunk-text text-center">
            <div className="cyberpunk-text text-3xl font-bold mb-1">
              {trainingModules.filter(m => m.completed).length}
            </div>
            <div className="cyberpunk-text text-sm">
              MODULES COMPLETED
            </div>
          </div>
          <div className="cyberpunk-text text-center">
            <div className="cyberpunk-text text-3xl font-bold mb-1">
              {trainingModules.length}
            </div>
            <div className="cyberpunk-text text-sm">
              TOTAL MODULES
            </div>
          </div>
          <div className="cyberpunk-text text-center">
            <div className="cyberpunk-text text-3xl font-bold mb-1">
              {timeRemaining}
            </div>
            <div className="cyberpunk-text text-sm">
              TIME REMAINING
            </div>
          </div>
        </div>
      </div>

      {/* Training Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {trainingModules.map(module => (
          <CyberCard
            key={module.id}
            title={module.title}
            subtitle={module.description}
            variant={module.completed ? 'hologram' : 'default'}
          >
            <div className="cyberpunk-text text-base mb-2">
              Difficulty:{' '}
              <span className={`cyberpunk-text text-${module.difficulty.toLowerCase()}`}>
                {module.difficulty}
              </span>
            </div>
            <div className="cyberpunk-text text-sm text-neutral mb-2">
              Progress: {module.progress}%
            </div>
            <div className="flex justify-between items-center">
              <HolographicButton
                onClick={() => startSimulation(module.id)}
                disabled={simulationActive || module.completed}
                className="text-xs"
              >
                {module.completed ? 'COMPLETED' : 'START TRAINING'}
              </HolographicButton>
              {module.completed && (
                <div className="cyberpunk-text text-green-500">
                  ✓
                </div>
              )}
            </div>
          </CyberCard>
        ))}
      </div>

      {/* Real-time Security Scenarios */}
      <div className="cyberpunk-terminal p-6 mb-8">
        <div className="cyberpunk-text text-lg mb-4">
          REAL-TIME SECURITY SCENARIOS
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityScenarios.map(scenario => (
            <CyberCard
              key={scenario.id}
              title={scenario.title}
              subtitle={scenario.description}
              onClick={scenario.action}
            >
              <div className="cyberpunk-text text-3xl">{scenario.icon}</div>
            </CyberCard>
          ))}
        </div>
      </div>

      {/* Training Statistics */}
      <div className="cyberpunk-hologram p-6 mb-8">
        <div className="cyberpunk-text text-xl mb-4">
          TRAINING STATISTICS
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="cyberpunk-text">
            <div className="cyberpunk-text text-2xl font-bold mb-1">
              {score}
            </div>
            <div className="cyberpunk-text text-sm">
              CURRENT SCORE
            </div>
          </div>
          <div className="cyberpunk-text">
            <div className="cyberpunk-text text-2xl font-bold mb-1">
              {trainingModules.filter(m => m.completed).length}/{trainingModules.length}
            </div>
            <div className="cyberpunk-text text-sm">
              MODULES COMPLETED
            </div>
          </div>
        </div>
      </div>

      {/* Command Terminal */}
      <div className="cyberpunk-terminal p-6 mb-8">
        <div className="cyberpunk-text text-lg mb-4">
          TRAINING COMMAND TERMINAL
        </div>
        <TerminalInput
          placeholder="Enter command (start, status, help, report)"
          onCommand={(command) => {
            console.log('Training command:', command);
            if (command === 'status') {
              alert(`Active Module: ${currentModule || 'None'}\nScore: ${score}\nTime: ${timeRemaining}s`);
            } else if (command === 'help') {
              alert('Available commands: start, status, help, report');
            }
          }}
        />
      </div>

      {/* Footer - Training Info */}
      <div className="cyberpunk-text text-xs text-cyber-purple mt-8">
        NEXUS VR CYBER TRAINING - IMMERSIVE SECURITY EDUCATION
      </div>
    </div>
  );
};

export default VRCyberTraining;