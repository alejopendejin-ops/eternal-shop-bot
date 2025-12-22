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
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Configuración
const TICKET_CONFIG = {
    categoryId: null,
    ticketCounter: 0
};

// Comandos
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
        .setName('serverinfo')
        .setDescription('Ver información del servidor'),
    
    new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Ver información de un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario a consultar (opcional)')
                .setRequired(false)),
    
    new SlashCommandBuilder()
        .setName('setup-tickets')
        .setDescription('Crear panel de tickets')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    new SlashCommandBuilder()
        .setName('setup-exchange')
        .setDescription('Crear panel de intercambios PayPal ↔ LTC')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    new SlashCommandBuilder()
        .setName('cerrar')
        .setDescription('Cerrar ticket actual'),
    
    new SlashCommandBuilder()
        .setName('add-user')
        .setDescription('Añadir usuario al ticket')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario a añadir')
                .setRequired(true)),
    
    new SlashCommandBuilder()
        .setName('remove-user')
        .setDescription('Quitar usuario del ticket')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario a quitar')
                .setRequired(true)),
    
    new SlashCommandBuilder()
        .setName('claim')
        .setDescription('Asignarse el ticket'),
    
    new SlashCommandBuilder()
        .setName('ticket-info')
        .setDescription('Ver información del ticket actual'),
    
    new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banear usuario')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario a banear')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('razon')
                .setDescription('Razón del ban')
                .setRequired(false)),
    
    new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulsar usuario')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario a expulsar')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('razon')
                .setDescription('Razón')
                .setRequired(false)),
    
    new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Silenciar usuario')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario a silenciar')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('tiempo')
                .setDescription('Tiempo (10m, 1h, 1d)')
                .setRequired(true)),
    
    new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Quitar silencio')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario')
                .setRequired(true)),
    
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
        console.error('❌ Error:', error);
    }
}

// Bot listo
client.once(Events.ClientReady, async readyClient => {
    console.log(`🚀 Eternal Shop conectado como ${readyClient.user.tag}`);
    await registerCommands();
    console.log('🎯 ¡Bot listo para usar!');
});

