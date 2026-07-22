const { SlashCommandBuilder } = require("discord.js");
const { loadData } = require("../utils/save");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("בדיקת כמות נקודות"),

  async execute(interaction) {

    const points = loadData(
      "points.json",
      {}
    );


    const amount =
      points[interaction.user.id] || 0;


    await interaction.reply({
      content: `💎 יש לך ${amount} נקודות`,
      ephemeral: true
    });

  }
};
