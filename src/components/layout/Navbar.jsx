import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Heart, ShieldCheck, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Food Types", path: "/food-type-guide" },
  { label: "Nutrition Science", path: "/nutrition-science" },
  { label: "Methodology", path: "/methodology" },
  { label: "Compare", path: "/compare" },
  { label: "Knowledge", path: "/articles" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between md:justify-center lg:justify-between h-20 relative">
          <Link to="/" className="flex items-center gap-3 select-none">
            <img
              src="https://media.base44.com/images/public/69fcdd6b91dd8bf71099f815/9f311d85c_chooseyourpetfood_LOGO_8h_light_outline_Cropped.png"
              alt="chooseyourpetfood logo"
              className="flex-shrink-0 h-[44px] md:h-[76px] w-auto"
              style={{mixBlendMode: 'multiply', background: 'transparent'}}
            />
            <div className="relative flex flex-col items-start leading-none">
              <div className="flex items-baseline gap-0">
                <span style={{fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 4vw, 28px)', fontWeight: 700, color: '#6b7f4a', letterSpacing: '-0.02em'}}>choose</span>
                <span style={{fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 4vw, 28px)', fontWeight: 700, color: '#b85c1a', letterSpacing: '-0.02em'}}>your</span>
                <span style={{fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 4vw, 28px)', fontWeight: 700, color: '#b85c1a', letterSpacing: '-0.02em'}}>pet</span>
                <span style={{fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 4vw, 28px)', fontWeight: 700, color: '#6b7f4a', letterSpacing: '-0.02em'}}>food</span>
                <span style={{fontFamily: 'Inter, sans-serif', fontSize: 'clamp(8px, 2.5vw, 17px)', fontWeight: 500, color: '#6b7f4a', letterSpacing: '-0.01em', paddingBottom: '1px'}}>.com</span>
              </div>
              <svg width="100%" height="8" viewBox="0 0 260 10" preserveAspectRatio="none" style={{marginTop: '2px'}}>
                <path d="M10 8 Q130 -2 250 8" stroke="#c8901a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-4 lg:gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors hover:text-primary group ${
                  location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-primary transition-all duration-300 ${
                  location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            ))}
          </div>

          {/* Right side: user menu + mobile toggle */}
          <div className="flex items-center gap-3 md:absolute md:right-0 lg:static">
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-80 transition-opacity focus:outline-none shrink-0">
                    {user?.full_name
                      ? user.full_name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
                      : user?.email?.[0]?.toUpperCase() || "?"}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="text-xs text-muted-foreground font-normal truncate">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="flex items-center gap-2 cursor-pointer">
                      <Heart className="w-4 h-4" /> Favorites
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/products" className="flex items-center gap-2 cursor-pointer">
                        <ShieldCheck className="w-4 h-4" /> Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="w-4 h-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <button className="lg:hidden" onClick={() => setOpen(!open)}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-border overflow-hidden bg-background"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`block text-base font-medium ${
                    location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <div className="pt-2 border-t border-border" />
                  <Link
                    to="/favorites"
                    onClick={() => setOpen(false)}
                    className={`block text-base font-medium ${
                      location.pathname === "/favorites" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Favorites
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin/products"
                      onClick={() => setOpen(false)}
                      className={`block text-base font-medium ${
                        location.pathname === "/admin/products" ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setOpen(false); }}
                    className="block text-base font-medium text-destructive w-full text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}