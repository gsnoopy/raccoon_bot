const fs = require('fs');
const path = require('path');
const { Discord } = require('../imports');
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { LocalStorage } = require('node-localstorage');

async function sorteioBicho(client) {
    try {

        const apostas = path.join(__dirname, '../database/Jogos/apostas.json');    
        const imagesFilePath = path.join(__dirname, '../database/Jogos/images.json');
        const localStorage = new LocalStorage('./temp');

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
            const guild = await client.guilds.fetch(guildId);
            const member = await guild.members.fetch(String(winner));
            
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
              await fs.writeFileSync(apostas, '[]', 'utf8');

              let embedBicho = new Discord.EmbedBuilder()
              .setColor(0x8000FF)
                .setTitle("Jogo do Bicho")
                .setDescription(`${premio70Percent}`)
                //.setImage("https://media.discordapp.net/attachments/1230485567750537246/1245258089612181564/AWK_CHAT_BANNER.gif?ex=66581878&is=6656c6f8&hm=0a6561baf484437da7befd79586077648022a9dd27505093c576e736b3f52397&=&width=525&height=350")
                
                const select = new StringSelectMenuBuilder()
                    .setCustomId('bichoChoice')
                    .setPlaceholder('Escolha o Bicho que deseja jogar!')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Barata')
                            .setEmoji('<:khazixcico:1246717078627422228>')
                            .setDescription('R$ 01,00')
                            .setValue('Barata'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Bambi')
                            .setEmoji('<:lilliacico:1246716957080817764>')
                            .setDescription('R$ 01,00')
                            .setValue('Bambi'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Bode')
                            .setEmoji('<:ornncico:1246716877925908532>')
                            .setDescription('R$ 01,00')
                            .setValue('Bode'),    
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Cachorro')
                            .setEmoji('<:nasuscico:1246716919525015614>')
                            .setDescription('R$ 01,00')
                            .setValue('Cachorro'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Cavalo')
                            .setEmoji('<:hecarimcico:1246717114576797726>')
                            .setDescription('R$ 01,00')
                            .setValue('Cavalo'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Cobra')
                            .setEmoji('<:cassiopeiacico:1246717221275832321>')
                            .setDescription('R$ 01,00')
                            .setValue('Cobra'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Dragão')
                            .setEmoji('<:smoldercico:1246716685231329331>')
                            .setDescription('R$ 01,00')
                            .setValue('Dragão'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Elefante')
                            .setEmoji('<:gragascico:1246717149888643112>')
                            .setDescription('R$ 01,00')
                            .setValue('Elefante'),    
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Escorpião')
                            .setEmoji('<:skarcico:1246716724670365778>')
                            .setDescription('R$ 01,00')
                            .setValue('Escorpião'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Gato')
                            .setEmoji('<:yuumicico:1246716453189586945>')
                            .setDescription('R$ 01,00')
                            .setValue('Gato'),
                            new StringSelectMenuOptionBuilder()
                            .setLabel('Guaxinim')
                            .setEmoji('<:teemocico:1246716619552587886>')
                            .setDescription('R$ 01,00')
                            .setValue('Guaxinim'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Jacaré')
                            .setEmoji('<:renektoncico:1246716802768310382>')
                            .setDescription('R$ 01,00')
                            .setValue('Jacaré'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Leão')
                            .setEmoji('<:rengarcico:1246716763547107338>')
                            .setDescription('R$ 01,00')
                            .setValue('Leão'),    
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Lobo')
                            .setEmoji('<:warwickcico:1246716517777936467>')
                            .setDescription('R$ 01,00')
                            .setValue('Lobo'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Macaco')
                            .setEmoji('<:wukongcico:1246716488497365002>')
                            .setDescription('R$ 01,00')
                            .setValue('Macaco'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Ovelha')
                            .setEmoji('<:kindredcico:1246717006024151152>')
                            .setDescription('R$ 01,00')
                            .setValue('Ovelha'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Passarinho')
                            .setEmoji('<:aniviacico:1246717284509290567>')
                            .setDescription('R$ 01,00')
                            .setValue('Passarinho'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Peixe')
                            .setEmoji('<:fizzcico:1246717189730336789>')
                            .setDescription('R$ 01,00')
                            .setValue('Peixe'),    
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Pombo')
                            .setEmoji('<:azircico:1246717250564788234>')
                            .setDescription('R$ 01,00')
                            .setValue('Pombo'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Raposa')
                            .setEmoji('<:ahricico:1246717319091064874>')
                            .setDescription('R$ 01,00')
                            .setValue('Raposa'),
                            new StringSelectMenuOptionBuilder()
                            .setLabel('Rato')
                            .setEmoji('<:twitchcico:1246716587353047141>')
                            .setDescription('R$ 01,00')
                            .setValue('Rato'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Sapo')
                            .setEmoji('<:tkcico:1246716651970494504>')
                            .setDescription('R$ 01,00')
                            .setValue('Sapo'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Tatu')
                            .setEmoji('<:rammuscico:1246716844442783877>')
                            .setDescription('R$ 01,00')
                            .setValue('Tatu'),    
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Urso')
                            .setEmoji('<:volibearcico:1246716552309379083>')
                            .setDescription('R$ 01,00')
                            .setValue('Urso'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Vaca')
                            .setEmoji('<:alistarcico:1246713250842673245>')
                            .setDescription('R$ 01,00')
                            .setValue('Vaca'),
                    );
        
                const row = new ActionRowBuilder()
                    .addComponents(select);

              const channelID = '1247283398771343493'; // ID do canal
              const messageIDToEdit = '1247308660749897762'
              const channelEDIT = client.channels.cache.get(channelID);

              if (channelEDIT) {
                  // Buscar a mensagem no canal
                  channelEDIT.messages.fetch(messageIDToEdit)
                      .then(message => {
                          // Verificar se a mensagem foi encontrada
                          if (message) {
                              // Editar a mensagem
                              message.edit({ embeds: [embedBicho], components: [row] });
                              console.log('Mensagem editada com sucesso.');
                          } else {
                              console.error(`Mensagem com ID ${messageIDToEdit} não encontrada.`);
                          }
                      })
                      .catch(console.error);
              } else {
                  console.error(`Canal com ID ${channelID} não encontrado.`);
              }
        }

    }catch(error){
        
        console.error(error)
        console.log("Erro no sorteio do Bicho")

    }

}

module.exports = { sorteioBicho };
