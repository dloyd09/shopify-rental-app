import React from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "@shopify/polaris";
import HomePage from "./pages/index.jsx";
import "@shopify/polaris/build/esm/styles.css"; // Polaris styles

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AppProvider>
            <HomePage />
        </AppProvider>
    </React.StrictMode>
);
