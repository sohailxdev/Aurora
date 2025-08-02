import { useEffect } from "react";
import { useLocation, useMatches } from "react-router-dom";

const ScrollToTop = (props: any) => {
  const location = useLocation();
  const matches = useMatches();

  const isCategory = matches.some(
    (m) => (m.handle as any)?.scrollMode === "pathname"
  );

  useEffect(() => {
    if (!isCategory) {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }
  }, [location]);

  return <>{props.children}</>;
};

export default ScrollToTop;
