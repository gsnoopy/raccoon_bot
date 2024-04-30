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
        .setColor(0x8000FF)
        .setTitle("Central de atendimento")
        .setImage("https://media.discordapp.net/attachments/1230485567750537246/1234720093141860392/Tickets.png?ex=6631c232&is=663070b2&hm=9c4a1b94170be0aef3caf030853ad470ff8584b1472e121e1a922e5603c3f3ed&=&format=webp&quality=lossless&width=789&height=279")
        .setDescription("Possui uma dúvida ou um problema? clique no botão abaixo e você será colocado em atendimento privado com alguém da equipe Raccoon Services.")
        
      const button = new Discord.ActionRowBuilder().addComponents(
          new Discord.ButtonBuilder()
            .setCustomId("ticket")
            .setLabel("Abrir ticket")
            .setEmoji("<:mailboxWhite:1234747708837724161>") 
            .setStyle(Discord.ButtonStyle.Primary)
      );

      interaction.reply({ content: `✅ Mensagem enviada!`, ephemeral: true });
      interaction.channel.send({ embeds: [embed], components: [button] });
    }
  }
}