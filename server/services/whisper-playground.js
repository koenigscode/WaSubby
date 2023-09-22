// This file is used to manually test the whisper service
const WhisperJob = require("./WhisperJob.js");
const path = require("path");

(async function() {
    const job = new WhisperJob(path.join("__dirname", "..", "/tmp/media/test.ogg"), 1);
    console.log(await job.execute());
})();

