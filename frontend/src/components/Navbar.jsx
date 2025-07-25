import { useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const closeMenu = () => {
    const menu = menuRef.current;
    if (menu) {
      menu.classList.add("max-h-0", "opacity-0");
      menu.classList.remove("max-h-96", "opacity-100");
    }
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  const toggleMenuBar = () => {
    const menu = menuRef.current;
    if (menu) {
      const isHidden = menu.classList.contains("max-h-0");
      menu.classList.toggle("max-h-0", !isHidden);
      menu.classList.toggle("opacity-0", !isHidden);
      menu.classList.toggle("max-h-96", isHidden);
      menu.classList.toggle("opacity-100", isHidden);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = menuRef.current;
      if (menu && !menu.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-neutral-800 w-full p-4 md:py-1 shadow md:flex items-center justify-between">
      <div className="text-2xl text-center font-bold px-5 py-2 items-center bg-neutral-700 md:bg-neutral-800 min-w-32 rounded flex justify-between">
        <div className="text-amber-200">
          <Link to="/">B A G $</Link>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenuBar}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <ul
        ref={menuRef}
        id="menu-bar"
        className="
          transition-all duration-300 ease-in-out overflow-hidden
          max-h-0 opacity-0
          md:max-h-full md:opacity-100 md:flex md:gap-5 md:items-center
          text-center m-3
        "
      > 
            <li className="shadow-sm md:shadow-none mb-2 md:mb-0 p-2 rounded">
              <Link to="/" onClick={closeMenu} className="hover:text-gray-500 transition-colors">
                Home
              </Link>
            </li>
        {user?.username ? (
          <>
            <li className="shadow-sm md:shadow-none mb-2 md:mb-0 p-2 rounded">
              <Link to="/settings" onClick={closeMenu} className="hover:text-gray-500 transition-colors">
                Account
              </Link>
            </li>
            <li className="shadow-sm md:shadow-none mb-2 md:mb-0 p-2 rounded">
              <button onClick={handleLogout} className="hover:text-gray-500 transition-colors">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="shadow-sm md:shadow-none mb-2 md:mb-0 p-2 rounded">
              <Link to="/login" onClick={closeMenu} className="hover:text-gray-500 transition-colors">
                Login
              </Link>
            </li>
            <li className="shadow-sm md:shadow-none mb-2 md:mb-0 p-2 rounded">
              <Link to="/register" onClick={closeMenu} className="hover:text-gray-500 transition-colors">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
