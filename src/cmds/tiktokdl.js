const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "tikdl",
    description: "Download TikTok content from a provided URL.",
    usage: "tikdl <url>",
    cooldown: 5,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    try {
      if (!args.length) {
        return reply("Please provide a TikTok URL. Usage: tikdl <url>", event);
      }

      const url = args[0];
      const apiUrl = `https://deku-rest-api.gleeze.com/tiktokdl?url=${encodeURIComponent(url)}`;

      react("⏳", event);

      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

      const filePath = path.join(__dirname, 'cache', 'tiktok_video.mp4');
      
      if (!fs.existsSync(path.join(__dirname, 'cache'))) {
        fs.mkdirSync(path.join(__dirname, 'cache'));
      }

      fs.writeFileSync(filePath, response.data);

      const attachment = {
        body: "🎥 TikTok content downloaded successfully!",
        attachment: fs.createReadStream(filePath)
      };

      reply(attachment, event);
      react("✅", event);
    } catch (error) {
      react("⚠️", event);
      reply(`An error occurred: ${error.message}`, event);
    }
  }
};
