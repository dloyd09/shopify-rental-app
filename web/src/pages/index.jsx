import React, { useState, useEffect, useCallback } from "react";
import { Page, Form, FormLayout, TextField, Select, Button, Card, DatePicker, ButtonGroup } from "@shopify/polaris";

export default function HomePage() {
    console.log("🏂 Rental Form Loaded!");

    const [customerId, setCustomerId] = useState("");
    const [skiLength, setSkiLength] = useState("");
    const [bootSize, setBootSize] = useState("");
    const [skillLevel, setSkillLevel] = useState("Beginner");
    const [specialRequests, setSpecialRequests] = useState("");
    
     // ✅ State for DatePicker
    const today = new Date();
    const [rentalDate, setRentalDate] = useState({ start: today, end: today });
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());

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

    // ✅ Handle DatePicker changes
    const handleDateChange = useCallback((range) => {
        console.log("📅 Selected Rental Dates:", range);
        setRentalDate(range);
    }, []);

    // ✅ Handle Month & Year Navigation
    const handleMonthChange = useCallback((newMonth, newYear) => {
        console.log("🔄 Changing Month/Year:", newMonth, newYear);
        setMonth(newMonth);
        setYear(newYear);
    }, []);

    // ✅ Function to navigate previous/next month
    const goToPreviousMonth = () => {
        const newMonth = month === 0 ? 11 : month - 1;
        const newYear = month === 0 ? year - 1 : year;
        setMonth(newMonth);
        setYear(newYear);
    };

    const goToNextMonth = () => {
        const newMonth = month === 11 ? 0 : month + 1;
        const newYear = month === 11 ? year + 1 : year;
        setMonth(newMonth);
        setYear(newYear);
    };

    // ✅ Function to display month names instead of numbers
    const getMonthName = (monthIndex) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[monthIndex];
    };

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

                         {/* ✅ Custom Month & Year Selector */}
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                            {/*<Button onClick={goToPreviousMonth}>← Prev</Button>*/}
                            <h3>{getMonthName(month)}</h3>
                            {/*<Button onClick={goToNextMonth}>Next →</Button>*/}
                        </div>

                        {/* ✅ DatePicker with Month & Year Navigation */}
                        <DatePicker
                            month={month}
                            year={year}
                            selected={rentalDate}
                            onChange={handleDateChange}
                            onMonthChange={handleMonthChange} // ✅ Allows navigation
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
