const { 
    Client, 
    GatewayIntentBits, 
    Events, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits,
    SlashCommandBuilder,
    REST,
    Routes
} = require('discord.js');
const express = require('express');
require('dotenv').config();

// Servidor HTTP para Koyeb
const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('🚀 Eternal Shop Bot está online 24/7!');
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor HTTP corriendo en puerto ${PORT}`);
});

// Cliente Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Comandos slash
const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ver la latencia del bot'),
    
    new SlashCommandBuilder()
        .setName('paypal')
        .setDescription('Ver información de PayPal para intercambios'),
    
    new SlashCommandBuilder()
        .setName('ltc')
        .setDescription('Ver dirección de Litecoin para intercambios'),
    
    new SlashCommandBuilder()
        .setName('hablabot')
        .setDescription('Hacer que el bot diga un mensaje')
        .addStringOption(option => 
            option.setName('texto')
                .setDescription('El texto que quieres que diga el bot')
                .setRequired(true)),
    
    new SlashCommandBuilder()
        .setName('setup-tickets')
        .setDescription('Crear panel de tickets')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    new SlashCommandBuilder()
        .setName('setup-exchange')
        .setDescription('Crear panel de intercambios PayPal ↔ LTC')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    new SlashCommandBuilder()
        .setName('ayuda')
        .setDescription('Ver todos los comandos del bot')
].map(command => command.toJSON());

// Registrar comandos
async function registerCommands() {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    try {
        console.log('🔄 Registrando comandos...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('✅ Comandos registrados correctamente!');
    } catch (error) {
        console.error('❌ Error registrando comandos:', error);
    }
}

// Bot listo
client.once(Events.ClientReady, async readyClient => {
    console.log(`🚀 Eternal Shop conectado como ${readyClient.user.tag}`);
    await registerCommands();
    console.log('🎯 ¡Bot listo para usar 24/7!');
});

// Manejar comandos
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    try {
        if (commandName === 'ping') {
            const embed = new EmbedBuilder()
                .setTitle('🏓 Pong!')
                .setDescription(`Latencia: ${client.ws.ping}ms`)
                .setColor(0x00FF00);
            await interaction.reply({ embeds: [embed] });
        }

        if (commandName === 'paypal') {
            const embed = new EmbedBuilder()
                .setTitle('💳 Información de PayPal')
                .addFields(
                    { name: '📧 Email', value: '`pendejillonose@gmail.com`', inline: false },
                    { name: '⚠️ Importante', value: 'Envía como Amigos y Familia', inline: false }
                )
                .setColor(0x0070BA);
            await interaction.reply({ embeds: [embed] });
        }

        if (commandName === 'ltc') {
            const embed = new EmbedBuilder()
                .setTitle('🪙 Dirección Litecoin')
                .addFields(
                    { name: '🏦 Dirección', value: '`LiXsaJkPjsCKVN2khRPEcENUT8GroHpif8`', inline: false },
                    { name: '⚠️ Importante', value: 'Verifica bien antes de enviar', inline: false }
                )
                .setColor(0xBEBEBE);
            await interaction.reply({ embeds: [embed] });
        }

        if (commandName === 'hablabot') {
            const texto = interaction.options.getString('texto');
            await interaction.channel.send(texto);
            await interaction.reply({ content: '✅ Mensaje enviado!', ephemeral: true });
        }

        if (commandName === 'setup-tickets') {
            const embed = new EmbedBuilder()
                .setTitle('🎫 Eternal Shop - Sistema de Tickets')
                .setDescription('Haz clic para crear un ticket de soporte')
                .setColor(0x7B68EE);

            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('create_ticket')
                        .setLabel('🎫 Crear Ticket')
                        .setStyle(ButtonStyle.Primary)
                );

            await interaction.reply({ embeds: [embed], components: [button] });
        }

        if (commandName === 'setup-exchange') {
            const embed = new EmbedBuilder()
                .setTitle('💱 Eternal Exchange System')
                .setDescription('Intercambios seguros PayPal ↔ Litecoin')
                .setColor(0xFFD700);

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('exchange_paypal_ltc')
                        .setLabel('💳 PayPal → LTC')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('exchange_ltc_paypal')
                        .setLabel('🪙 LTC → PayPal')
                        .setStyle(ButtonStyle.Success)
                );

            await interaction.reply({ embeds: [embed], components: [buttons] });
        }

        if (commandName === 'ayuda') {
            const embed = new EmbedBuilder()
                .setTitle('📋 Eternal Shop - Comandos')
                .addFields(
                    { name: '👥 **PARA TODOS**', value: '`/ping` - Latencia\n`/paypal` - Info PayPal\n`/ltc` - Dirección LTC\n`/hablabot` - Hacer hablar al bot', inline: false },
                    { name: '🎫 **TICKETS**', value: '`/setup-tickets` - Panel de tickets (Admin)\n`/setup-exchange` - Panel de intercambios (Admin)', inline: false }
                )
                .setColor(0x7B68EE);
            await interaction.reply({ embeds: [embed] });
        }
    } catch (error) {
        console.error('Error en comando:', error);
        if (!interaction.replied) {
            await interaction.reply({ content: '❌ Error ejecutando comando.', ephemeral: true });
        }
    }
});

// Manejar botones
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    try {
        if (interaction.customId === 'create_ticket') {
            const ticketChannel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                ],
            });

            const embed = new EmbedBuilder()
                .setTitle('🎫 Ticket Creado')
                .setDescription(`¡Hola ${interaction.user}! Describe tu consulta aquí.`)
                .setColor(0x4CAF50);

            await ticketChannel.send({ embeds: [embed] });
            await interaction.reply({ content: `✅ Ticket creado: ${ticketChannel}`, ephemeral: true });
        }

        if (interaction.customId === 'exchange_paypal_ltc') {
            const ticketChannel = await interaction.guild.channels.create({
                name: `exchange-paypal-${interaction.user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                ],
            });

            const embed = new EmbedBuilder()
                .setTitle('💳 Intercambio PayPal → LTC')
                .setDescription(`¡Hola ${interaction.user}!\n\n**Proceso:**\n1. Indica la cantidad\n2. Envía PayPal a: \`pendejillonose@gmail.com\`\n3. Recibirás LTC`)
                .setColor(0x0070BA);

            await ticketChannel.send({ embeds: [embed] });
            await interaction.reply({ content: `✅ Intercambio creado: ${ticketChannel}`, ephemeral: true });
        }

        if (interaction.customId === 'exchange_ltc_paypal') {
            const ticketChannel = await interaction.guild.channels.create({
                name: `exchange-ltc-${interaction.user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                ],
            });

            const embed = new EmbedBuilder()
                .setTitle('🪙 Intercambio LTC → PayPal')
                .setDescription(`¡Hola ${interaction.user}!\n\n**Proceso:**\n1. Indica la cantidad\n2. Envía LTC a: \`LiXsaJkPjsCKVN2khRPEcENUT8GroHpif8\`\n3. Recibirás PayPal`)
                .setColor(0xBEBEBE);

            await ticketChannel.send({ embeds: [embed] });
            await interaction.reply({ content: `✅ Intercambio creado: ${ticketChannel}`, ephemeral: true });
        }
    } catch (error) {
        console.error('Error en botón:', error);
    }
});

// Mantener activo
setInterval(() => {
    console.log('🔄 Bot activo - ' + new Date().toLocaleTimeString());
}, 5 * 60 * 1000);

// Iniciar bot
client.login(process.env.DISCORD_TOKEN);
