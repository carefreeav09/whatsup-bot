const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  execute: async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === "whatsupModal") {
      await interaction.reply({
        content: "Your submission was received successfully!",
      });
    }

    // Get the data entered by the user
    const updatesForYesterday = interaction.fields.getTextInputValue(
      "updatesForYesterday"
    );

    const updatesForToday =
      interaction.fields.getTextInputValue("updatesForToday");

    const updatesForTomorrow =
      interaction.fields.getTextInputValue("updatesForTomorrow");

    const anythingInteresting =
      interaction.fields.getTextInputValue("interestingField");
    console.log({
      updatesForYesterday,
      updatesForToday,
      updatesForTomorrow,
      anythingInteresting,
    });
  },
};
