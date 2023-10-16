const spawn = require("await-spawn");
const path = require("path");
const fs = require("fs");

const dataDir = path.join(path.resolve(__dirname, ".."), "data");
const whisperCommand = process.env.WHISPER_COMMAND || "whisper-ctranslate2";

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
    /**
   * Creates a new whisper job.
   * @param {string} filePath path to media file
   * @param {number|string} mediaId id of media file
   * @param {function} languageRecognizedCallback callback function to be called when the source language is recognized
   */
    constructor(filePath, mediaId, languageRecognizedCallback) {
        this.filePath = filePath;
        this.mediaId = `${mediaId}`;
        this.languageRecognizedCallback = languageRecognizedCallback;
    }

    /**
   * Executes the whisper cli with the given media file, await both transcription and (if done) translation.
   *
   */
    async execute() {

        const transcriptionJob = await spawn(
            whisperCommand,
            this._getWhisperArgs(false),
        );

        const result = []; 

        const regexPattern = /Detected language (\w+)/;
        const match = regexPattern.exec(transcriptionJob.toString().replace(/[^\w\s]/gi, ""));

        if (match) {
            this.language = match[1];
            console.log("recognized language: " + this.language);
            this.languageRecognizedCallback(this.language);

            // move and rename file to [language].vtt
            fs.renameSync(
                path.join(
                    dataDir,
                    this.mediaId,
                    "tmp",
                    path.parse(path.basename(this.filePath)).name + ".vtt",
                ),
                path.join(dataDir, this.mediaId, `${this.language}.vtt`),
            );
            result.push({language: this.language, path: `/static/${this.mediaId}/${this.language}.vtt`,});
        } else {
            // if no language was detected, remove the tmp folder and throw an error
            fs.rmSync(path.join(dataDir, this.mediaId, "tmp"), {
                recursive: true,
                force: true,
            });
            throw new Error("Could not detect language");
        }

        // no translation to english needed when the source file is already in english
        if (this.language === "English") {
            fs.rmSync(path.join(dataDir, this.mediaId, "tmp"), {
                recursive: true,
                force: true,
            });
            result.push({language: "English", path: `/static/${this.mediaId}/English.vtt`,});

            // TODO: delete source file
            return result;
        }

        await spawn(whisperCommand, this._getWhisperArgs(true));

        fs.renameSync(
            path.join(
                dataDir,
                this.mediaId,
                "tmp",
                path.parse(path.basename(this.filePath)).name + ".vtt",
            ),
            path.join(dataDir, this.mediaId, "English.vtt"),
        );

        fs.rmSync(path.join(dataDir, this.mediaId, "tmp"), {
            recursive: true,
            force: true,
        });
        // TODO: delete source file

        result.push({language: "English", path: `/static/${this.mediaId}/English.vtt`,});
        return result;
    }

    /**
   * Internal helper to get the whisper cli arguments for the given media file.
   *
   * @param {boolean} translate whether to translate the media file to english
   */
    _getWhisperArgs(translate) {
        const whisperModel = process.env.WHISPER_MODEL || "large-v2";
        const whisperDevice = process.env.WHISPER_DEVICE || "cpu";

        console.log(`Using whisper model ${whisperModel}, device ${whisperDevice}`);
        console.log("Using whisper command " + process.env.WHISPER_COMMAND);
        
        const ctranslate2Options = [ 
            "--vad_filter",
            "True",
            "--condition_on_previous_text",
            "False",
            "--word_timestamps",
            "True",
            "--max_line_width",
            "35",
            "--max_line_count",
            "1",];

        let args = [
            "--output_format",
            "vtt",
            "--model",
            whisperModel,
            "--device",
            whisperDevice,
            "--output_dir",
            path.resolve(path.join(dataDir, this.mediaId, "tmp")),
            this.filePath,
        ];

        if(whisperCommand === "whisper-ctranslate2"){
            args = [...ctranslate2Options, ...args, ];
        }

        if (translate === true) {
            args = ["--task", "translate", ...args];
        }
        return args;
    }

    /**
   * Returns the (auto-detected) source language of the media file.
   */
    getLanguage() {
        return this.language;
    }
}

module.exports = WhisperJob;
