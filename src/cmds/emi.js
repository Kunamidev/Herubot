const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "emi",
    description: "Response image to Emi.",
    usage: "emi <prompt>",
    cooldown: 5,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    try {
      if (!args.length) {
        return reply("Please provide a prompt. Usage: emi <prompt>", event);
      }

      const prompt = args.join(" ");
      const url = `https://deku-rest-api.gleeze.com/emi?prompt=${encodeURIComponent(prompt)}`;

      react("⏳", event);

      const response = await axios.get(url, { responseType: 'arraybuffer' });

      const contentType = response.headers['content-type'];

      if (contentType.startsWith('image/')) {
        const filePath = path.join(__dirname, 'cache', 'emi_image.png');
        
        // Ensure the cache directory exists
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir);
        }

        // Write the image file to the cache folder
        fs.writeFileSync(filePath, response.data);

        const attachment = {
          body: "🤖 Emi Response",
          attachment: fs.createReadStream(filePath)
        };

        reply(attachment, event);
        react("✅", event);
      } else {
        react("⚠️", event);
        reply("The response from the API was not an image.", event);
      }
    } catch (error) {
      react("⚠️", event);
      reply(`An error occurred: ${error.message}`, event);
    }
  }
};
