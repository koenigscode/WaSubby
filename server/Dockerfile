FROM python:3.10-slim


RUN apt-get update
RUN apt install -y ca-certificates curl gnupg git
RUN apt update
RUN apt install -y nodejs npm
RUN apt install -y ffmpeg

RUN pip3 install "git+https://github.com/openai/whisper.git" 

CMD [ ]
ENTRYPOINT [ ]