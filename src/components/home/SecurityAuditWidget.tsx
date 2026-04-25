import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, ChevronRight } from 'lucide-react';

interface CheckItem {
  id: string;
  label: string;
}

const CHECKLIST: CheckItem[] = [
  { id: 'mfa',      label: 'MFA enabled on all critical accounts' },
  { id: 'pwm',      label: 'Using a password manager'             },
  { id: 'updates',  label: 'Software kept up to date'             },
  { id: 'backup',   label: 'Regular backups configured'           },
  { id: 'phishing', label: 'Phishing awareness training done'     },
];

const STORAGE_KEY = 'nexus_security_audit_v1';

export function SecurityAuditWidget() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(checked)); } catch { /* noop */ }
  }, [checked]);

  const score = Math.round((Object.values(checked).filter(Boolean).length / CHECKLIST.length) * 100);

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const scoreColor = score >= 80 ? '#39FF14' : score >= 40 ? '#FFB800' : '#EF4444';

  return (
    <div className="bg-[#16161A] border border-[#27272A] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-[#39FF14]" />
          <h3 className="font-display font-bold text-sm text-white">Security Audit</h3>
        </div>
        <div className="font-mono font-bold text-base" style={{ color: scoreColor }}>
          {score}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[#27272A]">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: scoreColor }}
        />
      </div>

      <ul className="space-y-2">
        {CHECKLIST.map(({ id, label }) => (
          <li key={id}>
            <button
              onClick={() => toggle(id)}
              className="flex items-start gap-2.5 w-full text-left group"
            >
              <span
                className={`mt-0.5 shrink-0 w-4 h-4 border flex items-center justify-center transition-all ${
                  checked[id]
                    ? 'border-[#39FF14] bg-[rgba(57,255,20,0.15)]'
                    : 'border-[#3F3F46] group-hover:border-[#39FF14]'
                }`}
              >
                {checked[id] && <span className="text-[#39FF14] text-[8px] font-bold">✓</span>}
              </span>
              <span className={`text-xs leading-snug transition-colors ${checked[id] ? 'text-zinc-600 line-through' : 'text-zinc-400 group-hover:text-white'}`}>
                {label}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Link
        to="/tools"
        className="flex items-center justify-center gap-2 w-full border border-[#39FF14] text-[#39FF14] hover:bg-[rgba(57,255,20,0.08)] py-2 font-mono text-xs transition-all"
      >
        Full Security Audit <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
