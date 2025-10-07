"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { KeenSliderPlugin } from "keen-slider";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Plugin de autoplay
const Autoplay: KeenSliderPlugin = (slider) => {
  let timeout: ReturnType<typeof setTimeout>;
  let mouseOver = false;

  function clearNextTimeout() {
    clearTimeout(timeout);
  }

  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, 3000);
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });

  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
};

const Carousel = () => {
  const [sliderRef, slider] = useKeenSlider(
    {
      loop: true,
      slides: { perView: 1 },
    },
    [Autoplay]
  );

  const images = Array.from({ length: 8 }, (_, i) => `/img/Corte${i + 1}.jpg`);

  return (
    <div className="w-[90%] max-w-3xl mx-auto mt-8 mb-8 relative">
      {/* Botão Esquerdo */}
      <button
        onClick={() => slider.current?.prev()}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white px-3 py-2 rounded-full shadow transition">
        <ArrowLeft />
      </button>

      {/* Botão Direito */}
      <button
        onClick={() => slider.current?.next()}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white px-3 py-2 rounded-full shadow transition">
        <ArrowRight />
      </button>

      {/* Slides */}
      <div
        ref={sliderRef}
        className="keen-slider rounded-lg overflow-hidden shadow-lg bg-[#1a1a1a]">
        {images.map((src, index) => (
          <div
            key={index}
            className="keen-slider__slide flex items-center justify-center bg-[#1a1a1a] p-4">
            <div className="relative w-[800px] h-[500px] mb-4">
              <Image
                src={src}
                alt={`Corte ${index + 1}`}
                fill
                className="object-contain rounded-md"
                priority={index === 0}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
