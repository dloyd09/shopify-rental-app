import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RentalHome from "./pages/RentalHome";
import RentalForm from "./pages/RentalForm";
import RentalSuccess from "./pages/RentalSuccess";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RentalHome />} />
                <Route path="/rental-home" element={<RentalHome />} />
                <Route path="/rental-form" element={<RentalForm />} />
                <Route path="/rental-success" element={<RentalSuccess />} />
            </Routes>
        </Router>
    );
}
