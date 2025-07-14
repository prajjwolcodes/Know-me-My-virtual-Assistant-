import { useEffect } from "react";
import "./App.css"
import Component from "./pages/ChatJPT"

const App = () => {
   useEffect(() => {
    document.title = 'Chat-JPT';
  }, []);
  return (
    <div className="">
      <Component />
    </div>
  )
}

export default App