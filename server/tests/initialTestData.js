const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/WaSubby";

const mongoose = require("mongoose");
const userSchema = require("../schemas/users");
const languageSchema = require("../schemas/languages");
const mediaSchema = require("../schemas/media");
const subtitleSchema = require("../schemas/subtitles");

// Connect to MongoDB
mongoose.connect(mongoURI).then(function() {
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
    const User = mongoose.model("User", userSchema);
    const Language = mongoose.model("Language", languageSchema);
    const Media = mongoose.model("Media", mediaSchema);
    const Subtitle = mongoose.model("Subtitle", subtitleSchema);

    mongoose.connection.dropDatabase();

    //Compiling userSchema into a model and creating the user instances
    const admin = new User({ email: "example@example.com", password: "12345678", theme: "dark" });
    
    //Compiling languageSchema into a model and creating the language instances
    const English = new Language({ code: "EN", name: "English" });
    const Swedish = new Language({ code: "SE", name: "Swedish" });
    const Korean = new Language({ code: "KR", name: "Korean" });
    const German = new Language({ code: "DE", name: "German" });
    const Russian = new Language({ code: "RU", name: "Russian" });

})
    .catch(function (err) {
        if (err) {
            console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
            console.error(err.stack);
            process.exit(1);
        }
        
        
    });