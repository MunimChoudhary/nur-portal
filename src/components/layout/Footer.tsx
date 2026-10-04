import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-8 border-t border-card-border mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-4 text-center">
        <p className="text-sm text-foreground/80 flex items-center justify-center space-x-1">
          <span>Made with</span>
          <Heart className="h-4 w-4 text-accent animate-pulse" />
          <span>by Munim</span>
        </p>
        <p className="text-xs text-foreground/60 italic font-playfair">
          "O Allah, forgive him, have mercy on him, grant him peace and pardon him."
          <br />
          Please keep Munim in your Duas.
        </p>
      </div>
    </footer>
  );
}
