const { AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Discord } = require('../../imports');

async function ticketReward(interaction) {

  await interaction.deferReply({ephemeral: true})

  try {

      const channelName = `💰﹒resgatar﹒${interaction.user.username}`;
      const category = interaction.guild.channels.cache.get(process.env.REWARDS) ?? null;
      const existingChannel = interaction.guild.channels.cache.find(c => c.name === channelName);

      if (existingChannel) {

        return interaction.editReply({ 
          content: `Você já possui um ticket aberto sobre esse assunto em ${existingChannel}!`, 
          ephemeral: true 
        });

      }
    
      const channel = await interaction.guild.channels.create({

        name: channelName,
        type: Discord.ChannelType.GuildText,
        parent: category,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [
              Discord.PermissionFlagsBits.ViewChannel
            ]
          },
          {
            id: interaction.user.id,
            allow: [
              Discord.PermissionFlagsBits.ViewChannel,
              Discord.PermissionFlagsBits.SendMessages,
              Discord.PermissionFlagsBits.AttachFiles,
              Discord.PermissionFlagsBits.EmbedLinks,
              Discord.PermissionFlagsBits.AddReactions
            ]
          }
        ]

      });
      
      const embed = new EmbedBuilder()
        .setColor(0x8000FF)
        .setTitle(`Olá ${interaction.user.username}`)
        .setDescription(`Por favor nos diga qual conquista você alcançou para que possámos verificar e recompensá-lo!`)
        .setThumbnail('https://media.discordapp.net/attachments/1230485567750537246/1236763422306078720/Captura_de_Tela_2024-05-05_as_16.33.20.png?ex=66393131&is=6637dfb1&hm=13252529eaa54ba9b107e886b5ae38dd693267aeebf1de242a3d7f981357a877&=&format=webp&quality=lossless');

      const button = new ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("deleteTicket")
          .setLabel("Fechar ticket")
          .setEmoji("<:lockWhite:1234743193409552414>") 
          .setStyle(Discord.ButtonStyle.Primary),
      );

      channel.send({ embeds: [embed], components: [button]})

      await interaction.editReply({ 
        content: `Seu ticket para resgatar uma recompensa foi aberto no canal: ${channel}!`, 
        ephemeral: true 
      });

  } catch (error) {

    console.error('Erro ao processar transação: ticketReward', error);

  }
}

module.exports = { ticketReward };
