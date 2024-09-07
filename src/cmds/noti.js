module.exports = {
  config: {
    name: "noti",
    description: "Sends a notification message to all group threads.",
    usage: "noti <message>",
    cooldown: 0,
    role: 1,
    prefix: true
  },
  run: async (api, event, args, reply) => {
    const message = args.join(" ");
    if (!message) {
      return reply("Please provide a notification message.", event);
    }

    try {
      const threadList = await api.getThreadList(100, null, ["INBOX"]);
      let groupCount = 0;

      for (const thread of threadList) {
        if (thread.isGroup) {
          groupCount++;
          const threadName = thread.name || "";
          const msg = `𝗔𝗗𝗠𝗜𝗡 𝗡𝗢𝗧𝗜𝗖𝗘 🔊\n━━━━━━━━━━━━━━━━━━━\n⚒️ 𝗚𝗿𝗼𝘂𝗽 𝗡𝗮𝗺𝗲: ${threadName}\n\n💌 𝗠𝗲𝘀𝘀𝗮𝗴𝗲: ${message}\n━━━━━━━━━━━━━━━━━━━`;

          await api.sendMessage(msg, thread.threadID);
        }
      }

      reply(`Notification sent to ${groupCount} groups`, event);
    } catch (error) {
      reply(`❗ An error occurred: ${error.message}`, event);
    }
  }
};