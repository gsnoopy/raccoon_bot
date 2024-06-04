const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { createLogs } = require('../logs/createLogs');
const { Discord } = require('../imports');
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

async function verifyBicho(client) {
    try {
        // Caminho para os arquivos JSON
        const pagAtivosFilePath = path.join(__dirname, '../database/Jogos/pagAtivos.json');
        const pagSoldFilePath = path.join(__dirname, '../database/Jogos/apostas.json');    
        const imagesFilePath = path.join(__dirname, '../database/Jogos/images.json');

        // Lendo o arquivo JSON de transações ativas
        let pagAtivosContent = [];
        try {
            const jsonData = fs.readFileSync(pagAtivosFilePath, 'utf8');
            pagAtivosContent = JSON.parse(jsonData);
        } catch (error) {
            console.error('Erro ao ler o arquivo JSON de transações ativas:', error);
            return;
        }

        let imagesContent = [];
        try {
            const imagesData = fs.readFileSync(imagesFilePath, 'utf8');
            imagesContent = JSON.parse(imagesData);
        } catch (error) {
            console.error('Erro ao ler o arquivo JSON de imagens:', error);
            return;
        }

        // Iterando sobre as transações ativas
        for (const pagamento of pagAtivosContent) {
            const { paymentId, createdAt, channelId, userId, username, valor, bicho } = pagamento;

            // Verificando se o pagamento foi aprovado
            const isApproved = await verifyApprovedPayment(paymentId);
            const currentTime = new Date();
            const createdAtTime = new Date(createdAt);
            const diffInMinutes = Math.floor((currentTime - createdAtTime) / (1000 * 60));

            if (isApproved) {
                // Movendo o item para pagSold.json
                let pagSoldContent = [];
                if (fs.existsSync(pagSoldFilePath)) {
                    const soldData = fs.readFileSync(pagSoldFilePath, 'utf8');
                    pagSoldContent = JSON.parse(soldData);
                }
                pagSoldContent.push(pagamento);
                fs.writeFileSync(pagSoldFilePath, JSON.stringify(pagSoldContent, null, 2));

                const bichoInfo = imagesContent.find(item => item.bicho === bicho);
                const thumbnailUrl = bichoInfo ? bichoInfo.image : '';
                
                let embedLog = new Discord.EmbedBuilder()
                    .setColor(0x0ff36)
                    .setTitle("Venda realizada!")
                    .setThumbnail(`${thumbnailUrl}`)
                    .setDescription(`Item: Jogo do Bicho\nUser: <@${userId}>\nBicho: ${bicho}\nValor: R$ ${valor}`);

                let embed = new Discord.EmbedBuilder()
                    .setTitle("Pagamento confirmado!")
                    .setDescription("Aoba")
                    .setColor('#008000');

                // Enviando mensagem no channelId
                const channel = client.channels.cache.get(channelId);
                if (channel) {
                    const user = await client.users.fetch(userId);
                    try{
                        await user.send({ embeds: [embed] });
                    }catch(error){
                        console.log(`Usuário com ID ${userId} tem a DM fechada.`);
                    }
                    await channel.delete();
                    await createLogs(client, '1234599428372041728', embedLog);
                }

                // Removendo o item de pagAtivos.json
                pagAtivosContent = pagAtivosContent.filter(item => item.paymentId !== paymentId);
                fs.writeFileSync(pagAtivosFilePath, JSON.stringify(pagAtivosContent, null, 2));

                const jsonData = fs.readFileSync(pagSoldFilePath, 'utf8');
                const apostasContent = JSON.parse(jsonData);
                const premioAcumulado = apostasContent.length;
                let premio70Percent 

                if(premioAcumulado > 11){
                    premio70Percent = Math.floor(premioAcumulado * 0.7);
                }else{
                    premio70Percent = 7
                }

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
                
            } else if (diffInMinutes >= 25) {
                pagAtivosContent = pagAtivosContent.filter(item => item.paymentId !== paymentId);
                fs.writeFileSync(pagAtivosFilePath, JSON.stringify(pagAtivosContent, null, 2));

                const channel = client.channels.cache.get(channelId);
                if (channel) {
                    await channel.send(`Pagamento expirado! Este canal será fechado em breve.`);
                }

                // Deletando o canal após 5 segundos
                setTimeout(async () => {
                    if (channel) {
                        await channel.delete();
                    }
                }, 5000);
            }
        }
    } catch (error) {
        console.error('Erro ao verificar pagamentos:', error);
    }
}

async function verifyApprovedPayment(paymentId) {
    try {
        const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: {
                Authorization: `Bearer ${process.env.MP_TOKEN}`,
            },
        });
        return response.data.status === 'approved';
    } catch (error) {
        console.error(`Erro ao verificar pagamento ${paymentId}:`, error.message);
        return false;
    }
}

module.exports = { verifyBicho };
