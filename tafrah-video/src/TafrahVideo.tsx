import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Logo } from './Logo';

export const TafrahVideo: React.FC = () => {
  return (
    <AbsoluteFill className="bg-tafrah-light font-arabic text-tafrah-grey flex items-center justify-center text-right" dir="rtl">
      
      {/* Scene 1: Identity (0-5s | Frames 0 - 150) */}
      <Sequence from={0} durationInFrames={180}>
        <Scene1 />
      </Sequence>

      {/* Scene 2: Sensory-Friendly UI (5-15s | Frames 150 - 450) */}
      <Sequence from={150} durationInFrames={330}>
        <Scene2 />
      </Sequence>

      {/* Scene 3: Meet Nour (15-30s | Frames 450 - 900) */}
      <Sequence from={450} durationInFrames={480}>
        <Scene3 />
      </Sequence>

      {/* Scene 4: Vocational Paths (30-45s | Frames 900 - 1350) */}
      <Sequence from={900} durationInFrames={480}>
        <Scene4 />
      </Sequence>

      {/* Scene 5: The Outro (45-60s | Frames 1350 - 1800) */}
      <Sequence from={1350} durationInFrames={450}>
        <Scene5 />
      </Sequence>

    </AbsoluteFill>
  );
};

// --- SCENE COMPONENTS --- //

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({ fps, frame, config: { damping: 200 } });
  const blur = interpolate(frame, [0, 30], [20, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [120, 150], [1, 0]); // Crossfade out

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center bg-white" style={{ opacity }}>
      <div style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)` }}>
        <Logo className="w-64 h-64 mb-10" />
      </div>
      <h1 className="text-6xl font-bold text-tafrah-purpleDark" style={{ opacity: interpolate(frame, [30, 60], [0, 1]) }}>
        طفرة: حيث تزدهر العقول المختلفة.
      </h1>
    </AbsoluteFill>
  );
};

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, 300, 330], [0, 1, 1, 0]);
  const slideUp = interpolate(frame, [0, 60], [100, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center bg-tafrah-light" style={{ opacity }}>
      <div 
        className="w-3/4 h-3/4 bg-white rounded-3xl shadow-2xl border-4 border-tafrah-purpleLight flex items-center justify-center"
        style={{ transform: `translateY(${slideUp}px) rotateX(${interpolate(frame, [0, 100], [20, 0])}deg)` }}
      >
        <p className="text-5xl font-semibold text-tafrah-grey text-center px-20 leading-relaxed">
          واجهة تعليمية مريحة..<br /> مصممة خصيصاً لتناسب احتياجاتك الحسيّة.
        </p>
      </div>
    </AbsoluteFill>
  );
};

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, 450, 480], [0, 1, 1, 0]);
  
  // Pulsing waveform effect
  const pulseScale = 1 + Math.sin(frame / 15) * 0.1;

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center bg-white" style={{ opacity }}>
      <div 
        className="w-80 h-80 rounded-full bg-tafrah-purpleLight flex items-center justify-center relative shadow-xl"
        style={{ transform: `scale(${pulseScale})` }}
      >
        <div className="w-60 h-60 rounded-full bg-tafrah-purple flex items-center justify-center absolute opacity-50" />
        <span className="text-white text-6xl font-bold z-10">نور</span>
      </div>
      <h2 className="text-5xl font-bold text-tafrah-purpleDark mt-16 text-center max-w-4xl leading-relaxed" style={{ opacity: interpolate(frame, [30, 60], [0, 1]) }}>
        قابلي "نور": موجهتك الذكية والداعمة بروح مصرية.
      </h2>
    </AbsoluteFill>
  );
};

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, 450, 480], [0, 1, 1, 0]);
  const elements = ["إدخال بيانات", "تصميم", "تقنيات الذكاء الاصطناعي"];

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center bg-tafrah-light" style={{ opacity }}>
      <div className="flex space-x-12 space-x-reverse mb-16">
        {elements.map((item, i) => {
          const delay = i * 20;
          const slideIn = interpolate(frame - delay, [0, 30], [50, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const itemOpacity = interpolate(frame - delay, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          
          return (
            <div 
              key={i} 
              className="bg-tafrah-purple text-white px-12 py-8 rounded-2xl text-4xl shadow-lg border-b-8 border-tafrah-purpleDark"
              style={{ transform: `translateY(${slideIn}px)`, opacity: itemOpacity }}
            >
              {item}
            </div>
          );
        })}
      </div>
      <h2 className="text-5xl font-bold text-tafrah-grey mt-10" style={{ opacity: interpolate(frame, [90, 120], [0, 1]) }}>
        مسارات مهنية متنوعة تفتح لك أبواب المستقبل.
      </h2>
    </AbsoluteFill>
  );
};

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 45], [0, 1]);
  
  return (
    <AbsoluteFill className="flex flex-col items-center justify-center bg-white" style={{ opacity }}>
      <Logo className="w-56 h-56 mb-12" />
      <h1 className="text-6xl font-extrabold text-tafrah-purpleDark mb-6">
        طفرة.. انطلق نحو قمتك الخاصة.
      </h1>
      <button className="bg-tafrah-purple text-white px-16 py-6 rounded-full text-4xl font-bold mt-8 shadow-2xl transform transition hover:scale-105">
        اشترك الآن
      </button>
    </AbsoluteFill>
  );
};
