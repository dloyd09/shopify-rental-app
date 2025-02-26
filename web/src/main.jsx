import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@shopify/polaris/build/esm/styles.css"; // Ensure Polaris styles load
import { AppProvider } from "@shopify/polaris";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AppProvider i18n={{}}>
             <App />
        </AppProvider>
    </React.StrictMode>
);
