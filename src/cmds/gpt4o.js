const axios = require('axios');

module.exports = {
  config: {
    name: "gpt4o",
    description: "Talk to gpt4o.",
    usage: "gpt4o [your prompt]",
    cooldown: 5,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    try {
      let prompt = args.join(" ");
      if (!prompt) return reply("Please provide a prompt.", event);

      react("⏳", event);

      const initialMessage = await api.sendMessage("⏳ Searching...", event.threadID, event.messageID);

      const response = await axios.get(`https://ruiapi.ddns.net/api/gpt4o?prompt=${encodeURIComponent(prompt)}`);

      react("✅", event);
      api.editMessage(`💎 𝗚𝗽𝘁4𝗼\n━━━━━━━━━━━━━━━━━━\n${response.data.response}\n━━━━━━━━━━━━━━━━━━`, event.threadID, initialMessage.messageID);
    } catch (error) {
      react("❌", event);
      api.editMessage(`Error: ${error.message}`, event.threadID, initialMessage.messageID);
    }
  },
  auto: async (api, event, text, reply) => {
    // Auto-reply logic can be added here if needed
  }
};
