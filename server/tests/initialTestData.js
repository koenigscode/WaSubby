const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/WaSubby";

const mongoose = require("mongoose");
const User = require("../schemas/users");
const Language = require("../schemas/languages");
const Media = require("../schemas/media");
const Subtitle = require("../schemas/subtitles");

async function insertData() {
    await mongoose.connect(mongoURI);
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);

    await mongoose.connection.dropDatabase();
    console.log("dropped DB");

    await new Language({ code: "en", name: "English" }).save();
    await new Language({ code: "se", name: "Swedish" }).save();
    await new Language({ code: "ko", name: "Korean" }).save();
    await new Language({ code: "de", name: "German" }).save();
    await new Language({ code: "ru", name: "Russian" }).save();
    console.log("inserted languages");
    
    // TODO: hash password
    await new User({ email: "example@example.com", password: "12345678", admin: true, theme: "dark" }).save();
    console.log("inserted test user");
    await mongoose.disconnect();
}

(async function() {

    try {
        await insertData();
    }
    catch(err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
})();


// mongoose.connect(mongoURI).then(async function() {

// })
//     .catch(function (err) {
//         if (err) {
//            
//         }
//     });