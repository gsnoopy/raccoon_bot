const Discord = require("discord.js")
const { AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: "verify",
  description: "[ADM] Embed de verificação de membros",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client,interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {

      interaction.reply({ content: `Você não possui permissão para utilzar este comando!`, ephemeral: true });

    } else {

      let embed = new Discord.EmbedBuilder()
        .setColor(0x8000FF)
        .setImage("https://media.discordapp.net/attachments/1230485567750537246/1234720093385261066/Verify.png?ex=6631c232&is=663070b2&hm=286ce4ca7ba8bc33dbe73090d2db7c8325d6ec0600995beab87b54388a0285e7&=&format=webp&quality=lossless&width=789&height=279")
        .setDescription("Clique no botão abaixo e realize a verificação para acessar o nosso servidor e visualizar nossa vitrine e comunidade! Essa verificação evita pessoas má intencionadas e garante a nossa e a sua segurança.")
        
        const button = new ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
              .setLabel('Realizar Verificação')
              .setEmoji("<:checkWhite:1234743190423081023>")
              .setURL(`https://restorecord.com/verify/Raccoon%20Services`)
              .setStyle(ButtonStyle.Link),
        );

      interaction.reply({ content: `✅ Mensagem enviada!`, ephemeral: true });
      interaction.channel.send({ embeds: [embed], components: [button] });
    }
  }
}