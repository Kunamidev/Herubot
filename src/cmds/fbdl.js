const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "fbdl",
    description: "Download Facebook content.",
    usage: "fbdl <url>",
    cooldown: 5,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    try {
      if (!args.length) {
        return reply("Please provide a Facebook URL. Usage: fbdl <url>", event);
      }

      const url = args[0];
      const apiUrl = `https://deku-rest-api.gleeze.com/facebook?url=${encodeURIComponent(url)}`;

      react("⏳", event);

      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

      const filePath = path.join(__dirname, 'cache', 'facebook_video.mp4');
      
      if (!fs.existsSync(path.join(__dirname, 'cache'))) {
        fs.mkdirSync(path.join(__dirname, 'cache'));
      }

      fs.writeFileSync(filePath, response.data);

      const attachment = {
        body: "🎥 Facebook content downloaded successfully!",
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