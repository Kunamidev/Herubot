const axios = require('axios');

module.exports = {
  config: {
    name: "ai2",
    description: "Talk to ai2",
    usage: "ai2 <question>",
    cooldown: 0,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    const question = args.length > 0 ? args.join(" ") : null;

    if (!question) {
      react("⚠️", event);
      return reply("Please provide a question.", event);
    }

    try {
      react("⏳", event);

      const searchingMessage = await new Promise(resolve => {
        api.sendMessage("⏳ Searching...", event.threadID, (err, info) => {
          resolve(info);
        });
      });

      const response = await axios.get(`https://markdevs69.vercel.app/api/v3/gpt4?ask=${encodeURIComponent(question)}`);
      const answer = response.data?.answer || "I couldn't fetch a response from the AI.";

      react("✅", event);
      await api.editMessage(
        "🌟 𝙰𝚒 𝙰𝚜𝚜𝚒𝚜𝚝𝚊𝚗𝚝\n━━━━━━━━━━━━━━━\n" + answer,
        searchingMessage.messageID
      );

    } catch (error) {
      react("⚠️", event);
      return reply("There was an error fetching the AI's response. Please try again later.", event);
    }
  }
};