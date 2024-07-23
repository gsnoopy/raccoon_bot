const { Client, TextChannel } = require('discord.js');

async function createLogs(client, channelId, embed) {

  try {

    const channel = await client.channels.fetch(channelId);

    if (!(channel instanceof TextChannel)) {

      throw new Error('O canal fornecido não é um canal de texto.');

    }

    await channel.send({ embeds: [embed] });

  } catch (error) {

    console.error('Erro ao criar o log:', error);
    
  }
}

module.exports = { createLogs };
