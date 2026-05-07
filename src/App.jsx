import './index.css'
import {Eraser,PaintRoller, BrushCleaning,CarTaxiFront} from 'lucide-react'
export default function App() {
  return (
  <main className="bg-gray-200 min-h-screen w-full flex justify-center items-center  ">
    <div className='bg-white w-[90vw] h-[90vh] shadow-lg shadow-gray-500'>

    </div>
    <div className='absolute top-5 right-5 flex flex-col gap-5 bg-grey-300 p-5 rounded-lg shadow-lg shadow-gray-500'>
      <Eraser/>
      <PaintRoller/>
      <BrushCleaning />
      <CarTaxiFront />
    </div>
  </main>
  )
}