const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "help",
    description: "Displays a list of available commands or detailed info about a specific command.",
    usage: "help [commandName]",
    cooldown: 0,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    try {
      const commandsPath = path.join(__dirname, '..', 'cmds');
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

      // If no specific command is provided, list all commands
      if (!args[0]) {
        let helpMessage = "✨ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁\n━━━━━━━━━━━━━━━\n";
        commandFiles.forEach(file => {
          const command = require(path.join(commandsPath, file));
          helpMessage += `⊂⊃ ➤ ${command.config.name}\n`;
        });
        helpMessage += `━━━━━━━━━━━━━━━\n⊂⊃ ➤ 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${commandFiles.length}\n`;

        return reply(helpMessage, event);
      }

      // Show detailed information about a specific command
      const commandName = args[0].toLowerCase();
      const commandFile = commandFiles.find(file => {
        const command = require(path.join(commandsPath, file));
        return command.config.name === commandName;
      });

      if (!commandFile) {
        return reply(`❗ Command "${commandName}" not found.`, event);
      }

      const command = require(path.join(commandsPath, commandFile));
      const prefixRequired = command.config.prefix ? 'Yes' : 'No';
      const roleRequired = command.config.role === 1 ? 'Admin' : 'Everyone';

      let commandInfo = `✨ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱: ${command.config.name}\n`;
      commandInfo += `━━━━━━━━━━━━━━━\n`;
      commandInfo += `📄 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${command.config.description}\n`;
      commandInfo += `🔧 𝗨𝘀𝗮𝗴𝗲: ${command.config.usage}\n`;
      commandInfo += `⏳ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: ${command.config.cooldown} second(s)\n`;
      commandInfo += `🔑 𝗣𝗿𝗲𝗳𝗶𝘅 𝗥𝗲𝗾𝘂𝗶𝗿𝗲𝗱: ${prefixRequired}\n`;
      commandInfo += `🔒 𝗥𝗼𝗹𝗲 𝗥𝗲𝗾𝘂𝗶𝗿𝗲𝗱: ${roleRequired}\n`;
      commandInfo += `━━━━━━━━━━━━━━━\n`;

      return reply(commandInfo, event);

    } catch (error) {
      react("⚠️", event);
      reply(`An error occurred: ${error.message}`, event);
    }
  }
};
