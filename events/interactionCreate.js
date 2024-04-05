const {
  ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  execute: async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "whatsup") {
      // Create the modal
      const modal = new ModalBuilder()
        .setCustomId("whatsupModal")
        .setTitle("What's going on, homie?");

      // Add components to modal

      // Create the text input components
      const updatesForYesterday = new TextInputBuilder()
        .setCustomId("updatesForYesterday")
        // The label is the prompt the user sees for this input
        .setLabel("What did you do yesterday?")
        // Short means only a single line of text
        .setStyle(TextInputStyle.Short);

      // Create the text input components
      const updatesForToday = new TextInputBuilder()
        .setCustomId("updatesForToday")
        // The label is the prompt the user sees for this input
        .setLabel("What are your plans for today?")
        // Short means only a single line of text
        .setStyle(TextInputStyle.Short);

      // Create the text input components
      const updatesForTomorrow = new TextInputBuilder()
        .setCustomId("updatesForTomorrow")
        // The label is the prompt the user sees for this input
        .setLabel("What are your plans for Tomorrow?")
        // Short means only a single line of text
        .setStyle(TextInputStyle.Short);

      const anythingInteresting = new TextInputBuilder()
        .setCustomId("interestingField")
        .setLabel("Did you do anything interesteing yesterday?")
        // Paragraph means multiple lines of text.
        .setStyle(TextInputStyle.Paragraph);

      // An action row only holds one text input,
      // so you need one action row per text input.
      const firstActionRow = new ActionRowBuilder().addComponents(
        updatesForYesterday
      );
      const secondActionRow = new ActionRowBuilder().addComponents(
        updatesForToday
      );
      const thirdActionRow = new ActionRowBuilder().addComponents(
        updatesForTomorrow
      );
      const interestingField = new ActionRowBuilder().addComponents(
        anythingInteresting
      );

      // Add inputs to the modal
      modal.addComponents(
        firstActionRow,
        secondActionRow,
        thirdActionRow,
        interestingField
      );

      // Show the modal to the user
      await interaction.showModal(modal);
    }
  },
};
