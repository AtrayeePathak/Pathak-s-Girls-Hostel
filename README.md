**Pathak's Girls Hostel (Express + EJS)**

This repository contains a small Node.js + Express web application that serves a multi-page website for a girls' hostel. It uses EJS templates for server-rendered pages and MongoDB (via Mongoose) for storing registrations and feedback.

**Tech Stack**
- **Node.js** (tested with Node 20+)
- **Express** for the web server
- **EJS** for views (templates)
- **MongoDB Atlas** via **Mongoose** (URI set in `app.js` currently)
- Static assets in `my_project/public`

**Repository Layout**
- `my_project/` : application folder
  - `app.js` : main Express server and route handlers
  - `package.json` : project dependencies
  - `views/` : EJS templates (`index.ejs`, `about.ejs`, `facilities.ejs`, `login.ejs`, `signup.ejs`, `feedback.ejs`, ...)
  - `public/` : CSS, images and other static assets (`*.css`, `images/`)

**Main Features**
- Home, About, Facilities pages (static content)
- Registration (`/signup`) and Login (`/login`) with session support
- Feedback page (`/feedback`) — stores name, email and message in a `feedback` collection in MongoDB
- Simple, responsive CSS and a consistent header/footer layout

**Routes**
- `GET /` — Home page
- `GET /about` — About page
- `GET /facilities` — Facilities page
- `GET /signup` — Sign up form
- `POST /signup` — Create user (saves to `registration` collection)
- `GET /login` — Login form
- `POST /login` — Authenticate user (current code checks plaintext password)
- `GET /feedback` — Feedback form
- `POST /feedback` — Save feedback to `feedback` collection

**Prerequisites**
- Install Node.js (LTS recommended) and npm
- A MongoDB Atlas connection string (the project uses a URI in `app.js`). For production, move sensitive connection strings into environment variables (e.g. `.env`) and add `.env` to `.gitignore`.

**Local setup**
1. Open a terminal and navigate to the repository root.
2. Install dependencies:

```powershell
cd "my_project"
npm install
```

3. Start the app (note: the repository currently does not provide an npm `start` script; start with `node`):

```powershell
# from my_project folder
node app.js
```

Optional: add a `start` script to `package.json`:

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

Then run `npm start` or `npm run dev`.

**Environment & Configuration**
- The current MongoDB connection URI is defined directly in `app.js` (look for the variable `uri`). Replace this with your own connection string or load it from an environment variable.
- Recommended: create a `.env` file with `MONGODB_URI=...` and update `app.js` to read `process.env.MONGODB_URI`.

**Database Collections**
- `registration` — stores user documents with fields: `name`, `email`, `password` (currently stored in plaintext in the DB; see Security Notes).
- `feedback` — stores feedback messages with `name`, `email`, `message`, `timestamp`.

**Static Assets / Images**
- Place project images under `my_project/public/images/`.
- Examples used in templates:
  - header logo: `/images/pathaks-logo.png`
  - login background: `/images/login-bg.png`

**Security Notes & Recommendations**
- Passwords are currently stored and compared as plaintext — NOT secure. Replace with a password hashing solution such as `bcrypt` before using in production.
- Move sensitive configuration (DB credentials, session secret) to environment variables and never commit them.
- Consider enabling HTTPS and configuring session cookie options for security.

**Repository Clean-up Info**
- A `.gitignore` exists to ignore `node_modules/`. The repository history previously included node modules and accidental duplicate files; those were removed from tracking but remain in earlier commits. If you need to permanently purge large files from history, use tools like `git filter-repo` or BFG (requires care and force-push).

**Testing feedback form locally**
1. Start the app (`node app.js`).
2. Open `http://localhost:5000/feedback` in your browser.
3. Submit the form — successful submissions display a confirmation alert and create a document in the `feedback` collection.

**Developer Notes**
- To add the logo or background images, copy files into `my_project/public/images/` and name them to match the paths used in templates (for example `pathaks-logo.png` and `login-bg.png`).
- Example PowerShell to add an image (run from repo root):

```powershell
mkdir .\\my_project\\public\\images -Force
Copy-Item 'C:\\Users\\You\\Downloads\\pathaks-logo.png' -Destination '.\\my_project\\public\\images\\pathaks-logo.png' -Force
```

**Next recommended improvements**
- Add proper password hashing (`bcrypt`) and input sanitization.
- Add server `start` script and `dev` script (nodemon) to `package.json`.
- Move DB credentials to environment variables and add `.env` support.
- Add unit / integration tests for critical routes.

**Contact / Contributing**
- If you want help adding features or cleaning git history, open an issue or ask for help. I'm available to assist with adding hashing, improving structure, or doing a history rewrite safely.

**License**
- No license file included. Add a license (e.g. MIT) if you plan to share this repository publicly.
