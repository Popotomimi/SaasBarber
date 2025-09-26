import { GiComb } from "react-icons/gi";
import { HiMiniScissors } from "react-icons/hi2";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <GiComb />
        </li>
        <li>
          <span>Barbearia</span>
        </li>
        <li>
          <HiMiniScissors />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
