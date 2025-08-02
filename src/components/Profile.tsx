import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout, selectUser } from "@/app/User/userSlice";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { openLoginModal } from "@/lib/utils";
import { CircleUserRound, KeyRound, LogOut, BaggageClaim } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Profile = () => {
  const { isAuthenticated } = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const handleLoginBtn = () => {
    if (isAuthenticated) {
      navigate(`${pathname}`);
      return;
    }
    openLoginModal(`${pathname}`);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal(`${pathname}`);
    } else {
      handleLoginBtn();
    }
  }, []);

  return (
    <Dialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <CircleUserRound className="cursor-pointer text-blue-700" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onClick={() => navigate("/user/profile")}
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
              className="cursor-pointer group text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4 group-hover:text-destructive" />
              <span className="group-hover:text-destructive text-destructive font-medium">
                Sign out
              </span>
            </DropdownMenuItem>
          ) : (
            ""
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
};

export default Profile;
