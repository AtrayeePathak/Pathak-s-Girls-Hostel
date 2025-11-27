const mongoose = require('mongoose');

// The SRV string is simpler. On a Hotspot, this SHOULD work.
// Make sure <password> is replaced with 'atrayee'
const uri = "mongodb+srv://atrayee:atrayee@cluster0.bmurhbr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

console.log("⏳ Attempting to connect...");

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000 // Fail fast (5 seconds) so you don't wait forever
})
.then(() => {
    console.log("✅ SUCCESS! Connected to MongoDB.");
    console.log("   (This means your User, Password, and Network are ALL correct.)");
    process.exit(0);
})
.catch(err => {
    console.log("❌ FAILED.");
    console.log("---------------------------------------------------");
    console.log("Error Name:", err.name);
    console.log("Error Msg :", err.message);
    console.log("---------------------------------------------------");
    
    if (err.message.includes("bad auth")) {
        console.log("👉 CAUSE: Wrong Username or Password.");
    } else if (err.message.includes("ENOTFOUND")) {
        console.log("👉 CAUSE: DNS/Internet Error. Your computer cannot find the server.");
        console.log("   FIX: Change DNS to 8.8.8.8 (See instructions).");
    } else {
        console.log("👉 CAUSE: Firewall/Network Block.");
        console.log("   FIX: Ensure you are on Mobile Hotspot and NOT University Wi-Fi.");
    }
    process.exit(1);
});