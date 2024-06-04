const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { createLogs } = require('../logs/createLogs');
const { Discord } = require('../imports');
const { AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function verifyBingo(client) {
    try {
        // Caminho para os arquivos JSON
        const pagAtivosFilePath = path.join(__dirname, '../database/Bingo/pagAtivos.json');
        const pagSoldFilePath = path.join(__dirname, '../database/Bingo/pagSold.json');    

        // Lendo o arquivo JSON de transações ativas
        let pagAtivosContent = [];
        try {
            const jsonData = fs.readFileSync(pagAtivosFilePath, 'utf8');
            pagAtivosContent = JSON.parse(jsonData);
        } catch (error) {
            console.error('Erro ao ler o arquivo JSON de transações ativas:', error);
            return;
        }

        // Iterando sobre as transações ativas
        for (const pagamento of pagAtivosContent) {
            const { paymentId, createdAt, channelId, userId, username, valor } = pagamento;

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

                let embedLog = new Discord.EmbedBuilder()
                    .setColor(0x0ff36)
                    .setTitle("Venda realizada!")
                    .setThumbnail("https://media.discordapp.net/attachments/1230485567750537246/1234732338693279795/undefined_-_Imgur-modified.png?ex=6631cd99&is=66307c19&hm=395e2f0b55e182088b1d36d3c6dc8117d272f809a434bf21bf9abfdeff47bcaf&=&format=webp&quality=lossless")
                    .setDescription(`Item: Cartela Bingo\nuserID: ${userId}\nuserName: ${username}\nValor: R$ ${valor}`);

                const cartelas = await getCartelas();
                const urlCartela = cartelas.data;

                let embed = new Discord.EmbedBuilder()
                    .setTitle("Pagamento confirmado!")
                    .setDescription("Acesse suas cartelas do Bingão do Cico clicando no botão abaixo")
                    .setColor('#008000')
                    .setThumbnail("https://em-content.zobj.net/source/twitter/376/check-mark-button_2705.png");

                const button = new ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel('Cartelas')
                        .setURL(`${urlCartela}`)
                        .setStyle(ButtonStyle.Link),
                );
                
                // Enviando mensagem no channelId
                const channel = client.channels.cache.get(channelId);
                if (channel) {
                    const messages = await channel.messages.fetch({ limit: 100 });
                    await channel.bulkDelete(messages);
                    await channel.send({ embeds: [embed], components: [button] });
                    await createLogs(client, '1234599428372041728', embedLog);
                }

                // Removendo o item de pagAtivos.json
                pagAtivosContent = pagAtivosContent.filter(item => item.paymentId !== paymentId);
                fs.writeFileSync(pagAtivosFilePath, JSON.stringify(pagAtivosContent, null, 2));

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
                Authorization: `Bearer ${process.env.MP_CICO}`,
            },
        });
        return response.data.status === 'approved';
    } catch (error) {
        console.error(`Erro ao verificar pagamento ${paymentId}:`, error.message);
        return false;
    }
}

async function getCartelas(){
    try{
        const response = await axios.get('https://bingo.cico.lol/gerarcartela.php')
        return response;
    }catch(error){
        console.log(`Erro pegar as cartelas`, error.message)
    }
}

module.exports = { verifyBingo };
