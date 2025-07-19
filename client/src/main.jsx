import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { loadUserFromLocalStorage } from "./redux/authSlice.js";
import { Toaster } from "sonner";
import { PersistGate } from "redux-persist/integration/react";

store.dispatch(loadUserFromLocalStorage());

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          <Toaster richColors position="top-center" expand={true} />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
