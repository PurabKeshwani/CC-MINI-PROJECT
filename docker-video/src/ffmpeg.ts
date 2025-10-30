import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { OUTPUT_DIR } from "./constants";

const resolutions = [
  { resolution: "128x72", bitrate: "100k" },
  { resolution: "256x144", bitrate: "400k" },
  { resolution: "640x360", bitrate: "800k" },
  { resolution: "854x480", bitrate: "1200k" },
  { resolution: "1280x720", bitrate: "2500k" },
  { resolution: "1920x1080", bitrate: "5000k" },
  { resolution: "2560x1440", bitrate: "8000k" },
  { resolution: "3840x2160", bitrate: "12000k" },
  { resolution: "7680x4320", bitrate: "24000k" },
  { resolution: "15360x8640", bitrate: "48000k" },
];

export function transCodeVideo(inputPath: string): Promise<
  {
    path: string;
    resolution: string;
  }[]
> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(inputPath)) {
      reject(new Error("Input file does not exist"));
      return;
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    } else {
      fs.rmSync(OUTPUT_DIR, { recursive: true });
      fs.mkdirSync(OUTPUT_DIR);
    }

    const outputPaths: {
      path: string;
      resolution: string;
    }[] = [];
    const masterPlaylist = path.join(OUTPUT_DIR, "index.m3u8");

    let virResolutions: {
      resolution: string;
      bitrate: string;
    }[] = [];
    let completedTasks = 0;
    let totalTasks = 0;

    const createMasterPlaylist = () => {
      const playlistContent = virResolutions
        .map(
          (item) =>
            `#EXT-X-STREAM-INF:BANDWIDTH=${item.bitrate},RESOLUTION=${item.resolution}\n${item.resolution}/index.m3u8`
        )
        .join("\n");

      fs.writeFileSync(
        masterPlaylist,
        `#EXTM3U\n#EXT-X-VERSION:3\n${playlistContent}`
      );
    };

    const processResolution = (item: {
      resolution: string;
      bitrate: string;
    }) => {
      const resolutionOutputDir = path.join(OUTPUT_DIR, item.resolution);
      if (!fs.existsSync(resolutionOutputDir)) {
        fs.mkdirSync(resolutionOutputDir);
      }

      ffmpeg(inputPath)
      .output(path.join(resolutionOutputDir, "index.m3u8"))
      .outputOptions([
        "-codec:v libx264",
        "-preset veryslow",
        "-codec:a aac",
        "-b:v " + item.bitrate,
        "-b:a 128k",
        "-hls_time 5",
        "-hls_list_size 0",
        "-hls_segment_filename " +
          path.join(resolutionOutputDir, "segment-%03d.ts"),
        "-threads 1",
        "-max_interleave_delta 100M",
        "-threads 1",
        "-cpu-used 1",
        "-preset ultrafast",
        "-tune film",
        "-threads 1",
        "-max_muxing_queue_size 100",
      ])
        .on("end", () => {
          console.log(`Transcoding finished for ${item.resolution}`);
          outputPaths.push({
            path: resolutionOutputDir,
            resolution: item.resolution,
          });
          completedTasks += 1;
          if (completedTasks === totalTasks) {
            createMasterPlaylist();
            resolve(outputPaths);
          }
        })
        .on("error", (err) => {
          console.log("An error occurred: " + err.message);
          reject(err);
        })
        .run();
    };

    ffmpeg.ffprobe(inputPath, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const resolution = {
        width: data.streams[0]?.width,
        height: data.streams[0]?.height,
      };

      // Check if width and height are defined
      if (resolution.width === undefined || resolution.height === undefined) {
        reject(new Error("Could not determine video resolution"));
        return;
      }

      console.log("Input video resolution: ", resolution);

      // Filter resolutions based on input video resolution
      virResolutions = resolutions.filter((item) => {
        const [resWidth, resHeight] = item.resolution.split("x").map(Number);
        return (
          (resolution.width as any) >= resWidth &&
          (resolution.height as any) >= resHeight
        );
      });

      console.log("VirResolutions to transcode: ", virResolutions);

      // If no valid resolutions, fail fast to signal upstream
      if (virResolutions.length === 0) {
        reject(new Error("No valid resolutions to transcode for the given input video"));
        return;
      }

      // Process only filtered resolutions
      totalTasks = virResolutions.length + 1; // +1 for thumbnail generation
      virResolutions.forEach(processResolution);

      // Generate a thumbnail at ~1s into the video
      const thumbnailPath = path.join(OUTPUT_DIR, "thumbnail.jpg");
      ffmpeg(inputPath)
        .screenshots({
          timestamps: ["1"],
          filename: "thumbnail.jpg",
          folder: OUTPUT_DIR,
          size: "1280x?",
        })
        .on("end", () => {
          // Ensure file exists
          if (fs.existsSync(thumbnailPath)) {
            console.log("Thumbnail generated at", thumbnailPath);
          }
          completedTasks += 1;
          if (completedTasks === totalTasks) {
            createMasterPlaylist();
            resolve(outputPaths);
          }
        })
        .on("error", (err) => {
          console.log("Thumbnail generation error:", err.message);
          // Even if thumbnail fails, continue with video processing
          completedTasks += 1;
          if (completedTasks === totalTasks) {
            createMasterPlaylist();
            resolve(outputPaths);
          }
        });
    });
  });
}
