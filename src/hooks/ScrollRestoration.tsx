import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScrollRestorerProps {
  ready: boolean; // wait until products/content is ready
  keyName?: string;
}

export const ScrollRestorer: React.FC<ScrollRestorerProps> = ({
  ready,
  keyName = "scroll-position",
}) => {
  const location = useLocation();

  // Save scroll position before unload or route change
  useEffect(() => {
    const save = () => {
      localStorage.setItem(keyName, `${window.scrollY}`);
    };
    window.addEventListener("beforeunload", save);
    return () => {
      save();
      // window.removeEventListener("beforeunload", save);
    };
  }, [keyName]);

  // Restore after content is ready
  useEffect(() => {
    if (!ready) return;

    const y = localStorage.getItem(keyName);
    if (y !== null) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(y, 10));
      }, 50); // wait a bit for layout to be stable
    }
  }, [ready, location.pathname, keyName]);

  return null;
};
