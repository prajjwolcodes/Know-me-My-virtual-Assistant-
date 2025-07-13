import "./App.css"
import Navbar from "./components/Navbar"
import Component from "./pages/ChatJPT"
import ChatInterface from './helpers/KnowMe'
import Reply from "./helpers/Reply"

const App = () => {
  return (
    <div className="">
      {/* <Navbar /> */}
      {/* <ChatInterface /> */}
      <Component />
      {/* <Reply /> */}
    </div>
  )
}

export default App