import { useEffect, useState, useRef } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  Search,
  Heart,
  CircleUserRound,
  KeyRound,
  LogOut,
  BaggageClaim,
  LoaderCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn, openLoginModal } from "@/lib/utils";
import Cart from "./Cart";
import { logout, selectUser } from "@/app/User/userSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  collectionData,
  FetchCollectionAsync,
} from "@/app/collection/collectionSlice";
import { useSelector } from "react-redux";
import {
  fetchWishlistAsync,
  selectWishlistProducts,
} from "@/app/wishList/wishlistSlice";
import { useNavbarVisibility } from "@/context/NavbarVisiblityContext";
import MobileNavbar from "./MobileNavbar";
// import logo from 'src\assets\Images\velor_(1)[1].png'
import Valor from "@/assets/Images/velor_(1)[1].png";


export default function Navbar() {
  // The `activeMenu` state is used to track which top-level menu (e.g., "shop" or "about") is currently open or active in the navbar.
  // It controls the display of the corresponding mega menu dropdown.
  // When `activeMenu` is set (e.g., "shop"), the mega menu for that section is shown; when it is null, no mega menu is shown.

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchKey, setSearchKey] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAppSelector(selectUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { pathname } = useLocation();
  const wishlistItems = useSelector(selectWishlistProducts);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const { visible, setVisible } = useNavbarVisibility(); // Use context

  useEffect(() => {
    if (token) {
      !wishlistItems && dispatch(fetchWishlistAsync());
    }
  }, [wishlistItems, dispatch, token]);

  useEffect(() => {
    if (searchKey) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
    setIsLoading(false);
  }, [searchKey]);

  const handleMenuOpen = (menu: string) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMenuClose = () => {
    closeTimeoutRef.current = setTimeout(() => setActiveMenu(null), 300);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchKey) {
        navigate(`?query=${searchKey}`);
      } else {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("query");
        navigate(`?${newParams.toString()}`, { replace: true });
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchKey, navigate, searchParams]);

  const handleLoginBtn = () => {
    console.log(isAuthenticated)
    if (isAuthenticated) {
      navigate("/user/profile");
      return;
    }
    openLoginModal(`${pathname}`);
  };

  const collection = useAppSelector(collectionData);

  useEffect(() => {
    !collection && dispatch(FetchCollectionAsync());
  }, [collection, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos > prevScrollPos && currentScrollPos > 80) {
        // Scrolling down
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos, setVisible]);

  const megaMenus = {
    shop: {
      categories: [
        {
          title: "Clothing",
          items: [
            {
              title: "Shirts",
              link: "/category",
              children: [
                { title: "Linen", link: "/category?fabric=Linen" },
                { title: "Cotton", link: "/category?fabric=Cotton" },
              ],
            },
          ],
        },
        {
          title: "Collections",
          items:
            collection?.map((i) => ({
              title: i.collectionName,
              link: `collection/${i.id}`,
            })) || [],
        },
      ],
    },
    about: {
      sections: [
        {
          title: "Overview",
          items: [
            { title: "About Us", link: "/aboutus", children: [] },
            { title: "Privacy Policy", link: "/privacy-policy", children: [] },
          ],
        },
      ],
    },
  };

  return (
    <nav className="w-full">
      <div className="w-full h-[88px]" />
      <div
        className={cn(
          "w-full fixed border-b-4 bg-white z-50 top-0 right-0 left-0 transition-transform duration-0 ease-in-out",
          visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}
      >
        {/* Rest of the Navbar code remains unchanged */}
        <nav className="hidden sm:block">
          <div className="container mx-auto px-4">
            <div className="flex max-w-7xl mx-auto py-5 items-center justify-between">
              <div className="flex font-custom items-center space-x-8">
                <div
                  className="p-4 transition-colors duration-300"
                  onMouseEnter={() => handleMenuOpen("shop")}
                  onMouseLeave={handleMenuClose}
                >
                  <h2
                    className={cn(
                      "text-sm transition-colors duration-300",
                      activeMenu === "shop"
                        ? "text-logoGreen"
                        : "text-gray-900 hover:text-gray-600"
                    )}
                  >
                    Shop
                  </h2>
                </div>
                <div
                  className="p-4 transition-colors duration-300"
                  onMouseEnter={() => handleMenuOpen("about")}
                  onMouseLeave={handleMenuClose}
                >
                  <h2
                    className={cn(
                      "text-sm transition-colors duration-300",
                      activeMenu === "about"
                        ? "text-logoGreen"
                        : "text-gray-900 hover:text-gray-600"
                    )}
                  >
                    About Us
                  </h2>
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <Link preventScrollReset={true} to="/">
                  <div className="flex flex-col items-center">
                    <img
                      src= {Valor}
                      alt="Logo"
                      className="w-24 object-contain"
                    />
                  </div>
                </Link>
              </div>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {(pathname == "/category" ||
                    pathname?.includes("collection")) && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-64 bg-white rounded-lg">
                      <Input
                        id={searchKey}
                        className="peer pe-9 ps-9 border border-gray-600 rounded-lg w-full"
                        placeholder="Search for Shirts..."
                        type="search"
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                      />
                      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                        {isLoading ? (
                          <LoaderCircle
                            className="animate-spin"
                            size={16}
                            strokeWidth={2}
                            role="status"
                            aria-label="Loading..."
                          />
                        ) : (
                          <Search
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {!isAuthenticated ? (
                  <CircleUserRound
                    className="cursor-pointer"
                    onClick={handleLoginBtn}
                  />
                ) : (
                  <Dialog>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <CircleUserRound className="cursor-pointer text-blue-600" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DialogTrigger asChild>
                          <DropdownMenuItem
                            onClick={handleLoginBtn}
                            className="cursor-pointer"
                          >
                            <KeyRound className="mr-2 h-4 w-4" />
                            <span>Account</span>
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => navigate("/user/orders")}
                          className="cursor-pointer"
                        >
                          <BaggageClaim className="mr-2 h-4 w-4" />
                          <span>Orders</span>
                        </DropdownMenuItem>
                        {isAuthenticated ? (
                          <DropdownMenuItem
                            onClick={() => {
                              localStorage.removeItem("token");
                              dispatch(logout());
                              dispatch({ type: "RESET_STORE" });
                              navigate("/");
                            }}
                            className="cursor-pointer group"
                          >
                            <LogOut className="mr-2 h-4 w-4 group-hover:text-destructive" />
                            <span className="group-hover:text-destructive font-medium">
                              Sign out
                            </span>
                          </DropdownMenuItem>
                        ) : (
                          ""
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Dialog>
                )}
                <div className="relative">
                  <Heart
                    className="h-5 w-5 cursor-pointer"
                    onClick={() => {
                      if (!token) {
                        openLoginModal("/wishlist");
                      } else {
                        navigate("/wishlist");
                      }
                    }}
                  />
                  <span className="text-xs h-5 w-5 items-center justify-center text-center flex absolute bottom-3 left-3 bg-[#f0e7d7] text-black font-medium p-1 rounded-full">
                    {wishlistItems?.content.length || 0}
                  </span>
                </div>
                <Cart />
              </div>
            </div>
          </div>
        </nav>
        <div
          className={cn(
            "absolute left-0 font-custom right-0 border-b shadow-md bg-white transition-all duration-300 ease-in-out transform z-30",
            activeMenu
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-4"
          )}
          style={{
            transitionProperty: "opacity, transform, visibility",
          }}
          onMouseEnter={() => {
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
          }}
          onMouseLeave={handleMenuClose}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-7xl mx-auto">
              {activeMenu === "shop" && (
                <div className="grid grid-cols-4 gap-8">
                  {megaMenus.shop.categories
                    .filter((c) => c.items.length >= 1)
                    .map((category) => (
                      <div key={category.title}>
                        <h3 className="font-bold text-logoGreen mb-4">
                          {category.title}
                        </h3>
                        <ul className="space-y-2">
                          {/* Items without children */}
                          {category.items
                            .filter(
                              (item) =>
                                item.children && item.children.length < 1
                            )
                            .map((item) => (
                              <li key={item.title}>
                                <Link
                                  preventScrollReset={true}
                                  to={item.link}
                                  onClick={handleMenuClose}
                                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                  {item.title}
                                </Link>
                              </li>
                            ))}
                          {/* Items with children > 1 */}
                          {category.items
                            .filter(
                              (item) =>
                                item.children && item.children.length > 1
                            )
                            .map((item) => (
                              <li
                                key={item.title}
                                className="flex items-start gap-2 mt-4"
                              >
                                <span className="font-semibold text-gray-800">
                                  {item.title} -{" "}
                                </span>
                                <div className="flex flex-col flex-wrap gap-2">
                                  {item.children.map((child) => (
                                    <Link
                                      key={child.title}
                                      preventScrollReset={true}
                                      to={child.link}
                                      onClick={handleMenuClose}
                                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                      {child.title}
                                    </Link>
                                  ))}
                                </div>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                </div>
              )}
              {activeMenu === "about" && (
                <div className="grid grid-cols-4 gap-8">
                  {megaMenus.about.sections.map((sections) => (
                    <div key={sections.title}>
                      <h3 className="font-medium mb-4">{sections.title}</h3>
                      <ul className="space-y-2">
                        {sections.items.map((item) => (
                          <li key={item.title}>
                            <Link
                              preventScrollReset={true}
                              to={item.link}
                              onClick={handleMenuClose}
                              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <MobileNavbar
          activeMenu={activeMenu}
          handleLoginBtn={handleLoginBtn}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </nav>
  );
}
