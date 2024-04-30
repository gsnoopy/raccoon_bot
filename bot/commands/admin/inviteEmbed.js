const Discord = require("discord.js")

module.exports = {
  name: "referral",
  description: "[ADM] Embed de ticket de invites",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client,interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {

      interaction.reply({ content: `Você não possui permissão para utilzar este comando!`, ephemeral: true });

    } else {

      let embed = new Discord.EmbedBuilder()
        .setColor(0x8000FF)
        .setTitle("Convide e ganhe")
        .setImage("https://media.discordapp.net/attachments/1230485567750537246/1234720092906852383/Invites.png?ex=6631c232&is=663070b2&hm=257600376e629523ca55fef8fa015f3de95cacc27ab02a7bd81526ddee54f31f&=&format=webp&quality=lossless")
        .setDescription("Ganhe recompensas apoiando a Raccoon Services, para cada 5 pessoas que você convidar e ficar em nosso servidor você ganhará 1 icone ou 1 croma a sua escolha! Cheque o seu progresso utilizando o comando /invites do Invite Tracker no canal <#1231727134112874576> e após ter 5 invites regular abra um Ticket clicando no botão abaixo.")
        
      const button = new Discord.ActionRowBuilder().addComponents(
          new Discord.ButtonBuilder()
            .setCustomId("ticketReward")
            .setLabel("Reinvindicar Recompensa")
            .setEmoji("<:moneybagWhite:1234743197482221589>") 
            .setStyle(Discord.ButtonStyle.Primary)
      );

      interaction.reply({ content: `✅ Mensagem enviada!`, ephemeral: true });
      interaction.channel.send({ embeds: [embed], components: [button] });
    }
  }
}