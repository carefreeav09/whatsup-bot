const { Events } = require("discord.js");
const { initiateStoringProcess } = require("../utils/storeData.js");

module.exports = {
  name: Events.InteractionCreate,
  execute: async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === "whatsupModal") {
      await interaction.reply({
        content: "Your submission was received successfully!",
      });
    }

    //
    const username = interaction.user.username;

    // Get the data entered by the user
    const updatesForYesterday = interaction.fields.getTextInputValue(
      "updatesForYesterday"
    );

    const updatesForToday =
      interaction.fields.getTextInputValue("updatesForToday");

    const anythingInteresting =
      interaction.fields.getTextInputValue("interestingField");
    console.log({
      username,
      updatesForYesterday,
      updatesForToday,
      anythingInteresting,
    });

    initiateStoringProcess({
      username,
      updatesForYesterday,
      updatesForToday,
      anythingInteresting,
    });
  },
};
