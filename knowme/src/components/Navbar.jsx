// import { Button } from "@/components/ui/button";
import { Brain, FileText, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-2 sm:px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-medium">Chat-JPT</span>

           <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none focus-visible:ring-0">
                        <ChevronDown className="w-4 h-4 text-gray-400 cursor-pointer"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-48 sm:w-56 bg-[#2c2c2c] border-none text-gray-200"
              align="center"
            >
                <DropdownMenuLabel>
                Welcome to Chat-JPT
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-600" />
              <DropdownMenuItem
                asChild
                className="cursor-pointer hover:bg-gray-700"
              >
                <Link to="/upload">
                  PDF Summarizer
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="cursor-pointer hover:bg-gray-700"
              >
                <Link to="/">
                  Chat-JPT
                </Link>
              </DropdownMenuItem>
             
            </DropdownMenuContent>
          </DropdownMenu>
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
  );
};

export default Navbar;