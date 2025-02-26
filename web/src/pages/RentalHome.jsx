import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page, Card, Button, TextField } from "@shopify/polaris";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonSkiing } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

export default function RentalHome() {
    const location = useLocation();
    const primaryRenterId = location.state?.customerId || null;
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCheckCustomer = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/api/customers/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (response.ok) {
                console.log("✅ Customer Verified:", data);
                navigate("/rental-form", { state: { customerId: data.customerId } }); // Pass customer ID to next page
            } else {
                alert(data.message || "Error verifying customer.");
            }
        } catch (error) {
            console.error("❌ Error checking customer:", error);
            alert("Something went wrong.");
        }
        setLoading(false);
    };

    return (
        <Page title="Ski Rentals">
            <Card sectioned>
                <div style={{ textAlign: "center" }}>
                    <FontAwesomeIcon icon={faPersonSkiing} size="3x" />
                    <h2>Reserve Your Ski Rentals</h2>
                    <TextField 
                        label="Enter your email to get started"
                        value={email}
                        onChange={(value) => setEmail(value)}
                        type="email"
                        autoComplete="email"
                    />
                    <Button primary fullWidth onClick={handleCheckCustomer} loading={loading}>
                        Get Started
                    </Button>
                </div>
            </Card>
        </Page>
    );
}
