"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Timing {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export function PrayerTimes() {
  const { coordinates, loading: geoLoading, error: geoError } = useGeolocation();
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; diffMs: number } | null>(null);

  const { data, error: apiError, isLoading: apiLoading } = useSWR(
    coordinates
      ? `https://api.aladhan.com/v1/timings?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&method=2`
      : null,
    fetcher
  );

  useEffect(() => {
    if (!data?.data?.timings) return;

    const timings: Timing = data.data.timings;
    const now = new Date();
    
    // Parse times for today
    const prayerTimes = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map((prayer) => {
      const timeStr = timings[prayer as keyof Timing];
      const [hours, minutes] = timeStr.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return { name: prayer, time: timeStr, date };
    });

    // Find the next prayer
    let next = prayerTimes.find((p) => p.date > now);
    if (!next) {
      // If all prayers today have passed, next is Fajr tomorrow
      const timeStr = timings.Fajr;
      const [hours, minutes] = timeStr.split(":").map(Number);
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(hours, minutes, 0, 0);
      next = { name: "Fajr", time: timeStr, date };
    }

    if (next) {
      setNextPrayer({
        name: next.name,
        time: next.time,
        diffMs: next.date.getTime() - now.getTime(),
      });
    }

    // Refresh every minute to update countdown
    const interval = setInterval(() => {
      setNextPrayer((prev) => {
        if (!prev) return prev;
        const newDiff = prev.diffMs - 60000;
        return { ...prev, diffMs: newDiff > 0 ? newDiff : 0 };
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [data]);

  const isLoading = geoLoading || apiLoading;

  if (isLoading) {
    return (
      <section id="prayer-times" className="py-12">
        <h2 className="text-3xl font-playfair font-bold text-center mb-8 text-primary">Daily Prayer Times</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="flex flex-col items-center justify-center p-6 space-y-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (geoError && !coordinates) {
    return (
      <section id="prayer-times" className="py-12 text-center text-red-500">
        <p>Error getting location: {geoError}</p>
      </section>
    );
  }

  if (apiError || !data?.data) {
    return (
      <section id="prayer-times" className="py-12 text-center text-red-500">
        <p>Error loading prayer times. Please try again later.</p>
      </section>
    );
  }

  const timings: Timing = data.data.timings;
  const locationMeta = data.data.meta;
  const prayers = [
    { name: "Fajr", time: timings.Fajr },
    { name: "Sunrise", time: timings.Sunrise },
    { name: "Dhuhr", time: timings.Dhuhr },
    { name: "Asr", time: timings.Asr },
    { name: "Maghrib", time: timings.Maghrib },
    { name: "Isha", time: timings.Isha },
  ];

  const formatCountdown = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <section id="prayer-times" className="py-12">
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-3xl font-playfair font-bold text-primary mb-3">Daily Prayer Times</h2>
        <div className="flex items-center text-foreground/70 space-x-2">
          <MapPin className="h-4 w-4" />
          <span>{locationMeta.timezone}</span>
        </div>
        {geoError && (
          <p className="text-xs text-accent mt-2 max-w-md text-center">{geoError}</p>
        )}
      </div>

      {nextPrayer && (
        <Card className="mb-10 max-w-xl mx-auto bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground/70 font-medium uppercase tracking-wider">Next Prayer</p>
                <h3 className="text-2xl font-playfair font-bold text-foreground">{nextPrayer.name}</h3>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-foreground/70 font-medium uppercase tracking-wider">In</p>
              <p className="text-xl font-bold text-accent">{formatCountdown(nextPrayer.diffMs)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {prayers.map((prayer, index) => {
          const isNext = nextPrayer?.name === prayer.name;
          return (
            <motion.div
              key={prayer.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={cn("text-center h-full", isNext && "border-primary/50 shadow-md shadow-primary/10 ring-1 ring-primary/20")}>
                <CardHeader>
                  <CardTitle className="text-lg">{prayer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-inter font-light">{prayer.time}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
