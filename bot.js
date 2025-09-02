const { Client, GatewayIntentBits } = require('discord.js');
const { status } = require('minecraft-server-util');

// Load from environment variables (Render style)
const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const SERVER_IP = process.env.SERVER_IP || "127.0.0.1";
const SERVER_PORT = process.env.SERVER_PORT || 25565;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

async function checkServer() {
    try {
        const result = await status(SERVER_IP, SERVER_PORT, { timeout: 5000 });
        return `✅ Server is ONLINE!  
🌐 IP: ${SERVER_IP}:${SERVER_PORT}  
👥 Players: ${result.players.online}/${result.players.max}  
⏱ Version: ${result.version.name}`;
    } catch {
        return `❌ Server is OFFLINE or unreachable.`;
    }
}

client.once("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const channel = await client.channels.fetch(CHANNEL_ID);

    // Send a starter message
    let statusMessage = await channel.send("⏱ Checking server status...");

    // Update it every 5 minutes
    setInterval(async () => {
        const message = await checkServer();
        await statusMessage.edit(message);
    }, 5 * 60 * 1000);
});

client.login(TOKEN);
