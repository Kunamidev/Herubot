module.exports = {
  config: {
    name: "uid",
    description: "Shares the user ID or group ID based on the input provided.",
    usage: "uid [@mention | URL | all | -g | group]",
    cooldown: 0,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply) => {
    let id;

    if (!args[0]) {
      id = event.senderID;
    } else if (args[0].startsWith('https://')) {
      const idd = await api.getUID(args[0]);
      return api.shareContact(idd, idd, event.threadID);
    } else if (event.type === "message_reply") {
      id = event.messageReply.senderID;
    } else if (args.join(' ').includes('@')) {
      id = Object.keys(event.mentions)[0];
    } else if (args.join(' ') === "all") {
      let m = '', c = 0;
      for (const i of event.participantIDs) {
        c += 1;
        m += `${c}. ${i}\n`;
      }
      return reply(m, event);
    } else if (args.join(' ') === "-g" || args.join(' ') === "group") {
      id = event.threadID;
      return reply(id, event);
    } else {
      id = args.join(' ');
    }

    return api.shareContact(id, id, event.threadID);
  }
};