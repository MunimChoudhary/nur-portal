import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrayerTimes } from "@/components/features/PrayerTimes";
import { QuranReader } from "@/components/features/QuranReader";
import { AzkarTracker } from "@/components/features/AzkarTracker";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col container mx-auto px-4 py-8">
        
        {/* Hero Section */}
        <section className="py-20 text-center relative">
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none opacity-20 dark:opacity-10">
            <div className="w-[600px] h-[600px] bg-primary rounded-full blur-[120px] mix-blend-multiply" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-playfair font-bold text-foreground mb-6">
            Find <span className="text-primary italic">Light</span> in <br /> Remembrance
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto font-light">
            An elegant portal to keep you connected with your faith through accurate prayer times, the Noble Qur'an, and daily Azkar.
          </p>
        </section>

        {/* Features */}
        <div className="space-y-24 pb-20">
          <PrayerTimes />
          <div className="w-full h-px bg-gradient-to-r from-transparent via-card-border to-transparent" />
          <QuranReader />
          <div className="w-full h-px bg-gradient-to-r from-transparent via-card-border to-transparent" />
          <AzkarTracker />
        </div>

      </main>
      <Footer />
    </>
  );
}
