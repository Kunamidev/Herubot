module.exports = {
  config: {
    name: "info",
    description: "Displays bot information including name, prefix, ping, admin status, VIP status, and more.",
    usage: "info",
    cooldown: 5,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply) => {
    try {
      const start = Date.now();
      await new Promise(resolve => setTimeout(resolve, 100));

      const ping = Date.now() - start;
      const isAdminBot = global.heru.admin.size > 0;
      const isVIP = global.heru.vip.size > 0;
      const userId = event.senderID;

      const infoMessage = `
✨ ${global.heru.botName} 𝗕𝗼𝘁 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻
━━━━━━━━━━━━━━━
⊂⊃ ➤ 𝗡𝗮𝗺𝗲: ${global.heru.botName}
⊂⊃ ➤ 𝗣𝗿𝗲𝗳𝗶𝘅: ${global.heru.prefix}
⊂⊃ ➤ 𝗣𝗶𝗻𝗴: ${ping}ms
⊂⊃ ➤ 𝗔𝗱𝗺𝗶𝗻 𝗕𝗼𝘁: ${isAdminBot ? "Yes" : "No"}
⊂⊃ ➤ 𝗩𝗜𝗣 𝗦𝘁𝗮𝘁𝘂𝘀: ${isVIP ? "VIP" : "Regular User"}
⊂⊃ ➤ 𝗨𝘀𝗲𝗿 𝗜𝗗: ${userId}
⊂⊃ ➤ 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: 𝚃𝚑𝚒𝚜 𝚋𝚘𝚝 𝚠𝚊𝚜 𝚖𝚊𝚍𝚎 𝚋𝚢 𝙹𝚊𝚢 𝙼𝚊𝚛 .
⊂⊃ ➤ 𝗟𝗮𝗻𝗴𝘂𝗮𝗴𝗲: 𝙹𝚊𝚧𝚊𝚂𝚌𝚒𝚙𝚝 (𝙽𝚘𝚍𝚎.𝚓𝚜)
⊂⊃ ➤ 𝗟𝗶𝗰𝗲𝗻𝘀𝗲: 𝙼𝙸𝚃 𝙻𝚒𝚌𝚎𝚗𝚜𝚎
      `;

      reply(infoMessage, event);
    } catch (error) {
      reply(`❗ An error occurred: ${error.message}`, event);
    }
  }
};