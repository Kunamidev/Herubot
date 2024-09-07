const axios = require('axios');

module.exports = {
  config: {
    name: "gemini",
    description: "Talk to gemini ai",
    usage: "gemini <prompt>",
    cooldown: 5,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    try {
      if (!args.length) {
        return reply("Please provide a prompt. Usage: gemini <prompt>", event);
      }

      const prompt = args.join(" ");
      const url = `https://deku-rest-api.gleeze.com/gemini?prompt=${encodeURIComponent(prompt)}`;

      react("⏳", event);
      
      const response = await axios.get(url);
      const result = response.data.gemini;

      if (result) {
        reply(`🔮 𝗚𝗲𝗺𝗶𝗻𝗶\n━━━━━━━━━━━━━━━\n${result}`, event);
        react("✅", event);
      } else {
        react("⚠️", event);
        reply("Couldn't fetch a response. Please try again later.", event);
      }
    } catch (error) {
      react("⚠️", event);
      reply(`An error occurred: ${error.message}`, event);
    }
  }
};
