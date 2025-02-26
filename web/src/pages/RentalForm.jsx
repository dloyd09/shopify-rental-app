import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Page, Card, Form, FormLayout, TextField, Select, Button, DatePicker } from "@shopify/polaris";

export default function RentalForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const primaryRenterId = location.state?.customerId || null;
    console.log("🛠 Primary Renter ID:", primaryRenterId);

    const today = new Date();
    const [rentalDate, setRentalDate] = useState({ start: today, end: today });
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());
    const [specialRequests, setSpecialRequests] = useState("");

    // ✅ State to store additional renters
    const [renters, setRenters] = useState([
        { firstName: "", lastName: "", height: "", weight: "", skillLevel: "Beginner", skiLength: "", bootSize: "" }
    ]);

    const handleDateChange = useCallback((range) => {
        if (!range || !range.start || !range.end) return;
        console.log("📅 Selected Rental Dates:", range);
        setRentalDate(range);
    }, []);

    const handleMonthChange = useCallback((newMonth, newYear) => {
        console.log("🔄 Changing Month/Year:", newMonth, newYear);
        setMonth(newMonth);
        setYear(newYear);
    }, []);

    const getMonthName = (monthIndex) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[monthIndex];
    };

    // ✅ Function to add a new renter
    const addRenter = () => {
        setRenters([...renters, { firstName: "", lastName: "", height: "", weight: "", skillLevel: "Beginner", skiLength: "", bootSize: "" }]);
    };

    // ✅ Function to handle changes in renter input fields
    const handleRenterChange = (index, field, value) => {
        const updatedRenters = [...renters];
        updatedRenters[index][field] = value;
        setRenters(updatedRenters);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!primaryRenterId) {
            alert("❌ Primary renter ID is missing.");
            return;
        }

        console.log("🏂 Submitting Rental:", {
            shopifyCustomerId: primaryRenterId,
            rentalStart: rentalDate.start, // ✅ Use rentalDate.start
            rentalEnd: rentalDate.end, // ✅ Use rentalDate.end
            renters,
            specialRequests
        });

        const response = await fetch("http://localhost:3000/api/rentals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                shopifyCustomerId: primaryRenterId,
                rentalStart: rentalDate.start,
                rentalEnd: rentalDate.end,
                renters,
                specialRequests
            })
        });

        if (response.ok) {
            //alert("✅ Rental request submitted successfully!");
            navigate("/rental-success", { state: { reservationId: (await response.json()).rental._id } });
        } else {
            alert("❌ Error submitting rental request.");
            console.error("❌ Server Response:", await response.json());
        }
    };

    return (
        <Page title="Rental Details">
            <Card sectioned>
                <Form onSubmit={handleSubmit}>
                    <FormLayout>
                        {/* ✅ Month & Year Navigation (with displayed month name) */}
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "10px"
                        }}>
                            <Button onClick={() => setMonth((prev) => (prev === 0 ? 11 : prev - 1))}>← Prev</Button>
                            <h3>{getMonthName(month)} {year}</h3>
                            <Button onClick={() => setMonth((prev) => (prev === 11 ? 0 : prev + 1))}>Next →</Button>
                        </div>

                        {/* ✅ DatePicker with Month & Year Navigation */}
                        <DatePicker
                            month={month}
                            year={year}
                            selected={rentalDate}
                            onChange={handleDateChange}
                            onMonthChange={handleMonthChange}
                            allowRange
                        />

                        {/* ✅ Renters Form Section */}
                        {renters.map((renter, index) => (
                            <div key={index} style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px" }}>
                                <TextField label="First Name" value={renter.firstName} onChange={(value) => handleRenterChange(index, "firstName", value)} />
                                <TextField label="Last Name" value={renter.lastName} onChange={(value) => handleRenterChange(index, "lastName", value)} />
                                <TextField label="Height" value={renter.height} onChange={(value) => handleRenterChange(index, "height", value)} />
                                <TextField label="Weight" value={renter.weight} onChange={(value) => handleRenterChange(index, "weight", value)} />
                                <Select label="Skill Level" options={[
                                    { label: "Beginner", value: "Beginner" },
                                    { label: "Intermediate", value: "Intermediate" },
                                    { label: "Advanced", value: "Advanced" }
                                ]} onChange={(value) => handleRenterChange(index, "skillLevel", value)} value={renter.skillLevel} />
                                <TextField label="Ski Length" value={renter.skiLength} onChange={(value) => handleRenterChange(index, "skiLength", value)} />
                                <TextField label="Boot Size" value={renter.bootSize} onChange={(value) => handleRenterChange(index, "bootSize", value)} />
                            </div>
                        ))}

                        {/* ✅ Button to Add Additional Renters */}
                        <Button onClick={addRenter}>+ Add Additional Renter</Button>

                        {/* ✅ Special Requests Field */}
                        <TextField label="Special Requests" value={specialRequests} onChange={(value) => setSpecialRequests(value)} multiline />

                        {/* ✅ Submit Button */}
                        <Button submit primary>Submit Rental</Button>
                    </FormLayout>
                </Form>
            </Card>
        </Page>
    );
}
