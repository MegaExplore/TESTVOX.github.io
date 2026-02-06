import React from 'react';

interface FeedbackOverlayProps {
  show: boolean;
  ok: boolean;
  title: string;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ show, ok, title }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-[#0D1117]/40 backdrop-blur-[4px] flex justify-center items-center z-[2000]">
      <div className="bg-white p-12 rounded-[32px] text-center shadow-card animate-[popIn_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]">
        <span className="text-[5rem] block mb-4">{ok ? '✅' : '❌'}</span>
        <h2 
          className="font-brand text-[1.875rem] font-extrabold m-0"
          style={{ color: ok ? '#10b981' : '#ef4444' }}
        >
          {title}
        </h2>
      </div>
    </div>
  );
};