// This file is used to manually test the whisper service
const WhisperJob = require("./WhisperJob.js");

(async function() {
    const job = new WhisperJob("/Users/koenig/code/group-22-web/server/tmp/media/test.ogg", 1);
    await job.execute();
    console.log("Language: " + job.getLanguage());
})();

