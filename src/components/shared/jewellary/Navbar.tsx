import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setIsScrolled(y > 0); // true only when scrolled down
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bannerHeight = headerRef.current?.offsetHeight || 0;

  const navLinks = [
    {
      id: 1,
      text: "products",
      links: "/category",
      // links: [
      //   { subLink: "/product/earrings", name: "Earrings" },
      //   { subLink: "/product/pendants", name: "Pendants" },
      //   { subLink: "/product/rings", name: "Rings" },
      //   { subLink: "/product/bracelets", name: "Bracelets" },
      // ],
      // multipleLinks: true,
    },
    {
      id: 2,
      text: "collections",
      links: [
        { subLink: "/collection/all-day-appeal", name: "All Day Appeal" },
        { subLink: "/collection/color-drops", name: "Color Drops" },
        { subLink: "/collection/double-take", name: "Double Take" },
        { subLink: "/collection/hustle-&-heart", name: "Hustle & Heart" },
        { subLink: "/collection/mix-and-match", name: "Mix And Match" },
        { subLink: "/collection/modern-muse", name: "Modern Muse" },
        { subLink: "/collection/facet-pop", name: "Facet Pop" },
      ],
      multipleLinks: true,
    },
    { id: 3, text: "our story", link: "/our-story", multipleLinks: false },
    { id: 4, text: "blogs", link: "/blogs", multipleLinks: false },
    { id: 5, text: "contact", link: "/contact", multipleLinks: false },
  ];

  return (
    <>
      <div className={`w-full h-[81px]  ${isScrolled ? "" : ""}`} />
      <nav
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-full flex backdrop-blur-xl text-white  py-4 bg-transparent items-center justify-around h-[5rem] z-50 transition-all duration-300 
        ${isScrolled ? "fixed top-0 h-[5.5rem]" : "absolute top-0"}`}
      >
        <ul className="flex h-full items-center w-[40%] gap-6 pl-8">
          {navLinks.map((item, index) => {
            const isSingleLink =
              typeof item.link === "string" || typeof item.links === "string";
            const href = item.link || item.links;

            return (
              <li
                key={index}
                className={`relative flex items-center h-full group capitalize text-lg font-extralight cursor-pointer transition-opacity duration-300 nav-link
          ${isScrolled ? "invert" : ""}
        `}
              >
                {isSingleLink ? (
                  <Link to={href}>{item.text}</Link>
                ) : (
                  <>
                    {item.text}
                    {/* Dropdown */}
                    <div className="hidden group-hover:flex flex-col w-[10rem] h-max p-3 absolute top-full backdrop-blur-3xl bg-gray-800 text-white shadow-md rounded z-10">
                      {item.links?.map((link, idx) => (
                        <span
                          key={idx}
                          onClick={() => navigate(link.subLink)}
                          className="py-1 font-light text-lg cursor-pointer nav-link"
                        >
                          {link.name}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>

        <div className="w-[20%] ">
          <Link to="/">
            <img
              src="/logo.png"
              className={`w-full h-full ${isScrolled ? "invert" : ""}`}
              alt="logo"
            />
          </Link>
        </div>

        <div
          className={`flex  h-full w-[40%]  font-light justify-end pr-8 items-center gap-6 ${
            isScrolled ? "invert" : ""
          }`}
        >
          <div
            className={`cursor-pointer  h-full flex items-center ${
              true ? "opacity-100 visible" : "opacity-0 invisible"
            } transition-opacity duration-300 nav-link `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-7 cursor-pointer nav-link nav-link"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>

          <div
            className={`cursor-pointer  h-full flex items-center ${
              true ? "opacity-100 visible" : "opacity-0 invisible"
            } transition-opacity duration-300 nav-link `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-7 cursor-pointer nav-link nav-link"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>

          <div
            className={`cursor-pointer  h-full flex items-center ${
              true ? "opacity-100 visible" : "opacity-0 invisible"
            } transition-opacity duration-300 nav-link `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-7 cursor-pointer nav-link nav-link"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
