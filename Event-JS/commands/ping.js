const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("ทดสอบคำสั่งของบอท"),
    async execute(interaction) {
        await interaction.deferReply();

        await interaction.followUp.send({ content: "Ping" })
    }
}