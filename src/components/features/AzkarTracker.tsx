"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Zikr {
  id: string;
  arabic: string;
  english: string;
  target: number;
}

const AZKAR_DATA: Record<string, Zikr[]> = {
  morning: [
    {
      id: "m1",
      arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
      english: "Glory is to Allah and praise is to Him.",
      target: 100,
    },
    {
      id: "m2",
      arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
      english: "I seek the forgiveness of Allah and repent to Him.",
      target: 100,
    },
  ],
  evening: [
    {
      id: "e1",
      arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
      english: "Glory is to Allah and praise is to Him.",
      target: 100,
    },
  ],
  after_salah: [
    { id: "s1", arabic: "سُبْحَانَ ٱللَّٰهِ", english: "Glory be to Allah", target: 33 },
    { id: "s2", arabic: "ٱلْحَمْدُ لِلَّٰهِ", english: "Praise be to Allah", target: 33 },
    { id: "s3", arabic: "ٱللَّٰهُ أَكْبَرُ", english: "Allah is the Greatest", target: 34 },
  ],
};

function ZikrCounter({ zikr }: { zikr: Zikr }) {
  const [count, setCount] = useState(0);
  
  const isComplete = count >= zikr.target;
  const progress = Math.min((count / zikr.target) * 100, 100);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleClick = () => {
    if (count < zikr.target) {
      setCount((prev) => prev + 1);
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer select-none transition-all duration-300",
        isComplete ? "border-primary/50 bg-primary/5" : "hover:border-primary/30"
      )}
      onClick={handleClick}
    >
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex-1 pr-4">
          <p className="font-amiri text-2xl text-foreground mb-2 text-right" dir="rtl">{zikr.arabic}</p>
          <p className="text-sm text-foreground/70">{zikr.english}</p>
        </div>
        
        <div className="relative flex items-center justify-center shrink-0 w-20 h-20">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-card-border"
            />
            {/* Progress circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-primary transition-all duration-300 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex items-center justify-center inset-0">
            {isComplete ? (
              <Check className="h-6 w-6 text-primary" />
            ) : (
              <span className="font-semibold text-lg text-foreground">{count}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AzkarTracker() {
  const [category, setCategory] = useState<keyof typeof AZKAR_DATA>("morning");

  return (
    <section id="azkar" className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-playfair font-bold text-primary mb-4">Interactive Azkar</h2>
        <p className="text-foreground/70">Remember Allah, for in the remembrance of Allah do hearts find rest.</p>
      </div>

      <div className="flex justify-center mb-8 space-x-2">
        {(Object.keys(AZKAR_DATA) as Array<keyof typeof AZKAR_DATA>).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none",
              category === cat 
                ? "bg-primary text-primary-foreground" 
                : "bg-primary/10 text-foreground hover:bg-primary/20"
            )}
          >
            {cat.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {AZKAR_DATA[category].map((zikr) => (
          <ZikrCounter key={zikr.id} zikr={zikr} />
        ))}
      </div>
    </section>
  );
}
