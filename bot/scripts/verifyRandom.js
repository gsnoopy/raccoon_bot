const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { createLogs } = require('../logs/createLogs');
const { Discord } = require('../imports');

async function verifyRandom(client) {
    try {
        // Caminho para os arquivos JSON
        const pagAtivosFilePath = path.join(__dirname, '../database/Smurfs/Random/pagAtivos.json');
        const pagSoldFilePath = path.join(__dirname, '../database/Smurfs/Random/pagSold.json');

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
                    .setThumbnail("https://media.discordapp.net/attachments/1230485567750537246/1245009897150611456/Unranked.png?ex=66573152&is=6655dfd2&hm=2bfb71deccdf2129dcb4be12f00775212f2e5877df71bb892a4c4058b9bacd24&=&format=webp&quality=lossless&width=868&height=684")
                    .setDescription(`Item: Smurf Random\nuserID: ${userId}\nuserName: ${username}\nValor: R$ ${valor}`);

                let embed = new Discord.EmbedBuilder()
                    .setColor(0xD904FF)
                    .setTitle("Pagamento aprovado!")
                    .setDescription(`Olá ${username}, obrigado por comprar o produto **Smurf Random**, em instantes alguém da STAFF irá lhe enviar o produto, é importante que você tenha a DM liberada para lhe enviarmos por lá também!`);

                const button = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId("serviceDone")
                        .setLabel("Conta Entregue")
                        .setEmoji("<:ticketIcon:1220052559935569924>") 
                        .setStyle(Discord.ButtonStyle.Primary),
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
                Authorization: `Bearer ${process.env.MP_TOKEN}`,
            },
        });
        return response.data.status === 'approved';
    } catch (error) {
        console.error(`Erro ao verificar pagamento ${paymentId}:`, error.message);
        return false;
    }
}

module.exports = { verifyRandom };
