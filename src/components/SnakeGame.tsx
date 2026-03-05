import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal, RefreshCw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const speed = 120; // Faster for glitch feel

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (!gameOver) setIsPaused(prev => !prev);
          else resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  const update = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, score, generateFood, onScoreChange]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Background with scanlines effect
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (pixelated)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food (Magenta Glitch)
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(
      food.x * cellSize + 2,
      food.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );
    // Glitch shadow for food
    if (Math.random() > 0.9) {
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(food.x * cellSize + 5, food.y * cellSize, cellSize, cellSize - 4);
    }

    // Draw snake (Cyan/Magenta contrast)
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00ffff' : '#ff00ff';
      
      // Pixelated square segments
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );

      // Random glitch offset for head
      if (isHead && Math.random() > 0.95) {
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(segment.x * cellSize - 2, segment.y * cellSize - 2, cellSize + 4, cellSize + 4);
      }
    });
  }, [snake, food]);

  const animate = useCallback((time: number) => {
    if (time - lastUpdateTimeRef.current > speed) {
      update();
      lastUpdateTimeRef.current = time;
    }
    draw();
    gameLoopRef.current = requestAnimationFrame(animate);
  }, [update, draw]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(animate);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [animate]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="crt-border bg-black"
      />
      
      {(gameOver || isPaused) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-grayscale">
          {gameOver ? (
            <div className="text-center p-4 magenta-border bg-black/90">
              <h2 className="text-5xl font-pixel text-glitch-magenta mb-2 glitch-text" data-text="SYSTEM_HALT">SYSTEM_HALT</h2>
              <p className="text-xl font-mono text-glitch-cyan mb-6 tracking-tighter">DATA_LOSS: {score} UNITS</p>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-2 border-2 border-glitch-cyan text-glitch-cyan font-mono hover:bg-glitch-cyan hover:text-black transition-all uppercase"
              >
                <RefreshCw size={18} /> REBOOT_SEQUENCE
              </button>
            </div>
          ) : (
            <div className="text-center p-8 crt-border bg-black/90">
              <h2 className="text-5xl font-pixel text-glitch-cyan mb-8 glitch-text" data-text="IDLE_STATE">IDLE_STATE</h2>
              <button
                onClick={() => setIsPaused(false)}
                className="flex items-center gap-2 px-10 py-4 border-2 border-glitch-magenta text-glitch-magenta font-mono hover:bg-glitch-magenta hover:text-black transition-all uppercase"
              >
                <Terminal size={24} /> INITIALIZE
              </button>
              <p className="mt-4 text-glitch-cyan/50 text-[10px] font-mono tracking-[0.5em]">WAITING_FOR_INPUT</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
