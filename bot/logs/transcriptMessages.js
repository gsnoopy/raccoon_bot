const fs = require('fs');
const path = require('path');

async function transcriptMessages(interaction, channel, id) {
    const formatDateTime = (dateTime) => {
        dateTime.setHours(dateTime.getHours() - 3);
        return dateTime.toLocaleString('pt-BR', { timeZone: 'UTC' });
    };

    const tempFolderPath = path.join(__dirname, '../../temp');

    if (!fs.existsSync(tempFolderPath)) {
        fs.mkdirSync(tempFolderPath, { recursive: true });
    }

    const transcriptFileName = `transcript_${channel.id}.txt`;
    const transcriptFilePath = path.join(tempFolderPath, transcriptFileName);

    fs.writeFileSync(transcriptFilePath, '');

    await channel.messages.fetch({ limit: 100 }).then(messages => {
        const sortedMessages = messages.sort((a, b) => a.createdAt - b.createdAt);

        sortedMessages.forEach(message => {
            const formattedDateTime = formatDateTime(message.createdAt);
            const line = `${formattedDateTime} - ${message.author.username}: ${message.content}\n`;
            fs.appendFileSync(transcriptFilePath, line);
        });
    });

    const transcriptChannel = interaction.guild.channels.cache.get(`${id}`);

    if (transcriptChannel) {
        await transcriptChannel.send({ files: [transcriptFilePath] });
    }

    fs.unlinkSync(transcriptFilePath);

    setTimeout(async () => {
        await channel.delete();
    }, 3000);
}

module.exports = { transcriptMessages };
