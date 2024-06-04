const Discord = require("discord.js");  

const { transcriptMessages } = require('../../logs/transcriptMessages')

async function serviceDone(interaction) {

    await interaction.deferReply({ ephemeral: true });

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {

        interaction.reply({ content: `Você não possui permissão para utilzar este botão!`, ephemeral: true });
  
      } else {

            try {

                const channel = interaction.channel;

                const messages = await channel.messages.fetch({ limit: 1 });
                const firstMessage = messages.first();

            if (firstMessage) {
                await firstMessage.delete();
            }

                interaction.editReply({content: "O canal será fechado em 3 segundos!"});
                await transcriptMessages(interaction,channel,'1234748679261519893');
                    
        
            } catch (error) {
            
                console.error('Erro ao processar botão "serviceDone":', error);
                await interaction.reply({ content: "Erro ao processar o botão serviceDone.", ephemeral: true });
            
            }
    }
}

module.exports = { serviceDone };
