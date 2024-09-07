const axios = require("axios");
const request = require("request");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "tikdl",
    description: "TikTok video downloader",
    usage: "[tiktokvideolink]",
    cooldown: 1,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    try {
      if (!args[0]) {
        return reply(`[!] Need a TikTok video link to proceed.\nUse: tikdl [tiktok video link]`, event);
      }

      const link = args[0];
      const senderName = event.senderID;

      react("⏳", event);
      api.sendMessage(`🕟 | Hey, your video is downloading. Please wait...`, event.threadID, event.messageID);

      const res = await axios.get(`https://deku-rest-api.gleeze.com/tiktokdl?url=${link}`);

      if (!res.data || !res.data.download_url) {
        throw new Error("Failed to fetch download link. Please check the provided URL.");
      }

      const downloadUrl = res.data.download_url;

      const callback = () => {
        api.sendMessage({
          body: `✨ Here's your TikTok video!`,
          attachment: fs.createReadStream(path.join(__dirname, 'cache', 'tikdl.mp4'))
        }, event.threadID, () => fs.unlinkSync(path.join(__dirname, 'cache', 'tikdl.mp4')));
      };

      request(downloadUrl)
        .pipe(fs.createWriteStream(path.join(__dirname, 'cache', 'tikdl.mp4')))
        .on("close", callback);

      react("✅", event);
    } catch (error) {
      react("❌", event);
      reply(`❗ An error occurred: ${error.message}`, event);
    }
  }
};
