# Vidwave

Vidwave is a video streaming platform inspired by YouTube, allowing users to upload, transcode, stream, and manage video content. This project leverages modern web technologies and cloud services to provide a seamless video sharing experience.

## Features

- Video upload (up to 50MB .mp4 files)
- Automatic video transcoding using FFmpeg
- HLS (HTTP Live Streaming) video playback
- User authentication and authorization
- Video management (edit title, description, comments)
- User studio for managing uploaded videos
- Video deletion (removes from S3 and database)

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- video.js
- JWT for authentication

### Backend
- Express.js
- Redis for queue management

### Cloud Services
- AWS S3 for video storage

### Containerization
- Docker
- Docker Compose

## Architecture

1. Users upload videos through the React frontend.
2. The backend, built with Express, handles file uploads using Multer.
3. Upload events are pushed to a Redis queue.
4. Worker processes pop events from the queue and trigger Docker containers for transcoding.
5. A custom Docker image (`pulkitxm/docker-video`) handles video transcoding and S3 uploading.
6. Transcoded videos are stored in AWS S3 buckets.
7. The frontend streams videos using video.js and HLS.

## Setup and Installation

### Prerequisites
- Docker and Docker Compose
- Node.js and npm
- AWS account with S3 bucket

### Environment Variables
Create a `.env` file in for srerver and workers using the `.env.sample`.

### Running the Application

1. Clone the repository:
```bash
git clone https://github.com/Pulkitxm/VidWave.git
cd VidWave
```

2. Start the application using Docker Compose:
```bash
docker-compose up
```
This command starts both the server and client.

3. To start additional workers:
```bash
cd workers
npm run dev
```

## Docker Image
The custom Docker image for video processing is available on Docker Hub:: [pulkitxm/docker-video](https://hub.docker.com/repository/docker/pulkitxm/docker-video/general)

This image handles video transcoding and S3 uploading. It accepts the following environment variables:

- `PROCESS`: Set to 'transcode&upload'
- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `AWS_REGION`: Your AWS region
- `AWS_BUCKET_NAME`: Your S3 bucket name
- `VIDEO_FILE_PATH`: Path to the video file inside the container
- `OUTPUT_NAME`: Desired output name for the transcoded video

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
