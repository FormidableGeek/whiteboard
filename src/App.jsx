import './index.css'
import { Eraser, Pencil, Palette, Minus, Plus, Download } from 'lucide-react'
import { useRef, useState, useEffect, useCallback } from 'react'

export default function App() {
  const canvas = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const [tool, setTool] = useState('pen');       // 'pen' | 'eraser'
  const [color, setColor] = useState('#1a1a2e');
  const [strokeSize, setStrokeSize] = useState(4);

  // Resize canvas to match its CSS display size
  useEffect(() => {
    const el = canvas.current;
    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      el.width = width;
      el.height = height;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const getPos = (e) => {
    const rect = canvas.current.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = useCallback((e) => {
    e.preventDefault();
    isDrawing.current = true;
    lastPos.current = getPos(e);
  }, []);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const ctx = canvas.current.getContext('2d');
    const pos = getPos(e);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = tool === 'eraser' ? strokeSize * 4 : strokeSize;
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPos.current = pos;
  }, [tool, color, strokeSize]);

  const stopDraw = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const clearCanvas = () => {
    const el = canvas.current;
    el.getContext('2d').clearRect(0, 0, el.width, el.height);
  };

  const downloadCanvas = () => {
    const el = canvas.current;
    // Create a temp canvas with white background so transparent areas export cleanly
    const tmp = document.createElement('canvas');
    tmp.width = el.width;
    tmp.height = el.height;
    const ctx = tmp.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, tmp.width, tmp.height);
    ctx.drawImage(el, 0, 0);
    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = tmp.toDataURL('image/png');
    link.click();
  };

  return (
    <main className="bg-gray-200 min-h-screen w-full flex justify-center items-center">
      <canvas
        className='bg-white w-[90vw] h-[90vh] shadow-lg shadow-gray-500'
        ref={canvas}
        style={{ cursor: tool === 'eraser' ? 'cell' : 'crosshair', touchAction: 'none' }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />

      {/* Toolbar — same position as original */}
      <div className='absolute top-5 right-5 flex flex-col gap-5 bg-white p-5 rounded-lg shadow-lg shadow-gray-500'>

        {/* Pen tool */}
        <button
          title="Pen"
          onClick={() => setTool('pen')}
          style={{
            background: tool === 'pen' ? '#e0e7ff' : 'transparent',
            border: tool === 'pen' ? '2px solid #6366f1' : '2px solid transparent',
            borderRadius: '8px',
            padding: '6px',
            cursor: 'pointer',
            color: tool === 'pen' ? '#6366f1' : '#374151',
            transition: 'all 0.2s',
          }}
        >
          <Pencil size={22} />
        </button>

        {/* Eraser tool */}
        <button
          title="Eraser"
          onClick={() => setTool('eraser')}
          style={{
            background: tool === 'eraser' ? '#fce7f3' : 'transparent',
            border: tool === 'eraser' ? '2px solid #ec4899' : '2px solid transparent',
            borderRadius: '8px',
            padding: '6px',
            cursor: 'pointer',
            color: tool === 'eraser' ? '#ec4899' : '#374151',
            transition: 'all 0.2s',
          }}
        >
          <Eraser size={22} />
        </button>

        {/* Color picker */}
        <div title="Color" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <Palette size={22} color={color} style={{ pointerEvents: 'none', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          <input
            type="color"
            value={color}
            onChange={e => { setColor(e.target.value); setTool('pen'); }}
            style={{ width: 34, height: 34, opacity: 0, cursor: 'pointer', borderRadius: '8px' }}
          />
        </div>

        {/* Stroke size increase */}
        <button
          title="Increase stroke"
          onClick={() => setStrokeSize(s => Math.min(s + 2, 40))}
          style={{
            background: 'transparent',
            border: '2px solid transparent',
            borderRadius: '8px',
            padding: '6px',
            cursor: 'pointer',
            color: '#374151',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Plus size={22} />
        </button>

        {/* Stroke size decrease */}
        <button
          title="Decrease stroke"
          onClick={() => setStrokeSize(s => Math.max(s - 2, 1))}
          style={{
            background: 'transparent',
            border: '2px solid transparent',
            borderRadius: '8px',
            padding: '6px',
            cursor: 'pointer',
            color: '#374151',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Minus size={22} />
        </button>

        {/* Stroke preview dot */}
        <div title={`Stroke: ${strokeSize}px`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 34 }}>
          <div style={{
            width: Math.min(strokeSize, 28),
            height: Math.min(strokeSize, 28),
            borderRadius: '50%',
            background: tool === 'eraser' ? '#d1d5db' : color,
            transition: 'all 0.2s',
          }} />
        </div>

        {/* Clear canvas */}
        <button
          title="Clear canvas"
          onClick={clearCanvas}
          style={{
            background: 'transparent',
            border: '2px solid transparent',
            borderRadius: '8px',
            padding: '6px',
            cursor: 'pointer',
            color: '#ef4444',
            fontSize: '18px',
            fontWeight: 'bold',
            lineHeight: 1,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.border = '2px solid #ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.border = '2px solid transparent'; }}
        >
          🗑️
        </button>
        {/* Download as image */}
        <button
          title="Download as PNG"
          onClick={downloadCanvas}
          style={{
            background: 'transparent',
            border: '2px solid transparent',
            borderRadius: '8px',
            padding: '6px',
            cursor: 'pointer',
            color: '#374151',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ecfdf5'; e.currentTarget.style.border = '2px solid #10b981'; e.currentTarget.style.color = '#10b981'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.border = '2px solid transparent'; e.currentTarget.style.color = '#374151'; }}
        >
          <Download size={22} />
        </button>

      </div>
    </main>
  )
}