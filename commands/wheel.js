const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wheel")
    .setDescription("פתיחת גלגל המזל"),

  async execute(interaction) {

    const WHEEL_CHANNEL_ID =
      "1529158985725251624";


    if (interaction.channel.id !== WHEEL_CHANNEL_ID) {

      return interaction.reply({
        content: "❌ הפקודה רק בחדר הגלגל",
        ephemeral: true
      });

    }


    await interaction.reply({
      content: "🎡 הגלגל כבר נמצא בחדר!",
      ephemeral: true
    });

  }
};
