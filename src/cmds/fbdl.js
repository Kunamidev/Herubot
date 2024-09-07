const axios = require("axios");
const request = require("request");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "fbdl",
    description: "Facebook video downloader",
    usage: "[facebookvideolink]",
    cooldown: 1,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    try {
      if (!args[0]) {
        return reply(`[!] Need a Facebook video link to proceed.\nUse: fbdl [facebook video link]`, event);
      }

      const link = args[0];
      const senderName = event.senderID;

      react("⏳", event);
      api.sendMessage(`🕟 | Hey, your video is downloading. Please wait...`, event.threadID, event.messageID);

      const res = await axios.get(`https://deku-rest-api.gleeze.com/facebook?url=${link}`);

      if (!res.data || !res.data.download_url) {
        throw new Error("Failed to fetch download link. Please check the provided URL.");
      }

      const downloadUrl = res.data.download_url;

      const callback = () => {
        api.sendMessage({
          body: `✨ Here's your Facebook video!`,
          attachment: fs.createReadStream(path.join(__dirname, 'cache', 'fbdl.mp4'))
        }, event.threadID, () => fs.unlinkSync(path.join(__dirname, 'cache', 'fbdl.mp4')));
      };

      request(downloadUrl)
        .pipe(fs.createWriteStream(path.join(__dirname, 'cache', 'fbdl.mp4')))
        .on("close", callback);

      react("✅", event);
    } catch (error) {
      react("❌", event);
      reply(`❗ An error occurred: ${error.message}`, event);
    }
  }
};
