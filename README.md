# THIS BOT WAS MADE BY JAY MAR KNOWN AS HERU

# Example Command

This is an example command structure for a bot using the configuration and command system. Below is the code that defines an `example` command:

```javascript
module.exports.config = {
  name: "hi",
  prefix: true,  // This command requires a prefix
  accessableby: 0,  // 0 means everyone can use this command
};

module.exports.run = async (api, event, args, reply, react) => {
  try {
    // React with ⏳ to indicate processing
    react("⏳", event);

    // Respond with "hello"
    const response = "hello";

    // React with ✅ to indicate success
    react("✅", event);

    // Send the reply message
    reply(response, event);

  } catch (error) {
    // React with ⚠️ to indicate an error
    react("⚠️", event);

    // Send an error message
    reply(`An error occurred: ${error.message}`, event);
  }
};
