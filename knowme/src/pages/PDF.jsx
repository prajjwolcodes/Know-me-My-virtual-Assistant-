import { useState, useRef, useEffect } from "react";
import { Bot, Send } from "lucide-react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

import { useSearchParams } from "react-router-dom";

export default function PDF() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [pdfFileName, setPdfFileName] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setPdfFileName(searchParams.get("pdf"));
  }, []);

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


      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/pdfanswer`, {
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
    { id: 1, label: "Summarize the Document" },
    { id: 2, label: "What is the document about?" },
  ];

  // Path relative to the public directory
  return (
    <div className="h-screen bg-[#212121] text-white flex">
      {/* PDF Viewer Section */}
      <iframe
        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${pdfFileName}.pdf`}
        title="My PDF Document"
        className="w-1/2 h-full border-none "
        style={{ minHeight: "100%" }}
      >
        This browser does not support PDFs. Please download the PDF to view it:
        <a
          href={`${import.meta.env.VITE_BACKEND_URL}/uploads/${pdfFileName}`}
          download
        >
          Download PDF
        </a>
      </iframe>

      {/* Chat Interface Section */}
      <div className="w-1/2 flex flex-col relative">
        {/* Chat Header */}
        <header className="flex items-center justify-between px-4 py-3.5 border-b border-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">Chat with PDF</span>
          </div>
        </header>
        {/* Chat Input */}
        <div
          className={`flex items-center bg-[#303030] rounded-2xl placeholder-xs sm:rounded-4xl px-2 py-1.5 absolute bottom-4  left-4 right-0 `}
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

        {/* Chat Messages */}
        <div ref={messagesEndRef} className="overflow-y-auto max-h-[calc(100vh-100px)] scroll-container p-4 pl-6 ">
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
        </div>

          {isTyping && (
                    <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300 px-4">
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
        

        {/* Suggested Messages */}
        {messages.length === 0 && (
          <div className="absolute bottom-0 left-2 right-2 sm:left-4 sm:right-4 md:left-0 md:right-0 w-auto md:w-full flex flex-wrap justify-center gap-2 sm:gap-2 mb-20 px-2 md:px-2">
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
      </div>
    </div>
  );
}
