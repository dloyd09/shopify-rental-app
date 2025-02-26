import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Page, Card, Button } from "@shopify/polaris";

export default function RentalSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const reservationId = location.state?.reservationId || "N/A";

    return (
        <Page title="Reservation Confirmed">
            <Card sectioned>
                <h2>🎉 Your Rental is Confirmed!</h2>
                <p>Reservation ID: <strong>{reservationId}</strong></p>
                <Button primary onClick={() => navigate("/rental-home")}>Back to Home</Button>
            </Card>
        </Page>
    );
}
