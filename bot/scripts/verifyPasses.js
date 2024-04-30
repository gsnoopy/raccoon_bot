    const fs = require('fs');
    const path = require('path');
    const axios = require('axios');
    const { createLogs } = require('../logs/createLogs');
    const { Discord } = require('../imports');

    async function verifyPasses(client) {
    try {
        // Caminho para os arquivos JSON
        const pagAtivosFilePath = path.join(__dirname, '../database/Passes/pagAtivos.json');
        const pagSoldFilePath = path.join(__dirname, '../database/Passes/pagSold.json');

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
            const pagSoldContent = fs.existsSync(pagSoldFilePath) ? JSON.parse(fs.readFileSync(pagSoldFilePath, 'utf8')) : [];
            pagSoldContent.push(pagamento);
            fs.writeFileSync(pagSoldFilePath, JSON.stringify(pagSoldContent, null, 2));

            let embedLog = new Discord.EmbedBuilder()
            .setColor(0x0ff36)
            .setTitle("Venda realizada!")
            .setThumbnail("https://media.discordapp.net/attachments/1230485567750537246/1234601315636740147/XP_boost.webp?ex=66315393&is=66300213&hm=3ccd54f7823e2ab35c49b273d2817552c001b30bfc6502952894da53dae9d7d4&=&format=webp")
            .setDescription(`Item: UP de Passe\nuserID: ${userId}\nuserName: ${username}\nValor: R$ ${valor}`)

            let embed = new Discord.EmbedBuilder()
            .setColor(0xD904FF)
            .setTitle("Pagamento aprovado!")
            .setDescription("Seu pagamento foi processado e para continuarmos com o up do seu passe precisamos que você clique no botão abaixo e forneça seus dados para que possamos começar [EDITAR]")
            
            const button = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("createDados")
                    .setLabel("Começar")
                    .setEmoji("<:ticketIcon:1220052559935569924>") 
                    .setStyle(Discord.ButtonStyle.Primary)
            );

            // Enviando mensagem no channelId
            const channel = client.channels.cache.get(channelId);
            if (channel) {
                const messages = await channel.messages.fetch({ limit: 100 });
                await channel.bulkDelete(messages);
                await channel.send({ embeds: [embed], components: [button] });;
                await createLogs(client,'1234599428372041728',embedLog)
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

    module.exports = { verifyPasses };
