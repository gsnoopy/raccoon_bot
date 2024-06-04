const fs = require('fs');
const path = require('path'); 

async function deleteSkins(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
        const channel = interaction.channel;

        // Encontrar o channelId correspondente no arquivo JSON
        const filePath = path.join(__dirname, '../../database/Smurfs/Skins/pagAtivos.json');
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

        const row = interaction.message.components[0]; // Primeira linha de botões
        const buttonIndex = row.components.findIndex(component => component.customId === 'deleteSkins');
        if (buttonIndex !== -1) {
            row.components.splice(buttonIndex, 1); // Remove o botão da linha de botões
            // Atualiza a mensagem para remover o botão
            await interaction.message.edit({ components: [row] });
        }

        interaction.editReply({ content: "O canal será fechado em 3 segundos!" });

        setTimeout(async () => {
            await channel.delete();
        }, 3000);

    } catch (error) {
        console.error('Erro ao processar botão "deleteSkins":', error);
        await interaction.reply({ content: "Erro ao processar o botão deleteSkins.", ephemeral: true });
    }
}

module.exports = { deleteSkins };
