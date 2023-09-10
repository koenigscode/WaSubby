const spawn = require("await-spawn");
const path = require("path");
const fs = require("fs");

/**
 * This class is responsible for transcribing and translating a locally saved media file
 * using the whisper cli ("whisper-ctranslate2" by default).
 *
 * Since there are no proper node bindings for whisper, we use the cli instead.
 * 
 * If the source language is English, the media is only transcribed,
 * otherwise the media is both transcribed and translated (to English).
 */
class WhisperJob {

    constructor(filePath, mediaId) {
        this.filePath = filePath;
        this.mediaId = `${mediaId}`;
    }

    async execute() {
        const whisperCommand = process.env.whisperCommand || "whisper-ctranslate2";
        const whisperModel = process.env.whisperModel || "large-v2";
        const outputDir = 
            path.join(
                path.resolve(__dirname, ".."), 
                "data");

        const whisperArgs = [
            "--output_format", "srt",
            "--model", whisperModel,
            "--vad_filter", "True",
            "--condition_on_previous_text", "False",
            this.filePath];

        const transcriptionJob = await spawn(whisperCommand, [
            "--output_dir",
            path.join(outputDir, this.mediaId, "tmp"),
            ...whisperArgs]);

        const regexPattern = /Detected language '([^']+)'/mg;
        const match = regexPattern.exec(transcriptionJob.toString());

        if (match) {
            this.language = match[1];

            // move and rename file to [language].srt
            fs.renameSync(
                path.join(outputDir, this.mediaId, "tmp", 
                    path.parse(path.basename(this.filePath)).name + ".srt"),
                path.join(outputDir, this.mediaId, `${this.language}.srt`));
        } else {
            // if no language was detected, remove the tmp folder and throw an error
            fs.rmSync(path.join(outputDir, this.mediaId, "tmp"), { recursive: true, force: true });
            throw new Error("Could not detect language");
        } 
       
        // no translation to english needed when the source file is already in english
        if(this.language == "English")
            return;

        await spawn(whisperCommand, [
            "--output_dir", path.join(outputDir, this.mediaId, "tmp"),
            "--task", "translate",
            ...whisperArgs]);

        fs.renameSync(
            path.join(outputDir, this.mediaId, "tmp", 
                path.parse(path.basename(this.filePath)).name + ".srt"),
            path.join(outputDir, this.mediaId, "English.srt"));
    }

    getLanguage() {
        return this.language;
    }

    deleteFile() {

    }

}

module.exports = WhisperJob;