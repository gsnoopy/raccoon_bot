const fs = require('fs');
const path = require('path');
const { Discord } = require('../imports');
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { LocalStorage } = require('node-localstorage');

async function sorteioBicho(client) {
    try {

        const apostas = path.join(__dirname, '../database/Jogos/apostas.json');    
        const imagesFilePath = path.join(__dirname, '../database/Jogos/images.json');
        const localStorage = new LocalStorage('../database/temp');

        const jsonData = fs.readFileSync(apostas, 'utf8');
        const apostasContent = JSON.parse(jsonData);
        const premioAcumulado = apostasContent.length;

        if(premioAcumulado < 10){
            console.log("Pessoas insuficientes para o sorteio, jogando para o próximo dia")
        }else{

            const bichosSet = new Set();
            apostasContent.forEach(aposta => {
                bichosSet.add(aposta.bicho);
            });
            const bichos = Array.from(bichosSet);
            console.log(bichos)

            const indiceSorteado = Math.floor(Math.random() * bichos.length);
            const bichoSorteado = bichos[indiceSorteado];
            console.log(bichoSorteado)

            const userIds = apostasContent
            .filter(aposta => aposta.bicho === bichoSorteado)
            .map(aposta => aposta.userId);
            console.log(userIds)    

            const indiceUser = Math.floor(Math.random() * userIds.length)
            const winner = userIds[indiceUser]

            let imagesContent = [];
            try {
                const imagesData = fs.readFileSync(imagesFilePath, 'utf8');
                imagesContent = JSON.parse(imagesData);
            } catch (error) {
                console.error('Erro ao ler o arquivo JSON de imagens:', error);
                return;
            }

            const bichoInfo = imagesContent.find(item => item.bicho === bichoSorteado);
            const thumbnailUrl = bichoInfo ? bichoInfo.image : '';
            const premio70Percent = Math.floor(premioAcumulado * 0.7);

            const participantesSet = new Set(apostasContent
                .filter(aposta => aposta.bicho === bichoSorteado)
                .map(aposta => `<@${aposta.userId}>`));
            
            const participantes = [...participantesSet];

            console.log(participantes)

            let embed = new Discord.EmbedBuilder()
                .setTitle(`${bichoSorteado} foi  o vencedor!`)
                .setDescription(`Jogadores:\n${participantes.join('\n')}\nVencedor: <@${winner}>\nPrêmio Acumulado: R$ ${premio70Percent}`)
                .setThumbnail(`${thumbnailUrl}`)
                .setColor(0x8000FF);

            const channel = await client.channels.fetch('1247428501636907009');
            await channel.send({ embeds: [embed] })

            const guildId = '1230446878089285662';
            const guild = client.guilds.cache.get(guildId);
            const member = guild.members.cache.get(winner);
            const channelName = `💎﹒premio﹒${member.user.username}`;

            const category = guild.channels.cache.get(process.env.TICKET) ?? null;

            const winnerChannel = await guild.channels.create({

                name: channelName,
                type: Discord.ChannelType.GuildText,
                parent: category,
                permissionOverwrites: [
                  {
                    id: guildId,
                    deny: [
                      Discord.PermissionFlagsBits.ViewChannel
                    ]
                  },
                  {
                    id: String(winner),
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

              let embedWinner = new Discord.EmbedBuilder()
                .setColor(0x8000FF)
                .setTitle(`Parabéns ${member.user.username}`)
                .setThumbnail(`${thumbnailUrl}`)
                .setDescription(`Você ganhou **R$ ${premio70Percent}** jogando no **${bichoSorteado}**, escolha como deseja resgatar seu prêmio clicando em um dos botões abaixo:`)
                
              const buttons = new Discord.ActionRowBuilder().addComponents(
                  new Discord.ButtonBuilder()
                    .setCustomId("saldoChoice")
                    .setLabel("Saldo no site")
                    .setEmoji("<:moneybagWhite:1234743197482221589>")
                    .setStyle(Discord.ButtonStyle.Primary),
                new Discord.ButtonBuilder()
                    .setCustomId("pixChoice")
                    .setLabel("Pix em sua conta")
                    .setEmoji("<:cicopix:1247437162698379295>")
                    .setStyle(Discord.ButtonStyle.Primary),
              );

              winnerChannel.send({ embeds: [embedWinner], components: [buttons] })
              localStorage.setItem('valorGanho', premio70Percent);

        }

    }catch(error){
        
        console.error(error)
        console.log("Erro no sorteio do Bicho")

    }

}

module.exports = { sorteioBicho };
