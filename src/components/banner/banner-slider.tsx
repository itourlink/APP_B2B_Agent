import { useTranslate } from "@/locales";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

const BannerSlider = ({ slides = [] }: { slides: any[] }) => {
    const { t } = useTranslate("tour");

    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!slides.length) return;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides]);

    const prevSlide = () => {
        setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const nextSlide = () => {
        setIndex((prev) => (prev + 1) % slides.length);
    };

    if (!slides.length) return null;

    return (
        <div className="relative w-full h-150 overflow-hidden">
            {slides.map((slide, i) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-1000 ${i === index
                        ? "opacity-100 z-20"
                        : "opacity-0 z-10 pointer-events-none"
                        }`}
                >
                    <img
                        src={slide.image}
                        alt=""
                        className={`w-full h-full object-cover transition-transform duration-6000 ease-[cubic-bezier(0.22,1,0.36,1)] ${i === index ? "scale-100" : "scale-110"
                            }`}
                    />

                    <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/60" />

                    <div className="absolute bottom-20 left-10 max-w-xl text-white z-30">
                        <h2 className="text-5xl font-bold mb-4 animate-[fadeUp_0.8s_ease]">
                            {t(`${slide.key}.title`)}
                        </h2>
                        <p className="text-lg mb-6 opacity-90 animate-[fadeUp_1s_ease]">
                            {t(`${slide.key}.desc`)}
                        </p>
                        <button className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition">
                            {t("exploreNow")}
                        </button>
                    </div>
                </div>
            ))}

            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
                <button
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer group"
                >
                    <ChevronUp className="text-white/70 group-hover:text-white transition" />
                </button>

                <button
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer group"
                >
                    <ChevronDown className="text-white/70 group-hover:text-white transition" />
                </button>
            </div>

            <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
                {slides.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setIndex(i)}
                        className="w-2 h-8 bg-white/30 cursor-pointer relative rounded-lg"
                    >
                        <div
                            className={`absolute left-0 top-0 w-full bg-white transition-all duration-500 rounded-lg ${i === index ? "h-full" : "h-0"
                                }`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BannerSlider