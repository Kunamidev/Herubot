const X = require('fca-deku');
const logger = require('./utils/logger');
const fs = require("fs");
const path = require("path");
require("./utils/index");
const expres = require("express");

const config = JSON.parse(fs.readFileSync("./config.json"));

global.heru = {
  prefix: config.PREFIX,
  botName: config.BOTNAME,
  admin: new Set(config.ADMINBOT),
  vip: new Set(config.VIP),
  autobio: config.AUTOBIO,
};

const appState = JSON.parse(fs.readFileSync("./herustate.json"));

const commands = {};
const commandPath = path.join(__dirname, "src", "cmds");

try {
  const files = fs.readdirSync(commandPath);
  files.forEach(file => {
    if (file.endsWith(".js")) {
      try {
        const script = require(path.join(commandPath, file));
        commands[script.config.name] = script;
        logger.logger(`Successfully loaded command: ${script.config.name}`);
      } catch (e) {
        logger.warn(`Failed to load command: ${file}\nReason: ${e.message}`);
      }
    }
  });
} catch (err) {
  logger.warn(`Error reading command directory: ${err.message}`);
}

global.handle = {
  replies: new Map(),
  cooldown: new Map(),
};

X({ appState }, async (err, api) => {
  if (err) {
    logger.warn(`Error initializing bot: ${err.message}`);
    return;
  }

  logger.message(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
╭╮╱╭┳━━━┳━━━┳╮╱╭╮╭━━╮╭━━━┳━━━━╮
┃┃╱┃┃╭━━┫╭━╮┃┃╱┃┃┃╭╮┃┃╭━╮┃╭╮╭╮┃
┃╰━╯┃╰━━┫╰━╯┃┃╱┃┃┃╰╯╰┫┃╱┃┣╯┃┃╰╯
┃╭━╮┃╭━━┫╭╮╭┫┃╱┃┃┃╭━╮┃┃╱┃┃╱┃┃
┃┃╱┃┃╰━━┫┃┃╰┫╰━╯┃┃╰━╯┃╰━╯┃╱┃┃
╰╯╱╰┻━━━┻╯╰━┻━━━╯╰━━━┻━━━╯╱╰╯
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[✓] CREDITS: JAY MAR 
━━━━━━━━━━━━━━━
[•] PREFIX: ${global.heru.prefix}
[•] BOT NAME: ${global.heru.botName}
━━━━━━━━━━━━━━━
[•] VIP: ${global.heru.vip.size}
━━━━━━━━━━━━━━━
[•] ADMIN BOT: ${global.heru.admin.size}
━━━━━━━━━━━━━━━
[•] CONTACT: https://www.facebook.com/jaymar.dev.00
━━━━━━━━━━━━━━━
[•] FILENAME: HERUBOT
[•] VERSION: 1.0.0
[•] AUTHOR: JAYMAR
━━━━━━━━━━━━━━━
[✓] LOGIN SUCCESSFULLY
━━━━━━━━━━━━━━━
  `);

  api.setOptions(config.option);

  const react = (emoji, event) => {
    api.setMessageReaction(emoji, event.messageID, () => {}, true);
  };

  const reply = (text, event) => {
    api.sendMessage(text, event.threadID, event.messageID);
  };

  if (global.heru.autobio) {
    api.changeBio(`⚙️ 𝙼𝚢 𝚙𝚛𝚎𝚏𝚒𝚡: ${global.heru.prefix}\n✨ 𝙰𝚍𝚖𝚒𝚗: ${global.heru.admin.size}\n🔰 𝚅𝙸𝙿𝚜: ${global.heru.vip.size}\n♻️ 𝚂𝚝𝚊𝚝𝚞𝚜: 🟢\n⏰ 𝚂𝚎𝚛𝚟𝚎𝚛: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })}`);
  }

  api.listenMqtt(async (err, event) => {
    if (err) {
      logger.warn(`Error processing event: ${err.message}`);
      return;
    }

    if (event.type === "event" && event.logMessageType === "log:subscribe") {
      const { threadID } = event;
      let { threadName, participantIDs } = await api.getThreadInfo(threadID);

      if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        const authorName = "https://facebook.com/" + event.author;

        api.changeNickname(
          `${global.heru.botName} • » ${global.heru.prefix} «`,
          event.threadID,
          api.getCurrentUserID()
        );

        api.shareContact(
          `✅ Connected successfully "${global.heru.prefix}help" to see all commands.`,
          api.getCurrentUserID(),
          threadID
        );

        return api.sendMessage(
          `——[BOT LOGS]——\n\nBot has been added to a group.\n\nName: ${threadName || "Unnamed Group"}\n\nGroup ID: ${event.threadID}\n\nTotal of members: ${participantIDs.length}\n\nAdded by: ${authorName}\n\n——[BOT LOGS]——`,
          Array.from(global.heru.admin)[0],
        );
      } else {
        try {
          let addedParticipants1 = event.logMessageData.addedParticipants;
          for (let newParticipant of addedParticipants1) {
            let userID = newParticipant.userFbId;
            if (userID !== api.getCurrentUserID()) {
              api.shareContact(
                `👋 Hello! Welcome to ${threadName || "this group"} 🤗, you're the ${participantIDs.length}th member on this group. Enjoy!🤗`,
                userID,
                threadID,
              );
            }
          }
        } catch (e) {
          return reply(e.message);
        }
      }
    }

    if (event.logMessageType === "log:unsubscribe") {
      let { threadName, participantIDs } = await api.getThreadInfo(event.threadID);
      let tn = threadName || "Unnamed Group";

      if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) {
        const authorName = (await api.getUserInfo(event.author)).name;
        return api.sendMessage(
          `——[BOT LOGS]——\n\nBot has been kicked from a group.\n\nName: ${tn}\n\nID: ${event.threadID}\n\nKicked by: ${authorName}\n\n[ f ]: https://facebook.com/${event.author}\n\n——[BOT LOGS]——`,
          Array.from(global.heru.admin)[0],
        );
      } else {
        const type = event.author == event.logMessageData.leftParticipantFbId
          ? "left the group."
          : "kicked by the Admin of the group.";

        return api.shareContact(
          "Member has been " + type + "\n" + tn + " now has " + participantIDs.length + " members left.",
          event.logMessageData.leftParticipantFbId,
          event.threadID,
        );
      }
    }

    if (event.type !== "message" || !event.body) return;

    const body = event.body.trim().toLowerCase();
    let commandName = "";
    let args = [];

    const isPrefixed = body.startsWith(global.heru.prefix);
    if (isPrefixed) {
      const commandBody = body.slice(global.heru.prefix.length).trim();
      [commandName, ...args] = commandBody.split(/\s+/);
      commandName = commandName.toLowerCase();
    } else {
      const words = body.split(/\s+/);
      commandName = words[0].toLowerCase();
      args = words.slice(1);
    }

    logger.logs(`╭ ─┉─¡! [ LOGS ] !¡─┉─ ╮\n\n👤: ${event.senderID}\n🗨️: ${event.body}\n\n╰ ─┉─¡! [ LOGS ] !¡─┉─ ╯\n\n`);

    const dateNow = Date.now();
    
      if (event["type"] == "message_reply") {
        if (event["senderID"] === api["getCurrentUserID"]()) {
          const cmd = global["handle"]["replies"][event["messageID"]];
          if (cmd) {
            const { threadID, senderID, messageID, body } = event,
              replier = {
                event: event,
                data: {
                  msg: body,
                  tid: threadID,
                  mid: messageID,
                  uid: senderID,
                },
                received: cmd,
              };
            require(`./src/cmds/${cmd.cmdname}`).startReply({ api: api, replier: replier, event: event, }); return; } else return; } };

    if (commands[commandName]) {
  const command = commands[commandName];

  if (!global.handle.cooldown.has(commandName)) {
    global.handle.cooldown.set(commandName, new Map());
  }

  const timeStamps = global.handle.cooldown.get(commandName);
  const expiration = command.config.cooldown * 1000;

  if (timeStamps.has(event.senderID) && dateNow < timeStamps.get(event.senderID) + expiration) {
    const cooldownTime = (timeStamps.get(event.senderID) + expiration - dateNow) / 1000;
    return reply(`⏳ Command is still on cooldown for ${cooldownTime.toFixed(1)} second(s), please try again later.`, event);
  }

  timeStamps.set(event.senderID, dateNow);
  setTimeout(() => timeStamps.delete(event.senderID),expiration);

  if (command.config.prefix !== false && !isPrefixed) {
    react("⚠️", event);
    return reply(`⚒️ Command "${commandName}" needs a prefix.`, event);
  }

  if (command.config.prefix === false && isPrefixed) {
    react("⚠️", event);
    return reply(`⚒️ Command "${commandName}" doesn't need a prefix.`, event);
  }

  if (command.config.role === 1 && !global.heru.admin.has(event.senderID)) {
    react("⚠️", event);
    return reply(`❗ You don't have permission to use the command! name "${commandName}"`, event);
  }

  try {
    await command.run(api, event, args, reply, react);
  } catch (error) {
    react("⚠️", event);
    reply(`Error executing command '${commandName}': ${error.message}`, event);
  }
} else {
  if (body === "prefix") {
    return api.shareContact(
      `⚙️ My prefix is:  》 ${global.heru.prefix} 《`,
      api.getCurrentUserID(),
      event.threadID,
    );
  }

  if (body === global.heru.prefix) {
    return api.shareContact(
      `Type ${global.heru.prefix}help to view available commands.`,
      api.getCurrentUserID(),
      event.threadID,
    );
  }
    }
});
});