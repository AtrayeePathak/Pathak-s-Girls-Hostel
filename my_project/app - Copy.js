
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const session = require('express-session');

const app = express();


// Session middleware
app.use(session({
    secret:'abc',
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

// Define User schema and model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
}, { collection: 'registration' });

const User = mongoose.model('User', userSchema);

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://atrayee:atrayee@cluster0.bmurhbr.mongodb.net/web_tech?retryWrites=true&w=majority&appName=Cluster0', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
}).then(() => {
  console.log('Connected to database');
}).catch((err) => {
  console.error('Error connecting to MongoDB Atlas:', err.message);
});


// Define routes
app.get("/", (req, res) => {
    res.render('index');
});

// Define login route
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



// Handle 404 errors
// app.use((req, res, next) => {
//     res.status(404).send("Sorry, can't find that!");
// });

// Handle other errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});



// Handle POST request for registration
app.post("/signup", (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;

    const newUser = new User({
        name,
        email,
        password
    });

    newUser.save()
        .then(() => {
            res.send("User registered successfully");
        })
        .catch((err) => {
            console.error("Error registering user:", err);
            res.status(500).send("Error registering user");
        });
});

// Handle POST request for login
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Find user in the database based on username and password
    User.findOne({ email, password })
        .then((user) => {
            if (user) {
                // User found, authentication successful
                req.session.user = user;
                res.send("login successfull")
                // res.render("profile", { user: user });
            } else {
                // User not found or invalid credentials
                res.status(401).send("Invalid username or password");
            }
        })
        .catch((err) => {
            console.error("Error logging in:", err);
            res.status(500).send("Error logging in");
        });
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
