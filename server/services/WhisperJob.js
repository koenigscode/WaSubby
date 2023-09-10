const spawn = require("await-spawn");
const path = require("path");
const fs = require("fs");

const dataDir = path.join(path.resolve(__dirname, ".."), "data");

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
   * @param {number} mediaId id of media file
   */
    constructor(filePath, mediaId) {
        this.filePath = filePath;
        this.mediaId = `${mediaId}`;
    }

    /**
   * Executes the whisper cli with the given media file, await both transcription and (if done) translation.
   * 
   * @returns {Promise<{transcribedLanguage: string, translated: boolean}>} object containing the transcribed language and whether the media was translated
   */
    async execute() {
        const whisperCommand = process.env.whisperCommand || "whisper-ctranslate2";

        const transcriptionJob = await spawn(
            whisperCommand,
            this._getWhisperArgs(false)
        );

        const regexPattern = /Detected language '([^']+)'/gm;
        const match = regexPattern.exec(transcriptionJob.toString());

        if (match) {
            this.language = match[1];

            // move and rename file to [language].srt
            fs.renameSync(
                path.join(
                    dataDir,
                    this.mediaId,
                    "tmp",
                    path.parse(path.basename(this.filePath)).name + ".srt"
                ),
                path.join(dataDir, this.mediaId, `${this.language}.srt`)
            );
        } else {
            // if no language was detected, remove the tmp folder and throw an error
            fs.rmSync(path.join(dataDir, this.mediaId, "tmp"), {
                recursive: true,
                force: true,
            });
            throw new Error("Could not detect language");
        }

        // no translation to english needed when the source file is already in english
        if (this.language == "English") {
            fs.rmSync(path.join(dataDir, this.mediaId, "tmp"), {
                recursive: true,
                force: true,
            });
            // TODO: delete source file
            return;
        }

        await spawn(whisperCommand, this._getWhisperArgs(true));

        fs.renameSync(
            path.join(
                dataDir,
                this.mediaId,
                "tmp",
                path.parse(path.basename(this.filePath)).name + ".srt"
            ),
            path.join(dataDir, this.mediaId, "English.srt")
        );

        fs.rmSync(path.join(dataDir, this.mediaId, "tmp"), {
            recursive: true,
            force: true,
        });
        // TODO: delete source file

        return {
            transcribedLanguage: this.language,
            translated: true,
        };
    }

    /**
     * Internal helper to get the whisper cli arguments for the given media file.
   *
   * @param {boolean} translate whether to translate the media file to english
   */
    _getWhisperArgs(translate) {
        const whisperModel = process.env.whisperModel || "large-v2";

        let args = [
            "--output_format",
            "srt",
            "--model",
            whisperModel,
            "--vad_filter",
            "True",
            "--condition_on_previous_text",
            "False",
            "--output_dir",
            path.join(dataDir, this.mediaId, "tmp"),
            this.filePath,
        ];
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
