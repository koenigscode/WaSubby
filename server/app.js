const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const history = require("connect-history-api-fallback");
const usersRouter = require("./routes/v1/users");
const mediasRouter = require("./routes/v1/medias");
const subtitlesRouter = require("./routes/v1/subtitles");
const languagesRouter = require("./routes/v1/languages");
const userSchema = require("./schemas/users");
const languageSchema = require("./schemas/languages");
const mediaSchema = require("./schemas/media");
const subtitleSchema = require("./schemas/subtitles");
const expressJSDocSwagger=require("express-jsdoc-swagger");


const app = express();
const apiDocsRoute = "/api-docs";

const options={
    info:{
        version: "1.0.0",
        title: "WaSubby", 
    },
    baseDir: __dirname,
    security:{
        BasicAuth:{
            type:"http",
            scheme: "basic",
        },
    },
    // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
    filesPattern: "./**/*.js",
    // URL where SwaggerUI will be rendered. Default. /api-docs
    swaggerUIPath: apiDocsRoute,
    // Expose OpenAPI UI
    exposeSwaggerUI: true,
    // Expose Open API JSON Docs documentation in `apiDocsPath` path.
    exposeApiDocs: false,
    // Open API JSON Docs endpoint.
    apiDocsPath: "/v1/api-docs",
    // Set non-required fields as nullable by default
    notRequiredAsNullable: false,
    // You can customize your UI options.
    // you can extend swagger-ui-express config. You can checkout an example of this
    // in the `example/configuration/swaggerOptions.js`
    swaggerUiOptions: {},
    // multiple option in case you want more that one instance
    multiple: true,
};
expressJSDocSwagger(app)(options);

const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/WaSubby";
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(mongoURI).then(function() {
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
    const User = mongoose.model("User", userSchema);
    const Language = mongoose.model("Language", languageSchema);
    const Media = mongoose.model("Media", mediaSchema);
    const Subtitle = mongoose.model("Subtitle", subtitleSchema);
})
    .catch(function (err) {
        if (err) {
            console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
            console.error(err.stack);
            process.exit(1);
        }
        console.log(`Connected to MongoDB with URI: ${mongoURI}`);
        
        //Compiling userSchema into a model and creating the user instances
        const User = mongoose.model("User", userSchema);
        const admin = new User({ email: "example@example.com", password: "12345678", theme: "dark" });
        
        //Compiling languageSchema into a model and creating the language instances
        const Language = mongoose.model("Language", languageSchema);
        const English = new Language({ code: "EN", name: "English" });
        const Swedish = new Language({ code: "SE", name: "Swedish" });
        const Korean = new Language({ code: "KR", name: "Korean" });
        const German = new Language({ code: "DE", name: "German" });
        const Russian = new Language({ code: "RU", name: "Russian" });

        const Media = mongoose.model("Media", mediaSchema);
        const Subtitle = mongoose.model("Subtitle", subtitleSchema);
    });


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// HTTP request logger
app.use(morgan("dev"));
// Enable cross-origin resource sharing for frontend must be registered before api
app.options("*", cors());
app.use(cors());

// Import routes
app.get("/api", function (req, res) {
    res.json({ message: "Welcome to your DIT342 backend ExpressJS project!" });
});

app.use("/v1/users", usersRouter);
app.use("/v1/medias", mediasRouter);
app.use("/v1/subtitles", subtitlesRouter);
app.use("/v1/languages", languagesRouter);

// Catch all non-error handler for api (i.e., 404 Not Found)
app.use("/api/*", function (req, res) {
    res.status(404).json({ message: "Not Found" });
});

// Configuration for serving frontend in production mode
// Support Vuejs HTML 5 history mode
app.use(history());
// Serve static assets
const root = path.normalize(__dirname + "/..");
const client = path.join(root, "client", "dist");
app.use(express.static(client));

// Error handler (i.e., when exception is thrown) must be registered last
const env = app.get("env");
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    console.error(err.stack);
    const err_res = {
        message: err.message,
        error: {},
    };
    if (env === "development") {
    // Return sensitive stack trace only in dev mode
        err_res["error"] = err.stack;
    }
    res.status(err.status || 500);
    res.json(err_res);
});

app.listen(port, function (err) {
    if (err) throw err;
    console.log(`Express server listening on port ${port}, in ${env} mode`);
    console.log(`Backend: http://localhost:${port}/api/`);
    console.log(`API docs: http://localhost:${port}${apiDocsRoute}`);
    console.log(`Frontend (production): http://localhost:${port}/`);
});

module.exports = app;
