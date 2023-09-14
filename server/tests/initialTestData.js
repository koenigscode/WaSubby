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
    mongoose.connection.dropDatabase();
})
    .catch(function (err) {
        if (err) {
            console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
            console.error(err.stack);
            process.exit(1);
        }
    }).then(function() {
        //Compiling userSchema into a model and creating the user instances
        const User = mongoose.model("User", userSchema);
        const admin = new User({ email: "example@example.com", password: "12345678", theme: "dark" });
     
        //Compiling languageSchema into a model and creating the language instances
        const Language = mongoose.model("Language", languageSchema);
        const English = new Language({ code: "EN", name: "English" });
        const Swedish = new Language({ code: "SE", name: "Swedish" });
        const Korean = new Language({ code: "KO", name: "Korean" });
        const German = new Language({ code: "DE", name: "German" });
        const Russian = new Language({ code: "RU", name: "Russian" });

        const Media = mongoose.model("Media", mediaSchema);
        const Subtitle = mongoose.model("Subtitle", subtitleSchema);

    });