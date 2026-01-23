 const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// --- 1. MIDDLEWARE SETUP ---
app.use(session({
    secret: 'abc',
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// --- 2. DATABASE SETUP ---
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
}, { collection: 'registration' });

const User = mongoose.model('User', userSchema);
// Define Feedback schema and model
const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
}, { collection: 'feedback' });

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Connection String (Mobile Hotspot Recommended for UPES Wi-Fi)
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

// Feedback page
app.get("/feedback", (req, res) => {
    res.render('feedback');
});

// Learn More Page (if still present)
app.get("/learnmore", (req, res) => {
    res.render('learnmore');
});


// --- 4. ROUTES (LOGIC) ---

// Handle Sign Up
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.send('<script>alert("Please fill in all fields"); window.location.href="/signup";</script>');
    }

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                console.log(`Duplicate signup attempt: ${email}`);
                return res.send('<script>alert("You already have an account with this email! Please Login."); window.location.href="/login";</script>');
            } else {
                const newUser = new User({ name, email, password });
                newUser.save()
                    .then(() => {
                        console.log(`User registered: ${email}`);
                        res.send('<script>alert("Registration Successful! Please Login."); window.location.href="/login";</script>');
                    })
                    .catch((err) => res.status(500).send("Error registering user"));
            }
        })
        .catch(err => res.status(500).send("Internal Server Error"));
});

// Handle Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email, password })
        .then((user) => {
            if (user) {
                req.session.user = user;
                console.log(`User logged in: ${user.name}`);
                res.redirect("/"); 
            } else {
                res.send('<script>alert("Invalid Email or Password"); window.location.href="/login";</script>');
            }
        })
        .catch((err) => res.status(500).send("Error logging in"));
});

// Handle POST request for feedback
app.post("/feedback", (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.send('<script>alert("Please fill in all fields"); window.location.href="/feedback";</script>');
    }

    const newFeedback = new Feedback({ name, email, message });
    newFeedback.save()
        .then(() => {
            console.log(`Feedback received from: ${email}`);
            res.send('<script>alert("Thank you for your feedback!"); window.location.href="/feedback";</script>');
        })
        .catch((err) => {
            console.error("Error saving feedback:", err);
            res.status(500).send("Error saving feedback");
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