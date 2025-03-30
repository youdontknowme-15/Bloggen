const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/api/blogs", async (req, res) => {
    try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countries = response.data;

        // Random 5 countries le raha hoon
        const randomBlogs = countries
            .sort(() => 0.5 - Math.random())
            .slice(0, 5)
            .map((country) => ({
                title: `Discover ${country.name.common}`,
                content: `Explore the beauty of ${country.name.common}, known for ${country.region} region and capital ${country.capital ? country.capital[0] : "N/A"}.`,
                image: country.flags.png, // Country flag as image
                author: `Travel Blogger`,
            }));

        res.json(randomBlogs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