// Comandos
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

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

    if (commandName === 'ayuda') {
        const embed = new EmbedBuilder()
            .setTitle('📋 Eternal Shop - Comandos Completos')
            .addFields(
                { name: '👥 **PARA TODOS**', value: '`/ping` - Latencia\n`/paypal` - Info PayPal\n`/ltc` - Dirección LTC\n`/hablabot` - Hacer hablar al bot\n`/serverinfo` - Info servidor\n`/userinfo` - Info usuario', inline: false },
                { name: '🎫 **TICKETS**', value: '`/setup-tickets` - Panel (Admin)\n`/setup-exchange` - Exchange (Admin)\n`/cerrar` - Cerrar ticket\n`/add-user` - Añadir usuario\n`/remove-user` - Quitar usuario\n`/claim` - Asignarse ticket\n`/ticket-info` - Info ticket', inline: false },
                { name: '👑 **MODERACIÓN**', value: '`/ban` - Banear\n`/kick` - Expulsar\n`/mute` - Silenciar\n`/unmute` - Quitar silencio', inline: false }
            )
            .setColor(0x7B68EE);
        await interaction.reply({ embeds: [embed] });
    }

    if (commandName === 'serverinfo') {
        const guild = interaction.guild;
        const embed = new EmbedBuilder()
            .setTitle(`📊 ${guild.name}`)
            .addFields(
                { name: '👑 Propietario', value: `<@${guild.ownerId}>`, inline: true },
                { name: '👥 Miembros', value: `${guild.memberCount}`, inline: true },
                { name: '📅 Creado', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
            )
            .setColor(0x7B68EE);
        await interaction.reply({ embeds: [embed] });
    }

    if (commandName === 'userinfo') {
        const user = interaction.options.getUser('usuario') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);
        
        const embed = new EmbedBuilder()
            .setTitle(`👤 ${user.tag}`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: '🆔 ID', value: user.id, inline: true },
                { name: '📅 Cuenta creada', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '📥 Se unió', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true }
            )
            .setColor(0x7B68EE);
        await interaction.reply({ embeds: [embed] });
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

    if (commandName === 'cerrar') {
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: '❌ Solo funciona en tickets.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('🔒 Cerrar Ticket')
            .setDescription('¿Cerrar este ticket?')
            .setColor(0xFF0000);

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm_close')
                    .setLabel('✅ Sí')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('cancel_close')
                    .setLabel('❌ No')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({ embeds: [embed], components: [buttons] });
    }

    if (commandName === 'add-user') {
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: '❌ Solo funciona en tickets.', ephemeral: true });
        }

        const user = interaction.options.getUser('usuario');
        await interaction.channel.permissionOverwrites.create(user.id, {
            ViewChannel: true,
            SendMessages: true
        });

        await interaction.reply(`✅ ${user} añadido al ticket.`);
    }

    if (commandName === 'remove-user') {
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: '❌ Solo funciona en tickets.', ephemeral: true });
        }

        const user = interaction.options.getUser('usuario');
        await interaction.channel.permissionOverwrites.delete(user.id);
        await interaction.reply(`➖ ${user} removido del ticket.`);
    }

    if (commandName === 'claim') {
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: '❌ Solo funciona en tickets.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('👤 Ticket Reclamado')
            .setDescription(`${interaction.user} se asignó este ticket.`)
            .setColor(0x4CAF50);

        await interaction.reply({ embeds: [embed] });
    }

    if (commandName === 'ticket-info') {
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: '❌ Solo funciona en tickets.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('ℹ️ Info del Ticket')
            .addFields(
                { name: '📅 Creado', value: `<t:${Math.floor(interaction.channel.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '👥 Miembros', value: `${interaction.channel.members.size}`, inline: true }
            )
            .setColor(0x7B68EE);

        await interaction.reply({ embeds: [embed] });
    }

    if (commandName === 'ban') {
        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('razon') || 'No especificada';
        
        try {
            const member = await interaction.guild.members.fetch(user.id);
            await member.ban({ reason });
            await interaction.reply(`🔨 ${user.tag} ha sido baneado. Razón: ${reason}`);
        } catch (error) {
            await interaction.reply({ content: '❌ Error al banear.', ephemeral: true });
        }
    }

    if (commandName === 'kick') {
        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('razon') || 'No especificada';
        
        try {
            const member = await interaction.guild.members.fetch(user.id);
            await member.kick(reason);
            await interaction.reply(`👢 ${user.tag} ha sido expulsado. Razón: ${reason}`);
        } catch (error) {
            await interaction.reply({ content: '❌ Error al expulsar.', ephemeral: true });
        }
    }

    if (commandName === 'mute') {
        const user = interaction.options.getUser('usuario');
        const timeStr = interaction.options.getString('tiempo');
        
        // Convertir tiempo
        const timeRegex = /^(\d+)([mhd])$/;
        const match = timeStr.match(timeRegex);
        
        if (!match) {
            return interaction.reply({ content: '❌ Formato: 10m, 1h, 1d', ephemeral: true });
        }

        const amount = parseInt(match[1]);
        const unit = match[2];
        let duration;

        switch (unit) {
            case 'm': duration = amount * 60 * 1000; break;
            case 'h': duration = amount * 60 * 60 * 1000; break;
            case 'd': duration = amount * 24 * 60 * 60 * 1000; break;
        }

        try {
            const member = await interaction.guild.members.fetch(user.id);
            await member.timeout(duration);
            await interaction.reply(`🔇 ${user.tag} silenciado por ${timeStr}.`);
        } catch (error) {
            await interaction.reply({ content: '❌ Error al silenciar.', ephemeral: true });
        }
    }

    if (commandName === 'unmute') {
        const user = interaction.options.getUser('usuario');
        
        try {
            const member = await interaction.guild.members.fetch(user.id);
            await member.timeout(null);
            await interaction.reply(`🔊 ${user.tag} ya puede hablar.`);
        } catch (error) {
            await interaction.reply({ content: '❌ Error al des-silenciar.', ephemeral: true });
        }
    }
});

// Botones
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

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
            .setDescription(`¡Hola ${interaction.user}!\n\n**Proceso:**\n1. Indica la cantidad a intercambiar\n2. Envía PayPal a: \`pendejillonose@gmail.com\`\n3. Recibirás LTC en tu dirección`)
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
            .setDescription(`¡Hola ${interaction.user}!\n\n**Proceso:**\n1. Indica la cantidad a intercambiar\n2. Envía LTC a: \`LiXsaJkPjsCKVN2khRPEcENUT8GroHpif8\`\n3. Recibirás PayPal en tu email`)
            .setColor(0xBEBEBE);

        await ticketChannel.send({ embeds: [embed] });
        await interaction.reply({ content: `✅ Intercambio creado: ${ticketChannel}`, ephemeral: true });
    }

    if (interaction.customId === 'confirm_close') {
        await interaction.reply('🔒 Cerrando ticket en 5 segundos...');
        setTimeout(async () => {
            try {
                await interaction.channel.delete();
            } catch (error) {
                console.error('Error al cerrar:', error);
            }
        }, 5000);
    }

    if (interaction.customId === 'cancel_close') {
        await interaction.reply({ content: '❌ Cierre cancelado.', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);