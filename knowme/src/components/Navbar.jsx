// import { Button } from "@/components/ui/button";
import { Brain, FileText, User } from "lucide-react";

const Navbar = () => {
  return (
    <nav>
      <div className="flex justify-between items-center py-4 px-16 bg-gray-100 text-gray-800">
        <h1 className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-gray-800" />
          <span>Know me</span>
        </h1>
        <h1 className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-gray-800" />
          <span>View my CV</span>
        </h1>
      </div>
    </nav>
  );
};

export default Navbar;