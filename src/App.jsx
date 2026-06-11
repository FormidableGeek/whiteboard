import './index.css'
import {Eraser,PaintRoller, BrushCleaning,CarTaxiFront} from 'lucide-react'
import{useRef} from 'react'
export default function App() {
  const canvas = useRef(null);

  function draw(e){
    e.c
  
    const ctx = canvas.current.getContext('2d');
    ctx.strokeStyle= 'red';
    ctx.lineWidth = 2;
    ctx.lineStyle ='round';
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,700);
    ctx.stroke();
  }


    function undraw(e){
  
    const ctx = canvas.current.getContext('2d');
    ctx.strokeStyle= 'white';
    ctx.lineWidth = 2;
    ctx.lineStyle ='round';
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,700);
    ctx.stroke();
  }
  return (
  <main className="bg-gray-200 min-h-screen w-full flex justify-center items-center  ">
    <canvas className='bg-white w-[90vw] h-[90vh] shadow-lg shadow-gray-500'
    ref={canvas}
   

    onMouseOver={draw}
    onMouseLeave={undraw}
    >

    </canvas>
    <div className='absolute top-5 right-5 flex flex-col gap-5 bg-grey-300 p-5 rounded-lg shadow-lg shadow-gray-500'>
      <Eraser/>
      <PaintRoller/>
      <BrushCleaning />
      <CarTaxiFront />
    </div>
  </main>
  )
}