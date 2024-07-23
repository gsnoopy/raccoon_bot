const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Discord } = require('../../imports');
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

async function submitChampions(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    try {
        const champion = interaction.fields.getTextInputValue('championInput');
        const filePath = path.join(__dirname, `../../database/Champions/${champion}.json`);

        if (!fs.existsSync(filePath)) {
            return interaction.editReply({ content: `Campeão ${champion} não encontrado na base de dados.`, ephemeral: true });
        }

        const skinsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        const payload = {
            skinGroup: skinsData,
            region: "br"
        };

        const headers = {
            "accept": "application/json, text/plain, */*",
            "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json",
            "priority": "u=1, i",
            "referrer": "https://www.mafiasmurfs.com/skins/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        };

        const url = "https://www.mafiasmurfs.com/api/v1/stock/skins/check";
        const response = await axios.post(url, payload, { headers });

        console.log(response.data.data);

        // Ordenar as skins por raridade
        const rarityOrder = {
            "DEFAULT": 1,
            "EPIC": 2,
            "LEGENDARY": 3,
            "ULTIMATE": 4
        };

        const sortedSkins = response.data.data
            .filter(skin => skin.isOnStock)  // Filtrar apenas as skins em estoque
            .sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

        // Processar a resposta e criar a mensagem com as skins disponíveis
        let skinsDescription = "";
        sortedSkins.forEach(skin => {
            let emoji;
            let price;
            switch (skin.rarity) {
                case "DEFAULT":
                    emoji = "<:rsdefault:1245249854540615681>";
                    price = 27.00;
                    break;
                case "EPIC":
                    emoji = "<:rsepic:1245249959411060797>";
                    price = 30.00;
                    break;
                case "LEGENDARY":
                    emoji = "<:rslegendary:1245250037676642365>";
                    price = 35.00;
                    break;
                case "ULTIMATE":
                    emoji = "<:rsultimate:1245250084493594655>";
                    price = 40.00;
                    break;
                default:
                    price = 0; // Adiciona um preço padrão se a raridade não for reconhecida
            }

            skinsDescription += `${emoji} ${skin.skinName}\n`;
        });

        const embed = new Discord.EmbedBuilder()
            .setTitle(`Skins disponíveis do campeão escolhido:`)
            .setColor(0x8000FF)
            .setDescription(skinsDescription)

        const select = new StringSelectMenuBuilder()
            .setCustomId('skinChoice')
            .setPlaceholder('Escolha a raridade da skin desejada')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Smurf DEFAULT')
                    .setEmoji('<:rsdefault:1245249854540615681>')
                    .setDescription('R$ 27,00')
                    .setValue('default'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Smurf ÉPICA')
                    .setEmoji('<:rsepic:1245249959411060797>')
                    .setDescription('R$ 30,00')
                    .setValue('epic'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Smurf LENDÁRIA')
                    .setEmoji('<:rslegendary:1245250037676642365>')
                    .setDescription('R$ 35,00')
                    .setValue('legendary'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Smurf ULTIMATE')
                    .setEmoji('<:rsultimate:1245250084493594655>')
                    .setDescription('R$ 40,00')
                    .setValue('ultimate'),
            );

        const row = new ActionRowBuilder()
            .addComponents(select);

        await interaction.editReply({ephemeral: true, embeds: [embed], components: [row] });

    } catch (error) {
        console.error('Erro ao buscar skins:', error);
        await interaction.editReply({ content: "Erro ao buscar skins disponíveis.", ephemeral: true });
    }
}

module.exports = { submitChampions };
