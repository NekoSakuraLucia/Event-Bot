const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

class EventBot {
    constructor() {
        this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
        this.commands = new Collection();
    }

    async init() {
        this.loadCommands();
        this.registerEvents();
        await this.client.login("TOKEN/BOT");
    }

    loadCommands() {
        const commandsPath = path.join(__dirname, "commands");
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            this.commands.set(command.data.name, command);
        }
    }

    registerEvents() {
        this.client.once("ready", async () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
            await this.registerSlashCommands();
        });

        this.client.on("interactionCreate", async (interaction) => {
            if (!interaction.isCommand()) return;

            const command = this.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: "มีข้อผิดพลาดเกิดขึ้น", ephemeral: true });
            }
        });
    }

    async registerSlashCommands() {
        if (!this.client.application?.commands) {
            console.error("Application Commands ไม่พร้อมใช้งาน")
            return;
        }

        try {
            const commands = this.commands.map(cmd => cmd.data.toJSON());
            await this.client.application.commands.set(commands);

            console.log(`Global Slash Commands Loaded`);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการลงทะเบียน Global Slash Commands:", error)
        }
    }
}

const bot = new EventBot();
bot.init().catch(console.error);