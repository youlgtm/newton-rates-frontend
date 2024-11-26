import { Button } from "@/components/ui/button";
import { Download, Upload, ArrowRightLeft, Coins } from "lucide-react";

export function ActionButtons() {
  return (
    <div className="absolute right-0 top-20 flex flex-col gap-4 pr-4">
      <Button variant="ghost" size="icon" className="text-teal-400">
        <Download className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="text-teal-400">
        <ArrowRightLeft className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="text-teal-400">
        <Upload className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="text-teal-400">
        <Coins className="h-5 w-5" />
      </Button>
    </div>
  );
}
