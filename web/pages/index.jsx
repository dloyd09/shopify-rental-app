import React, { useState, useEffect, useCallback } from "react";
import { Page, Form, FormLayout, TextField, Select, Button, Card, DatePicker } from "@shopify/polaris";

export default function HomePage() {
    console.log("🏂 Rental Form Loaded!");

    const [customerId, setCustomerId] = useState("");
    const [skiLength, setSkiLength] = useState("");
    const [bootSize, setBootSize] = useState("");
    const [skillLevel, setSkillLevel] = useState("Beginner");
    const [specialRequests, setSpecialRequests] = useState("");
    
    // ✅ Fix: Initialize rentalDate state properly
    const [rentalDate, setRentalDate] = useState({ start: new Date(), end: new Date() });

    // ✅ Fetch Shopify Customer Info
    useEffect(() => {
        async function fetchCustomer() {
            try {
                const response = await fetch("http://localhost:3000/api/shopify-customer");
                const data = await response.json();

                if (data.customerId) {
                    console.log("✅ Fetched Shopify Customer ID:", data.customerId);
                    setCustomerId(data.customerId);  // Auto-fill customer ID
                } else {
                    console.warn("⚠️ No Shopify customer found.");
                }
            } catch (error) {
                console.error("❌ Error fetching Shopify customer:", error);
            }
        }

        fetchCustomer();
    }, []);

    const skillOptions = [
        { label: "Beginner", value: "Beginner" },
        { label: "Intermediate", value: "Intermediate" },
        { label: "Advanced", value: "Advanced" }
    ];

    // ✅ Fix: Define function to handle DatePicker changes
    const handleDateChange = useCallback((newValue) => {
        setRentalDate(newValue);
        console.log("📅 Selected Rental Dates:", newValue);
    }, []);

    const handleSubmit = async () => {
        if (!customerId) {
            alert("❌ No valid customer ID found.");
            return;
        }

        console.log("🏔 Submitting Rental Form:", { 
            customerId, 
            rentalStart: rentalDate.start, 
            rentalEnd: rentalDate.end, 
            skiLength, 
            bootSize, 
            skillLevel, 
            specialRequests 
        });

        const rentalData = {
            customerId,  // ✅ Fix: Corrected variable name
            rentalStart: rentalDate.start,
            rentalEnd: rentalDate.end,
            skiLength,
            bootSize,
            skillLevel,
            specialRequests
        };

        const response = await fetch("http://localhost:3000/api/rentals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rentalData)
        });

        if (response.ok) {
            alert("✅ Rental request submitted successfully!");
        } else {
            alert("❌ Error submitting rental request.");
            console.error("❌ Server Response:", await response.json());
        }
    };

    return (
        <Page title="Create Rental Request">
            <Card sectioned>
                <Form onSubmit={handleSubmit}>
                    <FormLayout>
                        {/* ✅ Read-Only Customer ID (Auto-Filled) */}
                        <TextField label="Customer ID" value={customerId} disabled />

                        {/* ✅ Fix: DatePicker works correctly now */}
                        <DatePicker
                            month={rentalDate.start.getMonth()}
                            year={rentalDate.start.getFullYear()}
                            selected={rentalDate}
                            onChange={handleDateChange}
                            allowRange
                        />

                        <TextField label="Ski Length (cm)" value={skiLength} onChange={setSkiLength} />
                        <TextField label="Boot Size" value={bootSize} onChange={setBootSize} />
                        <Select label="Skill Level" options={skillOptions} onChange={setSkillLevel} value={skillLevel} />
                        <TextField label="Special Requests" value={specialRequests} onChange={setSpecialRequests} multiline />
                        <Button submit primary>Submit Rental</Button>
                    </FormLayout>
                </Form>
            </Card>
        </Page>
    );
}
