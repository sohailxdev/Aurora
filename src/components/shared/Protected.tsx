import { useAppSelector } from "@/app/hooks";
import { selectLoading, selectUser } from "@/app/User/userSlice";
import { openLoginModal } from "@/lib/utils";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const Protected: React.FC = () => {
  const { isAuthenticated } = useAppSelector(selectUser);
  const { pathname } = useLocation();
  const loading = useAppSelector(selectLoading);
  if (!localStorage.getItem("token")) {
    openLoginModal(pathname);
  } else if (localStorage.getItem("token") && loading) {
    return <div>Loading...</div>;
  } else {
    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
  }
};

export default Protected;
