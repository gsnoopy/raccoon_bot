const fs = require('fs');
const path = require('path'); 

async function deleteBingo(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
        const channel = interaction.channel;

        // Encontrar o channelId correspondente no arquivo JSON
        const filePath = path.join(__dirname, '../../database/Bingo/pagAtivos.json');
        let jsonContent = [];
        try {
            const jsonData = fs.readFileSync(filePath, 'utf8');
            jsonContent = JSON.parse(jsonData);
        } catch (error) {
            console.error('Erro ao ler o arquivo JSON:', error);
        }

        const channelId = channel.id;

        // Remover o item correspondente ao channelId
        const index = jsonContent.findIndex(item => item.channelId === channelId);
        if (index !== -1) {
            jsonContent.splice(index, 1);
            // Escrever o JSON atualizado de volta no arquivo
            try {
                const jsonData = JSON.stringify(jsonContent, null, 2);
                fs.writeFileSync(filePath, jsonData);
                console.log('Item removido com sucesso do arquivo JSON.');
            } catch (error) {
                console.error('Erro ao escrever no arquivo JSON:', error);
            }
        }

        interaction.editReply({ content: "O canal será fechado em 3 segundos!" });

        setTimeout(async () => {
            await channel.delete();
        }, 3000);

    } catch (error) {
        console.error('Erro ao processar botão "deleteBingo":', error);
        await interaction.reply({ content: "Erro ao processar o botão deleteBingo.", ephemeral: true });
    }
}

module.exports = { deleteBingo };
