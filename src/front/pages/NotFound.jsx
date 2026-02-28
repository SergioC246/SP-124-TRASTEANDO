const { useEffect, useRef, useState } = React;

const COLOR_PRIMARY = "#1d4ed8";
const COLOR_SECONDARY = "#3b82f6";
const COLOR_ACCENT = "#ef4444";

const GROUND_Y = 320;
const CHAR_W = 60;
const CHAR_H = 70;
const BOX_W = 40;
const BOX_H = 40;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const INITIAL_SPEED = 5;

function newChar() {
    return { x: 80, y: GROUND_Y - CHAR_H, vy: 0, jumpsUsed: 0 };
}

function App() {
    const canvasRef = useRef(null);
    const gameRef = useRef({
        char: newChar(),
        obstacles: [],
        score: 0,
        speed: INITIAL_SPEED,
        running: false,
        dead: false,
        frame: 0,
    });
    const animRef = useRef(null);
    const [score, setScore] = useState(0);
    const [dead, setDead] = useState(false);
    const [started, setStarted] = useState(false);

    const jump = () => {
        const g = gameRef.current;
        if (!g.running) return;
        if (g.char.jumpsUsed < 2) {
            g.char.vy = JUMP_FORCE;
            g.char.jumpsUsed += 1;
        }
    };

    const startGame = () => {
        const g = gameRef.current;
        g.char = newChar();
        g.obstacles = [];
        g.score = 0;
        g.speed = INITIAL_SPEED;
        g.running = true;
        g.dead = false;
        g.frame = 0;
        setScore(0);
        setDead(false);
        setStarted(true);
    };

    useEffect(() => {
        const handleKey = (e) => {
            if (e.code === "Space" || e.code === "ArrowUp") {
                e.preventDefault();
                if (!gameRef.current.running || gameRef.current.dead) {
                    startGame();
                    return;
                }
                jump();
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const drawChar = (char, frame) => {
            const { x, y, jumpsUsed } = char;
            const onGround = jumpsUsed === 0;
            const bounce = onGround ? Math.sin(frame * 0.2) * 3 : 0;
            const drawY = y + bounce;

            ctx.fillStyle = COLOR_SECONDARY;
            ctx.beginPath();
            ctx.moveTo(x + 30, drawY + 75);
            ctx.bezierCurveTo(x - 10, drawY + 40, x - 10, drawY, x + 30, drawY);
            ctx.bezierCurveTo(x + 70, drawY, x + 70, drawY + 40, x + 30, drawY + 75);
            ctx.fill();
            ctx.strokeStyle = COLOR_PRIMARY;
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.roundRect(x + 10, drawY + 15, 40, 45, 5);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = COLOR_ACCENT;
            ctx.beginPath();
            ctx.moveTo(x + 5, drawY + 20);
            ctx.lineTo(x + 30, drawY + 5);
            ctx.lineTo(x + 55, drawY + 20);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#333";
            ctx.beginPath();
            ctx.arc(x + 22, drawY + 35, 3, 0, Math.PI * 2);
            ctx.arc(x + 38, drawY + 35, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 30, drawY + 42, 5, 0, Math.PI);
            ctx.stroke();
        };

        const drawObstacle = (obs) => {
            ctx.fillStyle = "#b97a57";
            ctx.fillRect(obs.x, obs.y, BOX_W, BOX_H);
            ctx.strokeStyle = "#8b4513";
            ctx.lineWidth = 2;
            ctx.strokeRect(obs.x, obs.y, BOX_W, BOX_H);
            ctx.fillStyle = "#8b4513";
            ctx.fillRect(obs.x, obs.y + 15, BOX_W, 10);
        };

        const drawGround = () => {
            ctx.strokeStyle = "#cbd5e1";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, GROUND_Y + 5);
            ctx.lineTo(canvas.width, GROUND_Y + 5);
            ctx.stroke();
        };

        const loop = () => {
            const g = gameRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#f8fafc";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawGround();

            if (!g.running && !g.dead) {
                drawChar(g.char, 0);
                ctx.fillStyle = COLOR_PRIMARY;
                ctx.font = "bold 24px Arial";
                ctx.textAlign = "center";
                ctx.fillText("¡Ayuda a Trasteando a saltar las cajas!", canvas.width / 2, 150);
                ctx.font = "16px Arial";
                ctx.fillStyle = "#64748b";
                ctx.fillText("Pulsa ESPACIO para empezar", canvas.width / 2, 185);
                animRef.current = requestAnimationFrame(loop);
                return;
            }

            if (g.dead) {
                drawChar(g.char, 0);
                g.obstacles.forEach(drawObstacle);
                animRef.current = requestAnimationFrame(loop);
                return;
            }

            // Física
            g.frame++;
            g.char.vy += GRAVITY;
            g.char.y += g.char.vy;

            // Aterrizar → resetear jumpsUsed
            if (g.char.y >= GROUND_Y - CHAR_H) {
                g.char.y = GROUND_Y - CHAR_H;
                g.char.vy = 0;
                g.char.jumpsUsed = 0;
            }

            // Velocidad progresiva
            g.speed = INITIAL_SPEED + Math.floor(g.score / 300) * 0.8;

            // Generar obstáculos
            if (g.obstacles.length === 0 || g.obstacles[g.obstacles.length - 1].x < canvas.width - 350) {
                if (Math.random() < 0.02) {
                    const rand = Math.random();
                    const count = rand > 0.85 ? 3 : (rand > 0.6 ? 2 : 1);
                    for (let i = 0; i < count; i++) {
                        g.obstacles.push({ x: canvas.width + (i * BOX_W), y: GROUND_Y - BOX_H });
                    }
                }
            }

            g.obstacles = g.obstacles.filter(o => o.x > -BOX_W);
            g.obstacles.forEach(o => o.x -= g.speed);

            // Colisión
            const c = g.char;
            for (const o of g.obstacles) {
                if (c.x + 15 < o.x + BOX_W && c.x + CHAR_W - 15 > o.x && c.y + 15 < o.y + BOX_H && c.y + CHAR_H > o.y) {
                    g.running = false;
                    g.dead = true;
                    setDead(true);
                    break;
                }
            }

            g.score++;
            setScore(g.score);

            drawChar(g.char, g.frame);
            g.obstacles.forEach(drawObstacle);

            animRef.current = requestAnimationFrame(loop);
        };

        animRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animRef.current);
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: "#f1f5f9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
                <h1 style={{ fontSize: 80, fontWeight: 900, color: COLOR_PRIMARY, margin: 0 }}>404</h1>
                <h2 style={{ color: "#334155", marginTop: -10 }}>¡Ups! Página no encontrada</h2>
            </div>

            <div style={{ background: "#fff", borderRadius: 20, padding: "10px 30px", marginBottom: 15, border: `2px solid ${COLOR_SECONDARY}`, color: COLOR_PRIMARY, fontWeight: "bold", fontSize: 20 }}>
                SCORE: {String(score).padStart(5, "0")}
            </div>

            <div
                style={{ background: "#fff", borderRadius: 24, border: "4px solid #fff", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", overflow: "hidden", cursor: "pointer" }}
                onClick={() => { if (!gameRef.current.running || gameRef.current.dead) startGame(); else jump(); }}
            >
                <canvas ref={canvasRef} width={800} height={400} />
            </div>

            {dead && (
                <div style={{ marginTop: 20, textAlign: "center" }}>
                    <button onClick={startGame} style={{ background: COLOR_PRIMARY, color: "#fff", border: "none", borderRadius: 12, padding: "12px 30px", fontWeight: "bold", cursor: "pointer", marginRight: 10 }}>Reintentar</button>
                    <button onClick={() => window.location.href = "/"} style={{ background: "#fff", color: COLOR_PRIMARY, border: `2px solid ${COLOR_PRIMARY}`, borderRadius: 12, padding: "12px 30px", fontWeight: "bold", cursor: "pointer" }}>Ir al Inicio</button>
                </div>
            )}
        </div>
    );
}
