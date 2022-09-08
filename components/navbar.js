import Link from "next/link";
import Image from "next/image";
import DarkMode from "../components/dark-mode";
import { motion } from "framer-motion";

function Navbar ()
{
  const icon = {
    hidden: {
      opacity: 0,
      pathLength: 0,
      fill: "rgba(255, 255, 255, 0)"
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      fill: "rgba(255, 255, 255, 1)"
    }
  };

  return (
    <div className="navbar bg-primary dark:bg-teal-500">
      <div className="navbar-start">
        <motion.div className="dropdown">
          <label tabIndex="0" className="btn btn-ghost md:hidden">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#fff"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
                variants={ icon }
                initial="hidden"
                animate="visible"
                transition={ {
                  default: { duration: 1, ease: "easeInOut" },
                  fill: { duration: 1, ease: [ 1, 0, 0.8, 1 ] }
                } }
              />
            </motion.svg>
          </label>
          <ul
            tabIndex="0"
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-primary rounded-box w-52 text-accent"
          >
            <li>
              <Link href="/cookbooks">
                <a>COOKBOOKS</a>
              </Link>
            </li>

            <li>
              <Link href="/bookmarks">
                <a>BOOKMARKS</a>
              </Link>
            </li>

            <li>
              <Link href="/login">
                <a>LOGIN</a>
              </Link>
            </li>
          </ul>
        </motion.div>
        <Link href="/">
          <Image src="/logo.png" className="cursor-pointer" width={ 170 } height={ 45 } alt="Logo" />
        </Link>
      </div>

      {/* Desktop Navbar */}
      <div className="navbar-center hidden md:flex text-accent font-semibold">
        <ul className="menu menu-horizontal p-0">
          <li>
            <Link href="/cookbooks">
              <a>COOKBOOKS</a>
            </Link>
          </li>

          <li>
            <Link href="/bookmarks">
              <a>BOOKMARKS</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <Link href="/login">
          <a className="btn border-accent bg-transparent text-accent hover:border-accent hover:bg-accent hover:text-primary hidden md:flex">
            login
          </a>
        </Link>
        <DarkMode />
      </div>
    </div>
  );
}

export default Navbar;
