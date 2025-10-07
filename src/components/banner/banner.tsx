import Image from "next/image";

const Banner = () => {
  return (
    <div className="w-full h-[40vh] min-h-[250px] bg-[#111] flex items-center justify-center">
      <div className="relative w-[250px] h-[250px] transition-transform duration-300 hover:scale-105">
        <div className="absolute inset-0 rounded-full shadow-[0_0_20px_2px_rgba(255,255,255,0.1)] z-0" />
        <Image
          src="/img/banner.jpg"
          alt="Banner do Artista do corte"
          fill
          className="object-cover rounded-full z-10"
          priority
        />
      </div>
    </div>
  );
};

export default Banner;
