import { useEffect } from "react";
import "./App.css"
import Component from "./pages/ChatJPT"
import TestPDF from "./pages/TestPDF";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Navbar from "./components/Navbar";
import PDF from "./pages/PDF";
import UploadPDF from "./components/UploadPDF";


const App = () => {
   useEffect(() => {
    document.title = 'Chat-JPT';
  }, []);
  return (
    <div className="min-h-screen bg-[#212121] px-2 sm:px-4 md:px-6 lg:px-8 py-1 text-[#F3F3F3]">
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Component />} />
        <Route path="/chat" element={<PDF />} />
        <Route path="/upload" element={<UploadPDF />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App