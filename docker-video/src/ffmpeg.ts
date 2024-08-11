import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { OUTPUT_DIR } from "./constants";

const resolutions = [
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
    ffmpeg.ffprobe(inputPath, (err, data) => {
      const resolution =
        data.streams[0].coded_width + "x" + data.streams[0].coded_height;
      const bitrate = data.streams[0].bit_rate;

      console.log(
        "Input video resolution: ",
        resolution,
        "Input video bitrate: ",
        bitrate
      );

      // remove all the resolutions that are higher than the input video
      resolutions.forEach((item, index) => {
        const itemBitrate = parseInt(item.bitrate.replace("k", ""));
        if (bitrate && itemBitrate > parseInt(bitrate)) {
          resolutions.splice(index, 1);
        }
      });
    });

    return console.log("Resolutions to transcode: ", resolutions);

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

    const createMasterPlaylist = () => {
      const playlistContent = resolutions
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
          "-codec:a aac",
          "-b:v " + item.bitrate,
          "-b:a 128k",
          "-hls_time 5",
          "-hls_list_size 0",
          "-hls_segment_filename " +
            path.join(resolutionOutputDir, "segment-%03d.ts"),
        ])
        .on("end", () => {
          console.log(`Transcoding finished for ${item.resolution}`);
          outputPaths.push({
            path: resolutionOutputDir,
            resolution: item.resolution,
          });
          if (outputPaths.length === resolutions.length) {
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

    resolutions.forEach(processResolution);
  });
}
