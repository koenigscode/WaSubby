# WaSubby / Group 22

WaSubby, built as part of a university project, is a web app that allows the user to transcribe video or audio files in their original language and translates the generated subtitles into English as well. The media can then be watched/listened to with the subtitles in both languages, which can be used for learning a new language.

The backend uses OpenAI whisper, an AI-powered library for media file transcription.

<img src="images/logo.png" width="60%">

## Requirements

- [Client Requirements](./client/README.md#Requirements)
- [Server Requirements](./server/README.md#Requirements)
  - **Make sure to install `whisper-ctranslate2 or another whisper cli`**!

## Known limitations

- Sometimes, especially when using the "tiny" whisper model (`npm run fast-dev`), the subtitles have some issues, e.g. some words are very repeated multiple times.
  This is a common issue with whisper
- When showing multiple subtitle tracks, the order of the subtitles might switch around.
  This is because we're using the browser `<video>`, which natively doesn't support showing multiple subtitles at all,
  so we don't have any control over this.
  - Alternatively, we could have rendered the subtitles on our own,
    but this would add more complexity (working with VTT objects,
    getting every single subtitle line and rendering it on our own, etc.),
    which we decided is out-of-scope.
- Some common media types aren't supported, because either the browser
  can't display them (missing codec), or whisper doesn't support it.
  If in doubt, just convert it to mp4 (or mp3 for audio) and use that.
- When using an audio file as media, the video player might still be shown, but it will be empty (so only audio is playing).
  This is because the HTML `<audio>` element doesn't support showing subtitle text tracks, so using a `<video>` is a workaround for that.
- The `.gitlab-ci.yml` and npm test scripts are a mess. This is because we had troubles with newman. The tests would all pass, but then the CI is stuck. See the `gitlab-ci.yml` for more infromation

## Getting started

```bash
# Clone repository
git clone git@git.chalmers.se:courses/dit342/group-00-web.git

# Change into the directory
cd group-22-web

# Setup backend
cd server && npm install
# delete all data (optional)
npm run clean

# start server in dev mode
npm run dev
# or
npm run fast-dev # uses tiny whisper model

# Setup frontend
cd client && npm install
npm run serve
```

You also need to have whisper-ctranslate2 installed. (see [backend readme](./server/README.md))

> Check out the detailed instructions for [backend](./server/README.md) and [frontend](./client/README.md).

## Project Structure

| File                                                 | Purpose                           | What you do?                              |
| ---------------------------------------------------- | --------------------------------- | ----------------------------------------- |
| `server/`                                            | Backend server code               | All your server code                      |
| [server/README.md](server/README.md)                 | Everything about the server       | **READ ME** carefully!                    |
| `client/`                                            | Frontend client code              | All your client code                      |
| [client/README.md](client/README.md)                 | Everything about the client       | **READ ME** carefully!                    |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)             | Free online production deployment | Deploy your app online in production mode |
| [docs/LOCAL_DEPLOYMENT.md](docs/LOCAL_DEPLOYMENT.md) | Local production deployment       | Deploy your app local in production mode  |

## System Definition (MS0)

### Purpose

The system - called WaSubby - will **transcribe video and audio files** from around 100 languages and translate them into English, too. WaSubby will also give users the ability to watch a video or listen to an audio file while reading subtitles in both English and the language of the source file simultaneously, to aid language-learning.

### Pages

- **Home Page**
  - Landing Page, which introduces the service and shows a quick demo.
- **My Page**
  - Users can see their info, update their email/password, and set a light or dark theme.
- **Signup Page and Login Page**
  - Allows users to register or login.
- **Media Player Page**
  - Transcribes and shows media (video or audio files)
  - If the subtitles for the source language + translation are already generated (stored on the server), the video starts playing with those, otherwise, the user gets feedback (e.g. spinner, progress bar) that the subtitles are being generated.
  - Also allows the user to upload subtitles for an existing media file.
- **Admin page**
  - Can be accessed by going to /admin
  - Has option to delete all users and all media files
- **404 page**
  - Shown if the user tries to access a page that doesn't exist.

### Entity-Relationship (ER) Diagram

![ER Diagram](./images/WaSubbyER.jpg)

## Teaser (MS3)

![Teaser](./images/teaser.png)
