import React, { useState, useRef, useCallback, useEffect } from "react";
import { Mic, X, MicOff } from "lucide-react";
import botimg from "../assets/bot.png";

const WS_URL = "wss://voice-agent-backend-jnlo.onrender.com/ws";

export default function VoiceAIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | connecting | connected | disconnected | error

  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const workletNodeRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const nextPlayTimeRef = useRef(0);

  // Visualizer refs
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const mergerRef = useRef(null);

  // Ref to always access the latest cleanup without stale closures
  const cleanupRef = useRef(null);

  // -----------------------------------------------------------
  // Playback: receive base64 PCM s16 mono 48kHz → play via AudioContext
  // -----------------------------------------------------------
  const playPcmChunk = useCallback((base64Data) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const raw = atob(base64Data);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);

    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768;
    }

    const audioBuffer = ctx.createBuffer(1, float32.length, 48000);
    audioBuffer.getChannelData(0).set(float32);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;

    // Connect to destination for playback
    source.connect(ctx.destination);

    // Also connect to merger for visualizer (channel 1)
    if (mergerRef.current) {
      try {
        source.connect(mergerRef.current, 0, 1);
      } catch { /* ignore if merger not ready */ }
    }

    const now = ctx.currentTime;
    const PRE_BUFFER = 0.15;
    const earliest = now + PRE_BUFFER;
    const startTime = Math.max(earliest, nextPlayTimeRef.current);
    source.start(startTime);
    nextPlayTimeRef.current = startTime + audioBuffer.duration;
  }, []);

  // -----------------------------------------------------------
  // Visualizer: circular radial bars on canvas
  // -----------------------------------------------------------
  const startVisualizer = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const dpr = window.devicePixelRatio || 1;
      const size = Math.min(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight, 400);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.scale(dpr, dpr);

      const cx = size / 2;
      const cy = size / 2;
      const innerRadius = size * 0.22;
      const maxBarHeight = size * 0.22;

      ctx.clearRect(0, 0, size, size);

      // Compute average level for glow
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
      const avgLevel = sum / bufferLength / 255;

      // Outer glow
      const glowRadius = innerRadius + 20 + avgLevel * 60;
      const gradient = ctx.createRadialGradient(cx, cy, innerRadius * 0.5, cx, cy, glowRadius);
      gradient.addColorStop(0, `rgba(99, 102, 241, ${0.15 + avgLevel * 0.3})`);
      gradient.addColorStop(0.5, `rgba(139, 92, 246, ${0.08 + avgLevel * 0.15})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Radial bars
      const barCount = 80;
      const sliceAngle = (Math.PI * 2) / barCount;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const value = dataArray[dataIndex] / 255;
        const barHeight = Math.max(3, value * maxBarHeight);
        const angle = sliceAngle * i - Math.PI / 2;

        const x1 = cx + Math.cos(angle) * innerRadius;
        const y1 = cy + Math.sin(angle) * innerRadius;
        const x2 = cx + Math.cos(angle) * (innerRadius + barHeight);
        const y2 = cy + Math.sin(angle) * (innerRadius + barHeight);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(${120 + value * 135}, ${80 + value * 100}, 246, ${0.4 + value * 0.6})`;
        ctx.lineWidth = Math.max(2, (size / 200) * 2);
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // Inner circle
      ctx.beginPath();
      ctx.arc(cx, cy, innerRadius - 2, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(139, 92, 246, ${0.3 + avgLevel * 0.4})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner fill
      const innerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerRadius);
      innerGrad.addColorStop(0, `rgba(99, 102, 241, ${0.08 + avgLevel * 0.12})`);
      innerGrad.addColorStop(1, `rgba(30, 27, 75, ${0.15 + avgLevel * 0.1})`);
      ctx.beginPath();
      ctx.arc(cx, cy, innerRadius - 3, 0, Math.PI * 2);
      ctx.fillStyle = innerGrad;
      ctx.fill();

      // Center mic icon indicator
      ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + avgLevel * 0.5})`;
      ctx.font = `${size * 0.08}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🎙", cx, cy);
    };

    draw();
  }, []);

  const stopVisualizer = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  // -----------------------------------------------------------
  // Cleanup (with optional status override)
  // -----------------------------------------------------------
  const cleanup = useCallback((finalStatus = "idle") => {
    stopVisualizer();
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (mergerRef.current) {
      mergerRef.current.disconnect();
      mergerRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    nextPlayTimeRef.current = 0;
    setStatus(finalStatus);
  }, [stopVisualizer]);

  // Keep cleanupRef in sync so WebSocket handlers always use the latest cleanup
  useEffect(() => {
    cleanupRef.current = cleanup;
  }, [cleanup]);

  // -----------------------------------------------------------
  // Start connection
  // -----------------------------------------------------------
  const startConnection = useCallback(async () => {
    setStatus("connecting");

    // 1. Setup AudioContext
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
    const ctx = audioContextRef.current;

    // 2. Get microphone
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      console.error("❌ Mic error:", err);
      setStatus("error");
      return;
    }

    // 3. Setup AudioWorklet for raw PCM capture
    try {
      await ctx.audioWorklet.addModule("/pcm-processor.js");
    } catch (err) {
      console.error("❌ AudioWorklet load error:", err);
      setStatus("error");
      return;
    }

    const sourceNode = ctx.createMediaStreamSource(stream);
    const workletNode = new AudioWorkletNode(ctx, "pcm-processor");
    sourceNodeRef.current = sourceNode;
    workletNodeRef.current = workletNode;

    // 4. Setup analyser for visualizer
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.75;
    analyserRef.current = analyser;

    // Create a channel merger to mix mic + playback for visualizer
    const merger = ctx.createChannelMerger(2);
    mergerRef.current = merger;

    // Connect mic → merger (channel 0) → analyser
    sourceNode.connect(merger, 0, 0);
    merger.connect(analyser);

    // Start visualizer
    startVisualizer();

    // 5. Connect to WebSocket
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setStatus("connected");

      sourceNode.connect(workletNode);

      workletNode.port.onmessage = (event) => {
        const float32Data = event.data;
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(float32Data.buffer);
        }
      };
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "audio") {
          playPcmChunk(msg.data);
        }
      } catch {
        // ignore non-JSON messages
      }
    };

    ws.onclose = (event) => {
      console.log("🔌 WebSocket closed", event.code, event.reason);
      // Use ref to always call the latest cleanup, avoiding stale closures
      // Normal closure (code 1000) → idle; abnormal → disconnected
      const finalStatus = event.code === 1000 ? "idle" : "disconnected";
      if (cleanupRef.current) cleanupRef.current(finalStatus);
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
      // Don't set status here — onclose always fires after onerror,
      // and onclose will set the proper disconnected/error status via cleanup
    };
  }, [playPcmChunk, startVisualizer]);

  // -----------------------------------------------------------
  // Toggle
  // -----------------------------------------------------------
  const handleToggle = async () => {
    if (isOpen) {
      cleanup();
      setIsOpen(false);
    } else {
      setIsOpen(true);
      await startConnection();
    }
  };

  const handleClose = () => {
    cleanup();
    setIsOpen(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  // -----------------------------------------------------------
  // Status config
  // -----------------------------------------------------------
  const statusConfig = {
    idle: { color: "#888", label: "Ready", icon: "idle" },
    connecting: { color: "#f59e0b", label: "Connecting...", icon: "connecting" },
    connected: { color: "#22c55e", label: "Listening...", icon: "connected" },
    disconnected: { color: "#ef4444", label: "Disconnected", icon: "error" },
    error: { color: "#ef4444", label: "Connection Error", icon: "error" },
  };

  const currentStatus = statusConfig[status] || statusConfig.idle;

  return (
    <>
      {/* Full-screen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={handleClose}
            style={{
              animation: "fadeIn 0.3s ease-out",
            }}
          />

          {/* Modal Content */}
          <div
            className="relative z-10 w-full max-w-lg mx-4 flex flex-col items-center"
            style={{
              animation: "scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-0 right-0 md:-top-2 md:-right-2 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200 backdrop-blur-md z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">AI Voice Assistant</h2>
              <p className="text-gray-400 text-xs md:text-sm">Speak to interact with my portfolio</p>
            </div>

            {/* Visualizer Container */}
            <div className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px] flex items-center justify-center mb-6 md:mb-8">
              {/* Animated background rings */}
              <div
                className="absolute inset-0 rounded-full border border-indigo-500/20"
                style={{
                  animation: status === "connected" ? "pulse-ring 2s ease-in-out infinite" : "none",
                }}
              />
              <div
                className="absolute inset-4 rounded-full border border-purple-500/15"
                style={{
                  animation: status === "connected" ? "pulse-ring 2s ease-in-out infinite 0.5s" : "none",
                }}
              />
              <div
                className="absolute inset-8 rounded-full border border-indigo-400/10"
                style={{
                  animation: status === "connected" ? "pulse-ring 2s ease-in-out infinite 1s" : "none",
                }}
              />

              {/* Canvas */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0"
                style={{ borderRadius: "50%" }}
              />

              {/* Center overlay when not connected */}
              {status !== "connected" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 flex items-center justify-center backdrop-blur-sm">
                    {status === "connecting" ? (
                      <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    ) : status === "error" || status === "disconnected" ? (
                      <MicOff className="w-8 h-8 md:w-10 md:h-10 text-red-400" />
                    ) : (
                      <Mic className="w-8 h-8 md:w-10 md:h-10 text-indigo-400" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Status Indicator */}
            <div
              className="flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-md border transition-all duration-300"
              style={{
                background: "rgba(15, 15, 30, 0.8)",
                borderColor: `${currentStatus.color}33`,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: currentStatus.color,
                  boxShadow: `0 0 8px ${currentStatus.color}`,
                  animation: status === "connected" ? "pulse-dot 1.5s ease-in-out infinite" : "none",
                }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: currentStatus.color }}
              >
                {currentStatus.label}
              </span>
            </div>

            {/* Hint text */}
            {status === "connected" && (
              <p className="text-gray-500 text-xs mt-4 text-center animate-pulse">
                Ask me anything about Vikas's work...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Floating AI Button */}
      <button
        onClick={handleToggle}
        className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isOpen
          ? "scale-0 opacity-0 pointer-events-none"
          : "bg-gradient-to-tr from-indigo-600 to-purple-600 hover:scale-110 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
          }`}
      >
        <img src={botimg} alt="AI Assistant" className="w-14 h-14 md:w-16 md:h-16 rounded-full" />
      </button>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.5; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}