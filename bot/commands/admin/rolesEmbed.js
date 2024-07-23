const Discord = require("discord.js")
const { AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: "roles",
  description: "[ADM] Embed de ticket de cargos",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client,interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {

      interaction.reply({ content: `Você não possui permissão para utilzar este comando!`, ephemeral: true });

    } else {

      let embed = new Discord.EmbedBuilder()
        .setColor(0x8000FF)
        //.setTitle("Cargos Raccoon Services")
        //.setImage("https://media.discordapp.net/attachments/1230485567750537246/1234720092906852383/Invites.png?ex=6631c232&is=663070b2&hm=257600376e629523ca55fef8fa015f3de95cacc27ab02a7bd81526ddee54f31f&=&format=webp&quality=lossless")
        .setDescription("**Cargos de Apoio:**\n\n<@&1230464445109764106> - Realizou a verificação\n<@&1230471645387423806> - Deixou um feedback\n<@&1236774813306065031> - Seguiu a Raccoon no Twitter\n<@&1236774647777853511> - Convidou 5 amigos para o servidor\n<@&1230471720352223253> - Possúi todos os cargos anteriores\n<@&1231069803595432029> - Impulsionou o servidor\n\n**Cargos Extras:**\n\n<@&1236451064178409532> - Participou de um bingo do Cico\n<@&1236775651554627644> - Participou de um torneio da Raccoon\n<@&1236451495436882023> - Adquiriu um prêmio no bingo\n<@&1236775704658448444> - Foi campeão de um Torneio\n\n**Recompensas:**\n\n<@&1230471720352223253> - 2x mais entrada em sorteios\n<@&1236774647777853511> - Entradas em Sorteios Personalizados\n<@&1231069803595432029> - 2x mais entrada em sorteios\n")
        
      const buttons = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
            .setCustomId("ticketReward")
            .setLabel("Reinvindicar Cargo")
            .setEmoji("<:moneybagWhite:1234743197482221589>") 
            .setStyle(Discord.ButtonStyle.Primary),
        new Discord.ButtonBuilder()
            .setLabel('Twitter')
            .setURL(`https://twitter.com/RaccoonSmurfs`)
            .setStyle(ButtonStyle.Link)
      );

      interaction.reply({ content: `✅ Mensagem enviada!`, ephemeral: true });
      interaction.channel.send({ embeds: [embed], components: [buttons] });
    }
  }
}