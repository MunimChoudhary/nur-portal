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
    {
      id: "m3",
      arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
      english: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the Final Return.",
      target: 1,
    },
    {
      id: "m4",
      arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
      english: "O Allah, You are my Lord, there is none worthy of worship but You. You created me and I am your slave. I keep Your covenant, and my pledge to You so far as I am able. (Sayyid al-Istighfar)",
      target: 1,
    }
  ],
  evening: [
    {
      id: "e1",
      arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
      english: "Glory is to Allah and praise is to Him.",
      target: 100,
    },
    {
      id: "e2",
      arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
      english: "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the Final Return.",
      target: 1,
    }
  ],
  after_salah: [
    { id: "s1", arabic: "سُبْحَانَ ٱللَّٰهِ", english: "Glory be to Allah", target: 33 },
    { id: "s2", arabic: "ٱلْحَمْدُ لِلَّٰهِ", english: "Praise be to Allah", target: 33 },
    { id: "s3", arabic: "ٱللَّٰهُ أَكْبَرُ", english: "Allah is the Greatest", target: 34 },
    { 
      id: "s4", 
      arabic: "لا إلهَ إلاّ اللّهُ وَحْـدَهُ لا شريكَ لهُ، لهُ المُلكُ ولهُ الحَمْد، وهُوَ على كلّ شَيءٍ قَدير", 
      english: "None has the right to be worshipped but Allah alone, He has no partner, His is the dominion and His is the praise, and He is Able to do all things.", 
      target: 1 
    }
  ],
  quranic_duas: [
    {
      id: "q1",
      arabic: "رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
      english: "My Lord, indeed I am, for whatever good You would send down to me, in need. (Al-Qasas 28:24)",
      target: 7,
    },
    {
      id: "q2",
      arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      english: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire. (Al-Baqarah 2:201)",
      target: 7,
    },
    {
      id: "q3",
      arabic: "رَّبِّ زِدْنِي عِلْمًا",
      english: "My Lord, increase me in knowledge. (Taha 20:114)",
      target: 7,
    }
  ]
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
