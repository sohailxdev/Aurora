// src/context/NavbarVisibilityContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface NavbarVisibilityContextType {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const NavbarVisibilityContext = createContext<
  NavbarVisibilityContextType | undefined
>(undefined);

export function NavbarVisibilityProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);

  return (
    <NavbarVisibilityContext.Provider value={{ visible, setVisible }}>
      {children}
    </NavbarVisibilityContext.Provider>
  );
}

export function useNavbarVisibility() {
  const context = useContext(NavbarVisibilityContext);
  if (!context) {
    throw new Error(
      "useNavbarVisibility must be used within a NavbarVisibilityProvider"
    );
  }
  return context;
}