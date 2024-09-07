const axios = require("axios");
const path = require("path");
const fs = require("fs");

module.exports = {
  config: {
    name: "randomtik",
    description: "Fetches a random TikTok video and sends it.",
    usage: "randomtik",
    cooldown: 10,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    try {
      const { threadID, messageID } = event;

      // React and send a preliminary message
      react("⏳", event);
      reply("Video is sending, please wait...", event);

      // Fetch video URL from the API
      const response = await axios.post("https://girledit-api-version-2-production-e493.up.railway.app/api/request/f", { credits: "joshua apostol" });
      const videoUrl = response.data.url;
      const username = response.data.username;
      const nickname = response.data.nickname;

      // Define video path and create write stream
      const videoPath = path.resolve(__dirname, 'cache/girledit_video.mp4');
      const writer = fs.createWriteStream(videoPath);

         const responseStream = await axios({
        url: videoUrl,
        method: 'GET',
        responseType: 'stream'
      });

      responseStream.data.pipe(writer);

      writer.on('finish', () => {
        api.sendMessage({
          body: `Username: ${username}\nNickname: ${nickname}`,
          attachment: fs.createReadStream(videoPath)
        }, threadID, () => fs.unlinkSync(videoPath), messageID);

        // React with success
        react("✅", event);
      });

    } catch (error) {
      // React with error and reply with error message
      react("⚠️", event);
      reply(`Error fetching girl edit API!\n${error.message}`, event);
      console.error('Error:', error.message);
    }
  }
};