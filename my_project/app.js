 const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// --- 1. MIDDLEWARE SETUP ---

// Session middleware
app.use(session({
    secret: 'abc',
    resave: false,
    saveUninitialized: false
}));

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to EJS and specify the 'views' directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// --- 2. DATABASE SETUP ---

// Define User schema and model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
}, { collection: 'registration' });

const User = mongoose.model('User', userSchema);

// Connection String
const uri = "mongodb+srv://atrayee:atrayee@cluster0.bmurhbr.mongodb.net/web_tech?retryWrites=true&w=majority&appName=Cluster0";

console.log("⏳ Connecting to MongoDB...");

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000 
})
.then(() => {
    console.log("✅ DATABASE CONNECTED SUCCESSFULLY!");
})
.catch((err) => {
    console.error("❌ Database Connection Error:", err.message);
    if (err.message.includes("ENOTFOUND") || err.message.includes("buffering timed out")) {
        console.log("⚠️  NETWORK BLOCK DETECTED. Please switch to MOBILE HOTSPOT.");
    }
});


// --- 3. ROUTES (PAGES) ---

app.get("/", (req, res) => {
    res.render('index', { user: req.session.user });
});

app.get("/login", (req, res) => {
    res.render('login');
});

app.get("/signup", (req, res) => {
    res.render('signup');
});

app.get("/facilities", (req, res) => {
    res.render('facilities');
});

app.get("/about", (req, res) => {
    res.render('about');
});


// --- 4. ROUTES (LOGIC) ---

// Handle POST request for registration (Modified to check duplicates)
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;

    // Validation check
    if (!name || !email || !password) {
        return res.send('<script>alert("Please fill in all fields"); window.location.href="/signup";</script>');
    }

    // Check if user already exists
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                // User ALREADY exists
                console.log(`Duplicate signup attempt: ${email}`);
                return res.send('<script>alert("You already have an account with this email! Please Login."); window.location.href="/login";</script>');
            } else {
                // User is NEW, proceed to save
                const newUser = new User({
                    name,
                    email,
                    password
                });

                newUser.save()
                    .then(() => {
                        console.log(`User registered: ${email}`);
                        res.send('<script>alert("Registration Successful! Please Login."); window.location.href="/login";</script>');
                    })
                    .catch((err) => {
                        console.error("Error registering user:", err);
                        res.status(500).send("Error registering user");
                    });
            }
        })
        .catch(err => {
            console.error("Database error:", err);
            res.status(500).send("Internal Server Error");
        });
});

// Handle POST request for login
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Find user in the database
    User.findOne({ email, password })
        .then((user) => {
            if (user) {
                // User found, save to session
                req.session.user = user;
                console.log(`User logged in: ${user.name}`);
                
                // Redirect to Home page after success
                res.redirect("/"); 
            } else {
                // User not found or invalid credentials
                res.send('<script>alert("Invalid Email or Password"); window.location.href="/login";</script>');
            }
        })
        .catch((err) => {
            console.error("Error logging in:", err);
            res.status(500).send("Error logging in");
        });
});


// Handle 404 errors
app.use((req, res) => {
    res.status(404).send("Page not found");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`👉 Open http://localhost:${PORT} in your browser`);
});