import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Register", to: "/user/register" },
    { label: "Login", to: "/user/login" },
    { label: "Admin", to: "/admin/login" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-white/10 ${
        scrolled
          ? "bg-primary/90 backdrop-blur-md shadow-lg h-14"
          : "bg-primary/70 backdrop-blur-md h-20"
      }`}
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)",
      }}
    >
      <div
        className="max-w-7xl mx-auto flex justify-between items-center h-full"
        style={{ paddingLeft: 0, paddingRight: "1.5rem" /* px-6 is 1.5rem */ }}
      >
        {/* Logo with no padding left */}
        <motion.h1
          className="font-heading font-extrabold text-3xl select-none cursor-default"
          style={{
            color: "#00D97E", // bright green from your screenshot
            letterSpacing: "0.05em",
            userSelect: "none",
            marginLeft: 0,
            paddingLeft: 0,
            textShadow:
              "0 0 5px rgba(0, 217, 126, 0.6), 0 2px 5px rgba(0, 217, 126, 0.4)",
          }}
          whileHover={{
            scale: 1.05,
            textShadow:
              "0 0 15px rgba(0, 217, 126, 1), 0 0 20px rgba(0, 217, 126, 0.8)",
            transition: { duration: 0.4, ease: "easeInOut" },
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          PrintXchange
        </motion.h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 pr-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative font-medium transition ${
                  isActive ? "text-secondary" : "text-light hover:text-secondary"
                }`
              }
            >
              {link.label}
              {/* Hover underline animation */}
              <motion.span
                className="absolute -bottom-1 left-0 h-[2px] bg-secondary"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </NavLink>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-light text-2xl pr-6"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-primary/95 backdrop-blur-lg border-t border-white/10"
          >
            <div className="flex flex-col px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="text-light hover:text-secondary font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
