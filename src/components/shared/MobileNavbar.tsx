import { useState, memo } from "react";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BaggageClaim,
  CircleUserRound,
  Heart,
  KeyRound,
  LogOut,
  Menu,
} from "lucide-react";
import { cn, openLoginModal } from "@/lib/utils";
import { Dialog, DialogTrigger } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Cart from "./Cart";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/app/User/userSlice";
import { selectWishlistProducts } from "@/app/wishList/wishlistSlice";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { motion, AnimatePresence } from "framer-motion";
import Valor from "@/assets/Images/velor_(1)[1].png";

const MobileNavbar = ({
  handleLoginBtn,
  isAuthenticated,
}: {
  handleLoginBtn: () => void;
  isAuthenticated: boolean;
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const wishlistItems = useAppSelector(selectWishlistProducts);
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Animation variants for links
  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1, // Staggered delay for each link
        duration: 0.3,
        ease: "easeOut",
      },
    }),
    hover: {
      scale: 1.05, // Slight scale on hover
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="sm:hidden">
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-5 items-center justify-between">
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <button className="hover:text-gray-300">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <div className="flex font-custom flex-col space-y-6">
                <img src={Valor} alt="" width={50} />
                <AnimatePresence>
                  {isMobileNavOpen && (
                    <>
                      <Accordion
                        type="single"
                        collapsible
                        defaultValue="item-1"
                        className="w-full"
                      >
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="text-lg transition-colors duration-300">
                            Shop
                          </AccordionTrigger>
                          <AccordionContent className="ml-3 flex flex-col space-y-2">
                            <motion.div
                              custom={0}
                              variants={linkVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              whileHover="hover"
                            >
                              <Link
                                preventScrollReset={true}
                                to="/category?fabric=Linen"
                                onClick={() => setIsMobileNavOpen(false)}
                                className={cn(
                                  "text-lg transition-colors duration-300",
                                  location.search === "?fabric=Linen"
                                    ? "text-logoGreen"
                                    : "hover:text-gray-300"
                                )}
                              >
                                Linen
                              </Link>
                            </motion.div>
                            <motion.div
                              custom={1}
                              variants={linkVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              whileHover="hover"
                            >
                              <Link
                                preventScrollReset={true}
                                to="/category?fabric=Cotton"
                                onClick={() => setIsMobileNavOpen(false)}
                                className={cn(
                                  "text-lg transition-colors duration-300",
                                  location.search === "?fabric=Cotton"
                                    ? "text-logoGreen"
                                    : "hover:text-gray-300"
                                )}
                              >
                                Cotton
                              </Link>
                            </motion.div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      <motion.div
                        custom={2}
                        variants={linkVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        whileHover="hover"
                      >
                        <Link
                          preventScrollReset={true}
                          to="/aboutus"
                          onClick={() => setIsMobileNavOpen(false)}
                          className={cn(
                            "text-lg transition-colors duration-300",
                            location.pathname === "/aboutus"
                              ? "text-logoGreen"
                              : "hover:text-gray-300"
                          )}
                        >
                          About Us
                        </Link>
                      </motion.div>
                      <motion.div
                        custom={3}
                        variants={linkVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        whileHover="hover"
                      >
                        <Link
                          preventScrollReset={true}
                          to="/privacy-policy"
                          onClick={() => setIsMobileNavOpen(false)}
                          className={cn(
                            "text-lg transition-colors duration-300",
                            location.pathname === "/privacy-policy"
                              ? "text-logoGreen"
                              : "hover:text-gray-300"
                          )}
                        >
                          Privacy Policy
                        </Link>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex w-full justify-between">
            <Link preventScrollReset={true} to="/">
              <div className="flex flex-col items-center">
                <img
                  src={Valor}
                  alt="Logo"
                  className="w-10 object-contain"
                />
              </div>
            </Link>
            <div className="flex items-center space-x-4">
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
                            dispatch(logout());
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
      </div>
    </div>
  );
};

export default memo(MobileNavbar);
