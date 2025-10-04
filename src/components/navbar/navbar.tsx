import Image from "next/image";
import { GiComb } from "react-icons/gi";
import { HiMiniScissors } from "react-icons/hi2";

const Navbar = () => {
  return (
    <nav className="shadow-md py-4 px-6">
      <ul className="flex items-center justify-center gap-10 md:gap-20">
        <li className="text-3xl text-blue-400 hover:text-black transition duration-300">
          <GiComb />
        </li>
        <li>
          <Image
            src="/img/logo.jpg"
            alt="Logo do Artista do corte"
            width={60}
            height={60}
            className="rounded-full object-cover"
          />
        </li>
        <li className="text-3xl text-blue-400 hover:text-black transition duration-300">
          <HiMiniScissors />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
