import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export function Navbar() {
  return (
    <header className="flex justify-between items-center p-6 pr-0 bg-[#0a0b1e] text-white">
      <div>
        <h1 className="text-3xl text-teal-400 font-bold mb-2">Newton</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="text-indigo-400 text-xs font-bold hover:text-white"
        >
          LOG IN
        </Button>
        <Button
          variant="ghost"
          className="rounded-full border-2 font-bold text-sm border-teal-500 text-white hover:bg-transparent hover:text-teal-400"
        >
          SIGN UP
        </Button>
        <Button variant="ghost" size="icon" className="text-teal-400 mr-4">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
