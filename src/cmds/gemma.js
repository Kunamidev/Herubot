const axios = require('axios');

module.exports = {
  config: {
    name: "gemma",
    description: "Talk to Gemma Ai",
    usage: "gemma <query>",
    cooldown: 5,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    const query = args.length > 0 ? args.join(" ") : null;

    if (!query) {
      react("⚠️", event);
      return reply("Please provide a query.", event);
    }

    try {
      react("⏳", event);

      const searchingMessage = await new Promise(resolve => {
        api.sendMessage("⏳ Searching...", event.threadID, (err, info) => {
          resolve(info);
        });
      });

      const apiUrl = `https://deku-rest-api.gleeze.com/api/gemma-7b?q=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);
      const answer = response.data?.result || "I couldn't fetch a response from Gemma.";

      react("✅", event);
      await api.editMessage(
        `🌟 𝗚𝗲𝗺𝗺𝗮 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲\n━━━━━━━━━━━━━━━\n${answer}`,
        searchingMessage.messageID
      );

    } catch (error) {
      react("⚠️", event);
      return reply("There was an error fetching data from the Gemma API. Please try again later.", event);
    }
  }
};