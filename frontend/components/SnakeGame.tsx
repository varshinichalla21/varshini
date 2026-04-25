import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, GameStatus } from '../types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';
import { GlitchText } from './GlitchText';

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const directionRef = useRef(direction);
  const gameBoardRef = useRef<HTMLDivElement>(null);

  // Keep ref in sync with state to avoid rapid double-turn self-collision
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setFood(generateFood(INITIAL_SNAKE));
    setStatus(GameStatus.PLAYING);
    gameBoardRef.current?.focus();
  };

  const pauseGame = () => {
    setStatus(prev => prev === GameStatus.PLAYING ? GameStatus.PAUSED : GameStatus.PLAYING);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (status !== GameStatus.PLAYING) {
      if (e.code === 'Space' && (status === GameStatus.IDLE || status === GameStatus.GAME_OVER)) {
        e.preventDefault();
        startGame();
      } else if (e.code === 'Escape' || e.code === 'KeyP') {
        pauseGame();
      }
      return;
    }

    // Prevent default scrolling for arrow keys and space
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }

    const currentDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
        break;
      case 'Escape':
      case 'p':
      case 'P':
        pauseGame();
        break;
    }
  }, [status]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (status !== GameStatus.PLAYING) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setStatus(GameStatus.GAME_OVER);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setStatus(GameStatus.GAME_OVER);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
          setFood(generateFood(newSnake));
          // Don't pop tail, so it grows
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [status, food, speed]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Header / Score */}
      <div className="w-full flex justify-between items-end mb-4 border-b-2 border-cyan-500 pb-2">
        <GlitchText text="NEURO_SNAKE" as="h1" className="text-2xl text-cyan-400 font-bold tracking-widest" />
        <div className="text-right">
          <div className="text-xs text-fuchsia-500">SCORE_MEM</div>
          <div className="text-xl text-cyan-300">{score.toString().padStart(4, '0')}</div>
        </div>
      </div>

      {/* Game Board Container */}
      <div 
        className="relative w-full aspect-square bg-black border-4 border-cyan-800 shadow-[0_0_30px_rgba(0,255,255,0.2)] outline-none"
        tabIndex={0}
        ref={gameBoardRef}
      >
        {/* Grid Background (Optional, adds to aesthetic) */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)',
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className={`absolute ${index === 0 ? 'bg-cyan-300 z-10' : 'bg-cyan-600'} shadow-[0_0_10px_cyan]`}
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              // Slight inset for blocky look
              transform: 'scale(0.9)'
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-fuchsia-500 shadow-[0_0_15px_fuchsia] animate-pulse z-0"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            transform: 'scale(0.8)'
          }}
        />

        {/* Overlays */}
        {status === GameStatus.IDLE && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
            <GlitchText text="SYSTEM READY" className="text-3xl text-cyan-400 mb-4" />
            <button 
              onClick={startGame}
              className="px-6 py-2 border-2 border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-900 hover:text-white transition-all animate-pulse"
            >
              [ INIT SEQUENCE ]
            </button>
            <p className="mt-4 text-xs text-cyan-700">PRESS SPACE TO START</p>
          </div>
        )}

        {status === GameStatus.PAUSED && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-sm">
            <GlitchText text="PAUSED" className="text-4xl text-fuchsia-500 tracking-widest" />
          </div>
        )}

        {status === GameStatus.GAME_OVER && (
          <div className="absolute inset-0 bg-red-900/40 flex flex-col items-center justify-center z-20 backdrop-blur-sm border-4 border-red-500">
            <GlitchText text="FATAL ERROR" className="text-4xl text-red-500 mb-2" />
            <div className="text-cyan-300 mb-6">FINAL_SCORE: {score}</div>
            <button 
              onClick={startGame}
              className="px-6 py-2 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-900 hover:text-white transition-all"
            >
              [ REBOOT ]
            </button>
          </div>
        )}
      </div>

      {/* Controls Hint */}
      <div className="w-full mt-4 flex justify-between text-xs text-cyan-700">
        <span>WASD / ARROWS : MOVE</span>
        <span>ESC / P : PAUSE</span>
      </div>
    </div>
  );
};
