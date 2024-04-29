const Discord = require("discord.js")

module.exports = {
  name: "support",
  description: "[ADM] Embed de ticket de suporte",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client,interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {

      interaction.reply({ content: `Você não possui permissão para utilzar este comando!`, ephemeral: true });

    } else {

      let embed = new Discord.EmbedBuilder()
        .setColor(0xDC6E00)
        .setTitle("Central de atendimento ")
        .setImage("https://media.discordapp.net/attachments/1227432819773538305/1227432843387600906/Group_2_2.png?ex=662862ea&is=6615edea&hm=ba4aae6c3b55a0588bb733940424526a91e0b62f95a998a654f700d1e570326c&=&format=webp&quality=lossless&width=1100&height=332")
        .setDescription("Possui uma dúvida ou um problema? clique no botão abaixo e você será colocado em atendimento privado com alguém da equipe Presentes Lol.")
        
      const button = new Discord.ActionRowBuilder().addComponents(
          new Discord.ButtonBuilder()
            .setCustomId("ticket")
            .setLabel("Abrir ticket")
            .setEmoji("<:ticketIcon:1220052559935569924>") 
            .setStyle(Discord.ButtonStyle.Primary)
      );

      interaction.reply({ content: `✅ Mensagem enviada!`, ephemeral: true });
      interaction.channel.send({ embeds: [embed], components: [button] });
    }
  }
}