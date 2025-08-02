import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { store } from "./app/store.ts";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { NavbarVisibilityProvider } from "./context/NavbarVisiblityContext.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Provider store={store}>
    <NavbarVisibilityProvider>
      <App />
    </NavbarVisibilityProvider>
    <Toaster richColors position="top-right" />
  </Provider>
  // </StrictMode>
);
