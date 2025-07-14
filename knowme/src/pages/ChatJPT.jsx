import { Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Bot } from "lucide-react";

import { useEffect, useRef, useState } from "react";

export default function Component() {
  const [messages, setMessages] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        content: inputValue,
        role: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");
      setIsTyping(true);


      console.log(`${import.meta.env.VITE_BACKEND_URL}`)
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/knowme`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: inputValue }),
        });

        if(!res.ok)
            throw new Error("Failed to fetch response from server");

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let result = "";
        let aiMessageId = messages.length + 2; // +1 for user, +1 for AI

        // First: add empty AI message
        setMessages((prev) => [
          ...prev,
          {
            id: aiMessageId,
            content: "",
            role: "ai",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);

          // Split lines (in case of multiple SSE messages in one chunk)
          const lines = chunk
            .split("\n")
            .filter((line) => line.trim().startsWith("data:"));

          for (let line of lines) {
            const cleanText = line.replace("data:", "").trim();

            // Ignore "done" or system messages
            if (cleanText === "done") continue;

            result += cleanText;

            // Update AI message
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === aiMessageId ? { ...msg, content: result } : msg
              )
            );
          }
        }
      } catch (error) {
        console.error("Error streaming message:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: messages.length + 2,
            content: "",
            role: "ai",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messages.length + 2
              ? {
                  ...msg,
                  content:
                    "Prajjwol is having a cup of tea right now, Please try again later.",
                }
              : msg
          )
        );
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedMessages = [
    { id: 1, label: "Tell me about your background." },
    { id: 2, label: "What tech stack do you use?" },
    { id: 3, label: "How can I contact you?" },
  ];

  return (
   <div className="min-h-screen bg-[#212121] px-2 sm:px-4 md:px-6 lg:px-8 py-1 text-[#F3F3F3]">
      {/* Header */}
      <header className="flex items-center justify-between px-2 sm:px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-medium">Chat-JPT</span>

          {/* <ChevronDown className="w-4 h-4 text-gray-400" /> */}
        </div>

        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          <div className="text-xs sm:text-sm text-gray-300">
            <a
              href="https://drive.google.com/file/d/13_vwzQfqgbhdwwnPCmUmlwy9-4_j8v-m/view"
              target="_blank"
            >
              <h1 className="hover:underline cursor-pointer">View my CV</h1>
            </a>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none focus-visible:ring-0">
              <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                <AvatarFallback className=" bg-green-600 cursor-pointer text-white text-xs sm:text-sm font-medium">
                  P
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-48 sm:w-56 bg-[#2c2c2c] border-none text-gray-200"
              align="center"
            >
              <DropdownMenuLabel>
                Prajjwol's Virtual Assistant
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-600" />
              <DropdownMenuItem
                asChild
                className="cursor-pointer hover:bg-gray-700"
              >
                <a href="https://github.com/prajjwolcodes" target="_blank">
                  GitHub
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="cursor-pointer hover:bg-gray-700"
              >
                <a
                  href="https://www.linkedin.com/in/prajjwol-shrestha-078884321/"
                  target="_blank"
                >
                  LinkedIn
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="cursor-pointer hover:bg-gray-700"
              >
                <a href="mailto:shresthaprajjwol4@gmail.com" target="_blank">
                  Mail
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="cursor-pointer hover:bg-gray-700"
              >
                <a
                  href="https://www.instagram.com/prajzwolslimsulek/"
                  target="_blank"
                >
                  Instagram
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`${
          messages.length > 0 ? "justify-start mt-2 sm:mt-4" : "justify-center "
        } flex flex-col items-center  min-h-[calc(100vh-150px)] px-2 sm:px-4`}
      >
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl overflow-y-auto max-h-[calc(100vh-200px)] scroll-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className="mb-4 sm:mb-6 animate-in slide-in-from-bottom-2 duration-300"
            >
              <div className="flex gap-2 sm:gap-4">
                <div className="flex-shrink-0"></div>
                <div
                  className={`flex flex-1 mb-2 sm:mb-4 ${
                    message.role === "user" ? "justify-end " : "justify-start"
                  }`}
                >
                  {/* <div className=""> */}
                  <div
                    className={`text-gray-100 leading-relaxed text-sm sm:text-base ${
                      message.role === "user"
                        ? "bg-[#303030] rounded-2xl sm:rounded-3xl py-2 px-4 sm:px-6"
                        : ""
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Ready message */}
          {messages.length === 0 && (
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-100 px-2">
                Start a Conversation with Prajjwol.
              </h1>
            </div>
          )}

          {isTyping && (
            <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-end space-x-2 sm:space-x-3 max-w-xs lg:max-w-md">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 shadow-sm">
                  <Bot />
                </div>
                <div className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />

          {messages.length === 0 && (
            <div className="fixed bottom-16 md:static left-2 right-2 sm:left-4 sm:right-4 md:left-0 md:right-0 w-auto md:w-full flex flex-wrap justify-center gap-2 sm:gap-2 mb-4 px-2 md:px-2">
              {suggestedMessages.map((msg) => (
                <button
                  key={msg.id}
                  className="bg-[#303030] hover:bg-[#404040] cursor-pointer text-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm transition-colors duration-200 border border-gray-600 hover:border-gray-500 flex-shrink-0"
                  onClick={() => setInputValue(msg.label)}
                >
                  {msg.label}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div className="relative">
           <div
              className={`${
                messages.length > 0
                  ? "chat-input fixed bottom-4 px-2 py-2 left-2 right-2 sm:left-[25%] sm:right-[25%] sm:w-1/2  sm:bottom-6"
                  : "px-2 py-2 md:px-3 fixed bottom-4 sm:static left-2 right-2 sm:px-4 md:py-4 sm:py-6"
              } flex   items-center bg-[#303030] rounded-2xl sm:rounded-4xl `}
            >
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                type="text"
                placeholder="Ask me anything about my life or work."
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-2 md:px-3 md:py-2 text-sm sm:text-base"
              />

              {/* Right side buttons */}
              <div className="flex items-center gap-2 ml-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${
                    inputValue.trim() ? "bg-gray-200 text-black " : " "
                  } hover:bg-gray-300 rounded-full h-8 w-8`}
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
