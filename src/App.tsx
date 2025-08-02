import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import Category from "./pages/Category";
import ProductPage from "./pages/ProductPage";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import TermsAndCondition from "./pages/TermsAndCondition";
import axios from "axios";
import Protected from "./components/shared/Protected";
import { UserProfile } from "./pages/UserProfile";
import Checkout from "./pages/Checkout";
import Wishlist from "./components/shared/Wishlist";
import Orders from "./pages/Orders";
import { useAppDispatch } from "./app/hooks";
import {
  getUserDetails,
  logout,
  setIsAutenticated,
} from "./app/User/userSlice";
import { useEffect, useState } from "react";
import { BASE_URL } from "./lib/constant";
import PostOrderPage from "./pages/PostOrderPage";
import OrderError from "./pages/OrderError";
import Collection from "./pages/Collection";
import Home from "./pages/jewellary/Home";

function App() {
  axios.interceptors.request.use(
    function (config) {
      if (localStorage.getItem("token")) {
        config.headers.Authorization = `${localStorage.getItem("token")}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.clear();
        window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );

  const dispatch = useAppDispatch();
  const [isAppInitializing, setIsAppInitializing] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(logout());
        setIsAppInitializing(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/validateToken`);
        if (response.status === 200) {
          dispatch(setIsAutenticated(true));
          await dispatch(getUserDetails());
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        dispatch(logout());
      } finally {
        setIsAppInitializing(false);
      }
    };

    validateToken();
  }, [dispatch]);

  if (isAppInitializing) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // Main layout wrapping all routes
    children: [
      {
        path: "/",
        element: <Home />, // Home page at root path
      },
      {
        path: "/category",
        element: <Category />,
        handle: { scrollMode: "pathname" },
      },
      {
        path: "/category/products/:productId/:sku",
        element: <ProductPage />,
      },
      {
        path: "/aboutus",
        element: <About />,
      },
      {
        path: "/wishlist",
        element: <Wishlist />,
      },
      {
        path: "/privacy-policy",
        element: <Privacy />,
      },
      {
        path: "/T&C",
        element: <TermsAndCondition />,
      },
      {
        path: "collection/:id",
        element: <Collection />,
      },
    ],
  },
]);

export default App;
