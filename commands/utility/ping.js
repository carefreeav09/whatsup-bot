const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whatsup")
    .setDescription("Takes your updates, ( and your moneh )"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
