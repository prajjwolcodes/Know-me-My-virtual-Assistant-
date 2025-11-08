import { useEffect } from "react";
import "./App.css";
import Component from "./pages/ChatJPT";
import { Toaster } from "sonner";

const App = () => {
  useEffect(() => {
    document.title = "Chat-JPT";
  }, []);
  return (
    <div className="">
      <Toaster position="top-right" richColors />
      <Component />
    </div>
  );
};

export default App;
