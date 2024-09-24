import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <div>
      <header className="lg:px-16 px-4 bg-white flex flex-wrap items-center py-4 shadow-md">
        <div className="flex-1 flex justify-between items-center">
          <p className="text-xl">KNS OJT</p>
        </div>

        <label htmlFor="menu-toggle" className="pointer-cursor md:hidden block">
          <svg
            className="fill-current text-gray-900"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <title>menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
        </label>
        <input className="hidden" type="checkbox" id="menu-toggle" />

        <div className="hidden md:flex md:items-center md:w-auto w-full" id="menu">
          <nav>
            <ul className="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
              <li >
                <Link
                  to="/post"
                  style={{ textDecoration: 'none' }} 
                  className="text-black px-4 py-2  hover:text-orange-600"
                >
                  Posts
                </Link>
                <Link
                  to="/album"
                  style={{ textDecoration: 'none' }} 
                  className="text-black px-4 py-2 hover:text-orange-600"
                >
                  Album
                </Link>
                <Link
                  to="/user"
                  style={{ textDecoration: 'none' }} 
                  className="text-black px-4 py-2 hover:text-orange-600"
                >
                  User's Tasks
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
