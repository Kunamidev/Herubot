const axios = require('axios');

module.exports = {
  config: {
    name: "bing",
    description: "Talk to Bing AI.",
    usage: "bing [prompt]",
    cooldown: 5,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    try {
      let query = args.join(" ");
      if (!query) return reply("Please provide a prompt", event);

      react("⏳", event);

      const initialMessage = await api.sendMessage("⏳ Searching...", event.threadID, event.messageID);

      const response = await axios.get(`https://ruiapi.zapto.org/api/bing?prompt=${encodeURIComponent(query)}`);

      react("✅", event);
      api.editMessage(`💎 𝗕𝗶𝗻𝗴 𝗔𝗶\n━━━━━━━━━━━━━━━━━━\n${response.data.response}\n━━━━━━━━━━━━━━━━━━`, event.threadID, initialMessage.messageID);
    } catch (error) {
      react("❌", event);
      api.editMessage(`An error occurred: ${error.message}`, event.threadID, initialMessage.messageID);
    }
  },
  auto: async (api, event, text, reply) => {
    // Auto-reply logic if needed
  }
};
