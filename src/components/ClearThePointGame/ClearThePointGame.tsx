import { useEffect, useRef, useState } from "react";

type Point = {
  id: number;
  x: number;
  y: number;
};

export default function ClearThePointGame() {
  const [ratioBox, setRatioBox] = useState({
    width: 0,
    height: 0,
  });
  const [nextPoint, setNextPoint] = useState<number | undefined>(undefined);
  const [arrayPoint, setArrayPoint] = useState<Point[]>([]);
  const [gameStatus, setGameStatus] = useState("idle");
  const [time, setTime] = useState(0);
  const [title, setTitle] = useState({
    title: "LET'S PLAY",
    className: "text-black",
  });
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const circleSize = 40;

  useEffect(() => {
    if (boxRef.current) {
      const box = boxRef.current.getBoundingClientRect();
      setRatioBox({
        width: box.width,
        height: box.height,
      });
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (gameStatus === "playing") {
      interval = setInterval(() => {
        setTime((prevTime) => +(prevTime + 0.1).toFixed(1));
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStatus]);

  const initializeGame = (points: number) => {
    const arr = [];
    for (let i = 0; i < points; i++) {
      arr.push({
        id: i + 1,
        x: Math.floor(Math.random() * (ratioBox.width - circleSize)),
        y: Math.floor(Math.random() * (ratioBox.height - circleSize)),
      });
    }
    setNextPoint(1);
    setTitle({
      title: "LET'S PLAY",
      className: "text-black",
    });
    setArrayPoint(arr);
    setTime(0);
    setGameStatus("playing");
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const points = Number(inputRef.current?.value);
    if (points) {
      initializeGame(points);
    }
  };

  const handleLogicGame = (current: number) => {
    if (current === nextPoint) {
      const newArrayPoint = arrayPoint.filter((item) => item.id !== current);
      setArrayPoint(newArrayPoint);
      if (newArrayPoint.length === 0) {
        setTitle({
          title: "ALL CLEARED",
          className: "text-green-500",
        });
        setGameStatus("finished");
      } else {
        setNextPoint(nextPoint + 1);
      }
    } else {
      setTitle({
        title: "GAME OVER",
        className: "text-red-500",
      });
      setGameStatus("finished");
    }
  };

  const handleRestart = () => {
    const points = Number(inputRef.current?.value);
    if (points) {
      initializeGame(points);
    }
  };

  return (
    <div>
      <h1 className={`mb-5 font-bold ${title.className}`}>{title.title}</h1>
      <form onSubmit={onSubmit}>
        <div className="flex items-center gap-5 mb-5">
          <span>Points:</span>
          <input ref={inputRef} type="number" className="border border-slate-500" />
        </div>
        <p className="mb-5">
          Time: <span className="ml-5">{time.toFixed(1)}s</span>
        </p>
        {gameStatus === "idle" ? (
          <button type="submit" className="px-8 py-1 mb-5 border border-gray-500">
            Play
          </button>
        ) : (
          <button type="button" onClick={handleRestart} className="px-8 py-1 mb-5 border border-gray-500">
            Restart
          </button>
        )}
      </form>
      <div ref={boxRef} className="border border-gray-500 h-[400px] relative">
        {arrayPoint.map((item, index) => {
          const zIndex = arrayPoint.length - index;
          return (
            <div
              onClick={() => handleLogicGame(item.id)}
              className={`size-10 absolute rounded-full transition-all hover:bg-red-500 bg-white border-2 border-gray-500 flex items-center justify-center cursor-pointer`}
              key={item.id}
              style={{ top: `${item.y}px`, left: `${item.x}px`, zIndex: zIndex }}
            >
              {item.id}
            </div>
          );
        })}
      </div>
    </div>
  );
}
