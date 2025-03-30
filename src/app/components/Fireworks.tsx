'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  velocity: number;
}

const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

export default function Fireworks() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio('/sounds/firework.mp3');
    audio.volume = 0.3; // Set volume to 30%
    audioRef.current = audio;

    // Play sound
    audio.play().catch(error => {
      console.log('Audio playback failed:', error);
    });

    const createParticles = () => {
      const newParticles: Particle[] = [];
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 * i) / 50;
        const velocity = 2 + Math.random() * 2;
        newParticles.push({
          id: i,
          x: centerX,
          y: centerY,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 4 + Math.random() * 4,
          angle,
          velocity
        });
      }

      setParticles(newParticles);
    };

    createParticles();

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          initial={{
            x: particle.x,
            y: particle.y,
            scale: 1,
            opacity: 1
          }}
          animate={{
            x: particle.x + Math.cos(particle.angle) * 200 * particle.velocity,
            y: particle.y + Math.sin(particle.angle) * 200 * particle.velocity,
            scale: 0,
            opacity: 0
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut"
          }}
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
          }}
        />
      ))}
    </div>
  );
} 