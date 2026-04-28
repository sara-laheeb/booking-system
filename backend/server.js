// Import packages
const express = require("express");
const db = require("./config/db");

// Create app
const app = express();

// Middleware to read JSON body
app.use(express.json());


// ================= TEST ROUTE =================

// Check if server is running
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});


// ================= GET ALL BOOKINGS =================

// Fetch all bookings
app.get("/bookings", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM bookings");

        return res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            data: results
        });

    } catch (err) {
        console.error("Fetch error ❌", err);

        return res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
});


// ================= CREATE NEW BOOKING =================

// Create new booking
app.post("/booking", async (req, res) => {
    try {
        // Extract data from request body
        const { name, booking_date } = req.body;

        // Validate required fields
        if (!name || !booking_date) {
            return res.status(400).json({
                success: false,
                message: "Name and booking_date are required",
                data: null
            });
        }

        // Insert booking into database
        const [result] = await db.query(
            "INSERT INTO bookings (name, booking_date, status) VALUES (?, ?, ?)",
            [name, booking_date, "pending"]
        );

        // Prepare response data
        const newBooking = {
            id: result.insertId,
            name,
            booking_date,
            status: "pending"
        };

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: newBooking
        });

    } catch (err) {
        console.error("Create booking error ❌", err);

        return res.status(500).json({
            success: false,
            message: "Failed to create booking"
        });
    }
});


// ================= START SERVER =================

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000 🚀");
});