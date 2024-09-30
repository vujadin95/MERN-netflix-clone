import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, LogOut, Menu } from "lucide-react";
import { useAuthStore } from "../store/authUser";
import { useContentStore } from "../store/content";
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const { user, logout } = useAuthStore();
  const { contentType, setContentType } = useContentStore();
  return (
    <header className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h029">
      <div className="flex items-center gap-10 z-50">
        <Link to={"/"}>
          <img
            src="/netflix-logo.png"
            alt="Netflix logo"
            className="w-32 md:w-40"
          />
        </Link>
        {/* desktop navigation */}
        <div className="hidden sm:flex gap-2 items-center">
          <Link
            to={"/"}
            className="hover:underline"
            onClick={() => setContentType("movie")}
          >
            Movies
          </Link>
          <Link
            to={"/"}
            className="hover:underline"
            onClick={() => setContentType("tv")}
          >
            Tv Shows
          </Link>
          <Link to={"/history"} className="hover:underline">
            Search History
          </Link>
        </div>
      </div>
      <div className="flex gap-2 items-center z-50">
        <Link to={"/search"}>
          <Search className="size-6 cursor-pointer" />
        </Link>
        <img
          src={user.image}
          alt="Avatar"
          className="h-8 rounded cursor-pointer"
        />
        <LogOut className="size-6 cursor-pointer" onClick={logout} />

        <div className="sm:hidden">
          <Menu className="size-6 cursor-pointer" onClick={toggleMobileMenu} />
        </div>
      </div>
      {/* mobile navigation */}
      {isMobileMenuOpen && (
        <div className="w-full sm:hidden mt-4 bg-black border rounded border-gray-500 z-50">
          <Link
            className="block hover:underline p-2"
            to={"/"}
            onClick={toggleMobileMenu}
          >
            Movies
          </Link>
          <Link
            className="block hover:underline p-2"
            to={"/"}
            onClick={toggleMobileMenu}
          >
            Tv Shows
          </Link>
          <Link
            className="block hover:underline p-2"
            to={"/history"}
            onClick={toggleMobileMenu}
          >
            Search History
          </Link>
        </div>
      )}
    </header>
  );
};
export default Navbar;
