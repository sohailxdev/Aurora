import { useEffect, useState } from "react";

export const useUrlParam = (param: string) => {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    // Initial check
    const currentParams = new URLSearchParams(window.location.search);
    setValue(currentParams.get(param));

    // Function to update value
    const checkUrlParam = () => {
      const params = new URLSearchParams(window.location.search);
      setValue(params.get(param));
    };

    // Add multiple listeners to ensure comprehensive coverage
    window.addEventListener("popstate", checkUrlParam);
    window.addEventListener("pushstate", checkUrlParam);
    window.addEventListener("replacestate", checkUrlParam);

    // Custom event listener for manual URL changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      const result = originalPushState.apply(this, args);
      window.dispatchEvent(new Event("pushstate"));
      return result;
    };

    history.replaceState = function (...args) {
      const result = originalReplaceState.apply(this, args);
      window.dispatchEvent(new Event("replacestate"));
      return result;
    };

    // Cleanup
    return () => {
      window.removeEventListener("popstate", checkUrlParam);
      window.removeEventListener("pushstate", checkUrlParam);
      window.removeEventListener("replacestate", checkUrlParam);

      // Restore original methods
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [param]);

  return value;
};
