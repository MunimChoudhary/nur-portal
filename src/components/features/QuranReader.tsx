"use client";

import { useState } from "react";
import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Play, Pause, ChevronRight } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  audio: string;
  text: string;
  numberInSurah: number;
  juz: number;
}

interface SurahDetails {
  number: number;
  name: string;
  englishName: string;
  ayahs: Ayah[];
}

function VerseCard({ ayah, index, englishText }: { ayah: Ayah; index: number; englishText?: string }) {
  const { isPlaying, progress, togglePlay } = useAudio(ayah.audio);

  return (
    <Card className="relative overflow-hidden group">
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center justify-center h-10 w-10 rounded-full border border-primary/30 text-primary font-medium text-sm">
            {ayah.numberInSurah}
          </div>
          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors focus:outline-none"
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </button>
        </div>
        
        <div className="text-right mb-6">
          <p className="font-amiri text-4xl leading-loose text-foreground" dir="rtl">
            {ayah.text}
          </p>
        </div>

        {englishText && (
          <div className="text-left border-t border-card-border pt-4">
            <p className="font-playfair text-lg text-foreground/80 leading-relaxed">
              {englishText}
            </p>
          </div>
        )}
      </CardContent>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-card-border/50">
        <div 
          className="h-full bg-primary transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </Card>
  );
}

export function QuranReader() {
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);

  // Fetch all Surahs
  const { data: surahsData, error: surahsError, isLoading: surahsLoading } = useSWR(
    "https://api.alquran.cloud/v1/surah",
    fetcher
  );

  // Fetch specific Surah details (Arabic + Audio + English translation)
  // Edition ar.alafasy for audio/arabic, en.asad for english
  const { data: surahDetailsData, isLoading: detailsLoading } = useSWR(
    selectedSurah
      ? `https://api.alquran.cloud/v1/surah/${selectedSurah}/editions/quran-uthmani,ar.alafasy,en.asad`
      : null,
    fetcher
  );

  if (surahsLoading) {
    return (
      <section id="quran" className="py-12">
        <h2 className="text-3xl font-playfair font-bold text-center mb-10 text-primary">The Noble Qur'an</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (surahsError || !surahsData?.data) {
    return (
      <section id="quran" className="py-12 text-center text-red-500">
        <p>Error loading Qur'an data.</p>
      </section>
    );
  }

  const surahs: Surah[] = surahsData.data;

  return (
    <section id="quran" className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-playfair font-bold text-primary mb-4">The Noble Qur'an</h2>
        <p className="text-foreground/70 max-w-2xl mx-auto">
          Read, listen, and contemplate the words of Allah.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedSurah ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {surahs.map((surah) => (
              <Card
                key={surah.number}
                className="cursor-pointer group hover:border-primary/50 transition-colors"
                onClick={() => setSelectedSurah(surah.number)}
              >
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {surah.number}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{surah.englishName}</h3>
                      <p className="text-xs text-foreground/60">{surah.englishNameTranslation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-amiri text-xl text-primary">{surah.name}</p>
                    <p className="text-xs text-foreground/60">{surah.numberOfAyahs} Ayahs</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="reader"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <button
              onClick={() => setSelectedSurah(null)}
              className="flex items-center text-sm text-foreground/70 hover:text-primary transition-colors mb-6"
            >
              <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
              Back to Surah List
            </button>

            {detailsLoading || !surahDetailsData ? (
              <div className="space-y-6">
                <Skeleton className="h-12 w-1/3 mx-auto mb-10" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <h3 className="font-amiri text-4xl text-primary mb-2">
                    {surahDetailsData.data[0].name}
                  </h3>
                  <p className="font-playfair text-xl text-foreground/80">
                    {surahDetailsData.data[0].englishName}
                  </p>
                </div>

                <div className="space-y-6">
                  {surahDetailsData.data[1].ayahs.map((ayah: Ayah, index: number) => {
                    // edition 0: quran-uthmani
                    // edition 1: ar.alafasy (audio)
                    // edition 2: en.asad
                    const englishAyah = surahDetailsData.data[2].ayahs[index];
                    const arabicUthmani = surahDetailsData.data[0].ayahs[index];
                    
                    return (
                      <VerseCard 
                        key={ayah.number} 
                        ayah={{...ayah, text: arabicUthmani.text}} 
                        index={index} 
                        englishText={englishAyah.text} 
                      />
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
