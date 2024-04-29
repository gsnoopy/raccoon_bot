const Discord = require("discord.js");
const axios = require("axios");
const { AttachmentBuilder } = require('discord.js');

const championInfo = require("../../../api/champion_info.json");;
const runesImages = require("../../../api/runes.json");

const createImage = require('../../utils/createImage');
const translateItems = require('../../utils/translateItems');
const translateSpells = require('../../utils/translateSpells');

module.exports = {
  name: "build",
  description: "[MEMBER] Pesquise a build de um campeão.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      type: Discord.ApplicationCommandOptionType.String,
      name: "campeão",
      description: "Digite o nome ou alias do campeão",
      required: true
    },
    {
      type: Discord.ApplicationCommandOptionType.String,
      name: "rota",
      description: "Qual a rota desejada?",
      required: true
    }
  ],
  run: async (client, interaction) => {
    try {

      await interaction.deferReply();

      const championName = interaction.options.getString("campeão");
      const role = interaction.options.getString("rota");

      let championData = null;
      for (const champion of championInfo) {
        if (champion.name.toLowerCase() === championName.toLowerCase() || champion.alias.toLowerCase() === championName.toLowerCase()) {
          championData = champion;
          break;
        }
      }

      if (!championData) {
        await interaction.editReply({ content: "Campeão não encontrado. Por favor, verifique o nome ou alias do campeão e tente novamente." });
        return;
      }

      const apiUrl = "http://127.0.0.1:5000/champion_data";
      const requestData = {
        champion_name: championData.alias,
        role: role
      };

      const response = await axios.post(apiUrl, requestData);
      let buildData = response.data;

      buildData.items = translateItems(buildData.items);
      buildData.spells = translateSpells(buildData.spells);

      console.log(buildData.items)
      console.log(buildData.spells)
      console.log(buildData.runas)

      const runesNames = buildData.runas;

      const runesUrls = runesNames.map(nameRune => {
        const imageUrl = runesImages[nameRune];
        return imageUrl;
      });

      const nomeDoArquivo = 'imagemCombinada.png';

      await createImage(runesUrls, 150, 150, nomeDoArquivo);
      const file = new AttachmentBuilder('imagemCombinada.png');


      const embed = new Discord.EmbedBuilder()
        .setTitle(`${championData.alias} fo`)
        .setThumbnail(`${championData.splash}`)
        .setImage(`attachment://imagemCombinada.png`)
        .addFields(
          { name: "Skill Order", value: buildData.skill_order.join(" - ") },
          { name: "Runes", value: buildData.runas.join("\n") },
          { name: "Stats", value: buildData.stats.join("\n") },
          { name: "Spells", value: buildData.spells.join("\n")},
          { name: "Items", value: buildData.items.length > 0 ? buildData.items.map(item => `${item.item} ${item.pick_rate}`).join("\n") : "Não foram encontrados itens para este campeão no ProBuilds" },
          { name: "Counters", value: buildData.counters.join(" ") }
        )
        .setTimestamp()
        .setFooter({ text: 'Developed by awk_' });

        const buttons = new Discord.ActionRowBuilder().addComponents(
          new Discord.ButtonBuilder()
            .setLabel('u.gg')
            .setURL(`https://u.gg/lol/champions/${championName}/build/${role}`)
            .setStyle(Discord.ButtonStyle.Link),
          new Discord.ButtonBuilder()
            .setLabel('ProBuilds')
            .setURL(`https://probuildstats.com/champion/${championName}?role=${role}`)
            .setStyle(Discord.ButtonStyle.Link),
      );

      await interaction.editReply({ embeds: [embed], components: [buttons], files: [file] });

    } catch (error) {
      console.error("Ocorreu um erro:", error);
      await interaction.editReply({ content: "Erro ao processar o comando build." });
    }
  }
};


