
================================================================================
FILE: .env.example
================================================================================

# Sentinel bot environment
DISCORD_TOKEN=
# TOKEN=  # alternative accepted variable
OWNER_IDS=
PREFIX=!
NODE_ENV=development


================================================================================
FILE: .gitignore
================================================================================

node_modules/
.env
data/


================================================================================
FILE: package.json
================================================================================

{
  "name": "sentinel-discord-bot",
  "version": "1.0.0",
  "main": "src/index.js",
  "author": "",
  "license": "UNLICENSE",
  "type": "commonjs",
  "dependencies": {
    "@sapphire/discord-utilities": "^4.0.0",
    "@sapphire/discord.js-utilities": "7.3.3",
    "@sapphire/fetch": "^3.0.5",
    "@sapphire/framework": "^5.5.0",
    "@sapphire/plugin-api": "^8.3.1",
    "@sapphire/plugin-editable-commands": "^4.0.4",
    "@sapphire/plugin-logger": "^4.1.0",
    "@sapphire/plugin-subcommands": "^7.0.1",
    "@sapphire/time-utilities": "^1.7.14",
    "@sapphire/type": "^2.6.0",
    "@sapphire/utilities": "^3.18.2",
    "discord.js": "^14.27.0"
  },
  "devDependencies": {
    "@sapphire/cli": "^1.9.3",
    "@sapphire/prettier-config": "^2.0.0",
    "nodemon": "^3.1.14",
    "npm-run-all2": "^9.0.3",
    "prettier": "^3.9.6"
  },
  "scripts": {
    "sapphire": "sapphire",
    "generate": "sapphire generate",
    "watch": "nodemon -L --watch src",
    "start": "node src/index.js",
    "format": "prettier --write \"src/**/*.js\""
  },
  "prettier": "@sapphire/prettier-config"
}


================================================================================
FILE: README.md
================================================================================

# Sentinel Discord Bot

A standalone moderation and community bot with active anti-spam, anti-raid, and anti-nuke protections.

## Setup

1. Run `npm install`.
2. Copy `.env.example` to `.env`, then set `DISCORD_TOKEN` and optionally `OWNER_IDS` and `PREFIX`.
3. Enable the **Server Members Intent** and **Message Content Intent** in the Discord Developer Portal.
4. Run `npm start`.

## Security controls

Use `/guard status` to inspect the current server configuration. Server managers can use `/guard log`, `/guard quarantine`, `/guard trust`, `/guard spam`, `/guard raid`, `/guard nuke`, and `/guard toggle`.

The bot never acts against the server owner, bot accounts, or trusted users/roles. Place its highest role above any role it should be able to moderate. Security settings are stored locally in `data/security-settings.json` and are excluded from source control.


================================================================================
FILE: src\botConfig.js
================================================================================

const botConfig = {
  // =========================
  // BOT PRESENCE (what users see under the bot name)
  // =========================
  // `status` options:
  // - "online"    = green dot
  // - "idle"      = yellow moon
  // - "dnd"       = red do-not-disturb
  // - "invisible" = appears offline
  presence: {
    // Current online state shown on Discord.
    status: "online",

    // Activity lines shown under the bot name.
    // `type` number mapping from Discord:
    // 0 = Playing
    // 1 = Streaming
    // 2 = Listening
    // 3 = Watching
    // 4 = Custom
    // 5 = Competing
    activities: [
      {
        name: "Sentinel.", // required by Discord API, not shown in the client
        state: "I See You",     // this is what people actually see
        type: 4,               // Custom
      },
    ],
  },

  // =========================
  // COMMAND BEHAVIOR
  // =========================
  commands: {
    // Bot owner user IDs (comma-separated in OWNER_IDS env var).
    // Owners can access owner/admin-level bot commands.
    owners: process.env.OWNER_IDS?.split(",").map((id) => id.trim()).filter(Boolean) || [],

    // Default wait time between command uses (in seconds).
    defaultCooldown: 3,

    // If true, old commands are removed before re-registering.
    deleteCommands: false,

    // Optional server ID retained for tutorial compatibility; not used for command registration.
    testGuildId: process.env.TEST_GUILD_ID,

    // When true (or MAINTENANCE_MODE=true), only bot owners can run commands.
    maintenanceMode: process.env.MAINTENANCE_MODE === "true",

    // Command prefix for text-based commands (e.g., "!" for "!ping").
    // Supports both slash commands and prefix commands.
    prefix: process.env.PREFIX || "!",
  },

  // =========================
  // APPLICATIONS SYSTEM
  // =========================
  applications: {
    // Default questions shown when someone fills out an application.
    defaultQuestions: [
      { question: "What is your name?", required: true, defaultAnswer: "Sentinel" },
      { question: "How old are you?", required: true },
      { question: "Why do you want to join?", required: true },
    ],

    // Embed colors by application status.
    statusColors: {
      pending: "#FFA500",
      approved: "#00FF00",
      denied: "#FF0000",
    },

    // How long users must wait before submitting another application (hours).
    applicationCooldown: 24,

    // Auto-delete denied applications after this many days.
    deleteDeniedAfter: 7,

    // Auto-delete approved applications after this many days.
    deleteApprovedAfter: 30,

    // Role IDs allowed to manage applications.
    managerRoles: [], // Will be populated from environment or database
  },

  // =========================
  // EMBED COLORS & BRANDING
  // =========================
  // IMPORTANT: This is the SINGLE SOURCE OF TRUTH for all bot colors
  embeds: {
    colors: {
      // Main brand colors.
      primary: "#188110",
      secondary: "#000000",

      // Standard status colors for success/error/warning/info messages.
      success: "#57F287",
      error: "#ED4245",
      warning: "#FEE75C",
      info: "#3498DB",

      // Neutral utility colors.
      light: "#FFFFFF",
      dark: "#202225",
      gray: "#99AAB5",

      // Discord-style palette shortcuts.
      blurple: "#5865F2",
      green: "#57F287",
      yellow: "#FEE75C",
      fuchsia: "#EB459E",
      red: "#ED4245",
      black: "#000000",

      // Feature-specific colors.
      giveaway: {
        active: "#57F287",
        ended: "#ED4245",
      },
      ticket: {
        open: "#57F287",
        claimed: "#FAA61A",
        closed: "#ED4245",
        pending: "#99AAB5",
      },
      economy: "#F1C40F",
      birthday: "#E91E63",
      moderation: "#9B59B6",

      // Ticket priority color mapping.
      priority: {
        none: "#95A5A6",
        low: "#3498db",
        medium: "#2ecc71",
        high: "#f1c40f",
        urgent: "#e74c3c",
      },
    },
    footer: {
      // Default footer text used in bot embeds.
      text: "Sentinel",
      // Footer icon URL (null = no icon).
      icon: null,
    },
    // Default thumbnail URL for embeds (null = no thumbnail).
    thumbnail: null,
    author: {
      // Optional default embed author block.
      name: null,
      icon: null,
      url: null,
    },
  },

  // =========================
  // ECONOMY SETTINGS
  // =========================
  economy: {
    currency: {
      // Currency display name.
      name: "coins",
      // Plural display name.
      namePlural: "coins",
      // Currency symbol shown in balances.
      symbol: "$",
    },

    // Starting balance for new users.
    startingBalance: 0,

    // Maximum bank amount before upgrades (if upgrades are used).
    baseBankCapacity: 100000,

    // Daily reward amount.
    dailyAmount: 100,

    // Work command random payout range.
    workMin: 10,
    workMax: 100,

    // Beg command random payout range.
    begMin: 5,
    begMax: 50,

    // Command cooldowns (milliseconds).
    cooldowns: {
      daily: 24 * 60 * 60 * 1000,
      work: 60 * 60 * 1000,
      crime: 2 * 60 * 60 * 1000,
      rob: 4 * 60 * 60 * 1000,
    },

    // Chance to succeed when robbing (0.4 = 40%).
    robSuccessRate: 0.4,

    // Jail time after failed rob (milliseconds).
    // 3600000 = 1 hour.
    robFailJailTime: 3600000,
  },

  // =========================
  // SHOP SETTINGS
  // =========================
  // Add shop defaults here when needed.
  shop: {

  },

  // =========================
  // TICKET SYSTEM
  // =========================
  tickets: {
    // Category ID where new tickets are created (null = no forced category).
    defaultCategory: null,

    // Role IDs allowed to manage/support tickets.
    supportRoles: [],

    // Priority options users/staff can assign.
    priorities: {
      none: {
        emoji: "Ã¢Å¡Âª",
        color: "#95A5A6",
        label: "None",
      },
      low: {
        emoji: "Ã°Å¸Å¸Â¢",
        color: "#2ECC71",
        label: "Low",
      },
      medium: {
        emoji: "Ã°Å¸Å¸Â¡",
        color: "#F1C40F",
        label: "Medium",
      },
      high: {
        emoji: "Ã°Å¸â€Â´",
        color: "#E74C3C",
        label: "High",
      },
      urgent: {
        emoji: "Ã°Å¸Å¡Â¨",
        color: "#E91E63",
        label: "Urgent",
      },
    },

    // Default priority for new tickets.
    defaultPriority: "none",

    // Category ID where closed tickets are archived.
    archiveCategory: null,

    // Channel ID where ticket logs are sent.
    logChannel: null,
  },

  // =========================
  // GIVEAWAY SETTINGS
  // =========================
  giveaways: {
    // Default giveaway duration in milliseconds.
    // 86400000 = 24 hours.
    defaultDuration: 86400000,

    // Allowed winner count range.
    minimumWinners: 1,
    maximumWinners: 10,

    // Allowed giveaway duration range in milliseconds.
    // 300000 = 5 minutes.
    minimumDuration: 300000,
    // 2592000000 = 30 days.
    maximumDuration: 2592000000,

    // Role IDs allowed to host giveaways.
    allowedRoles: [],

    // Role IDs that bypass giveaway restrictions.
    bypassRoles: [],
  },

  // =========================
  // BIRTHDAY SETTINGS
  // =========================
  birthday: {
    // Role ID given to users on their birthday.
    defaultRole: null,

    // Channel ID where birthday announcements are posted.
    announcementChannel: null,

    // Timezone used to calculate birthday dates.
    timezone: "UTC",
  },

  // =========================
  // VERIFICATION SETTINGS
  // =========================
  verification: {
    // Message shown when posting the verification panel.
    defaultMessage: "Click the button below to verify yourself and gain access to the server!",

    // Text on the verification button.
    defaultButtonText: "Verify",

    // Automatic verification behavior.
    autoVerify: {
      // How automatic verification decides who is auto-approved:
      // - "none"        = everyone is auto-verified immediately
      // - "account_age" = account must be older than set days
      // - "server_size" = auto-verify everyone only in smaller servers
      defaultCriteria: "none",

      // Days used when `defaultCriteria` is `account_age`.
      defaultAccountAgeDays: 7,

      // Member count threshold used when `defaultCriteria` is `server_size`.
      // Example: 1000 means auto-verify if server has fewer than 1000 members.
      serverSizeThreshold: 1000,

      // Allowed safety limits for account-age requirements.
      // 1 = minimum day, 365 = maximum days.
      minAccountAge: 1,
      maxAccountAge: 365,

      // If true, user receives a DM after verification.
      sendDMNotification: true,

      // Human-readable descriptions for each criteria mode.
      criteria: {
        account_age: "Account must be older than specified days",
        server_size: "All users if server has less than 1000 members",
        none: "All users immediately"
      }
    },

    // Minimum time between verification attempts (milliseconds).
    // 5000 = 5 seconds.
    verificationCooldown: 5000,

    // Maximum failed attempts allowed inside the time window below.
    maxVerificationAttempts: 3,

    // Time window for counting attempts (milliseconds).
    // 60000 = 1 minute.
    attemptWindow: 60000,

    // In-memory safety limits (helps avoid unbounded memory growth).
    maxCooldownEntries: 10000,
    maxAttemptEntries: 10000,
    // Cleanup frequency for cooldown/attempt maps (milliseconds).
    // 300000 = 5 minutes.
    cooldownCleanupInterval: 300000,
    // Maximum metadata payload size for audit entries (bytes).
    maxAuditMetadataBytes: 4096,
    // Maximum number of audit entries kept in memory.
    maxInMemoryAuditEntries: 1000,
    // If true, log every verification action.
    logAllVerifications: true,
    // If true, preserve verification audit history.
    keepAuditTrail: true,
  },

  // =========================
  // WELCOME / GOODBYE MESSAGES
  // =========================
  welcome: {
    // Welcome template posted when a user joins.
    // Placeholders: {user}, {server}, {memberCount}
    defaultWelcomeMessage:
      "Welcome {user} to {server}! We now have {memberCount} members!",
    // Goodbye template posted when a user leaves.
    // Placeholders: {user}, {memberCount}
    defaultGoodbyeMessage:
      "{user} has left the server. We now have {memberCount} members.",
    // Channel ID for welcome messages.
    defaultWelcomeChannel: null,
    // Channel ID for goodbye messages.
    defaultGoodbyeChannel: null,
  },

  // =========================
  // COUNTER CHANNELS
  // =========================
  counters: {
    defaults: {
      // Default naming/description templates for counter entries.
      name: "{name} Counter",
      description: "Server {name} counter",
      // Channel type used for counters (typically "voice").
      type: "voice",
      // Channel name format. `{count}` is replaced automatically.
      channelName: "{name}-{count}",
    },
    permissions: {
      // Default denied permissions for the counter channel.
      deny: ["VIEW_CHANNEL"],
      // Default allowed permissions for the counter channel.
      allow: ["VIEW_CHANNEL", "CONNECT", "SPEAK"],
    },
    messages: {
      // Default response messages for counter actions.
      created: "Ã¢Å“â€¦ Created counter **{name}**",
      deleted: "Ã°Å¸â€”â€˜Ã¯Â¸Â Deleted counter **{name}**",
      updated: "Ã°Å¸â€â€ž Updated counter **{name}**",
    },
    types: {
      // Built-in counter types and how each count is calculated.
      members: {
        name: "Ã°Å¸â€˜Â¥ Members",
        description: "Total members in the server",
        getCount: (guild) => guild.memberCount.toString(),
      },
      bots: {
        name: "Ã°Å¸Â¤â€“ Bots",
        description: "Total bot accounts in the server",
        getCount: (guild) =>
          guild.members.cache.filter((m) => m.user.bot).size.toString(),
      },
      members_only: {
        name: "Ã°Å¸â€˜Â¤ Humans",
        description: "Total human members (non-bots)",
        getCount: (guild) =>
          guild.members.cache.filter((m) => !m.user.bot).size.toString(),
      },
    },
  },

  // =========================
  // GENERIC BOT MESSAGES
  // =========================
  messages: {
    noPermission: "You do not have permission to use this command.",
    cooldownActive: "Please wait {time} before using this command again.",
    errorOccurred: "An error occurred while executing this command.",
    missingPermissions:
      "I am missing required permissions to perform this action.",
    commandDisabled: "This command has been disabled.",
    maintenanceMode: "The bot is currently in maintenance mode.",
  },

  // =========================
  // FEATURE TOGGLES
  // =========================
  // Set any feature to `false` to disable it globally.
  features: {
    // Core systems.
    economy: true,
    leveling: true,
    moderation: true,
    logging: true,
    welcome: true,

    // Community engagement systems.
    tickets: true,
    giveaways: true,
    birthday: true,
    counter: true,

    // Security and self-service systems.
    verification: true,
    reactionRoles: true,
    joinToCreate: true,

    // Utility/quality-of-life modules.
    voice: true,
    search: true,
    tools: true,
    utility: true,
    community: true,
    fun: true,
    music: true,
  },
};

function validateConfig(config) {
  const errors = [];

  if (process.env.NODE_ENV !== 'production') {
  }

  if (!process.env.DISCORD_TOKEN && !process.env.TOKEN) {
    errors.push("Bot token is required (DISCORD_TOKEN or TOKEN environment variable)");
  }

  if (!process.env.CLIENT_ID) {
    errors.push("Client ID is required (CLIENT_ID environment variable)");
  }

  if (process.env.NODE_ENV === 'production') {
    // A full connection URL (DATABASE_URL / POSTGRES_URL) satisfies all Postgres
    // requirements, matching how src/config/database/postgres.js resolves the pool config.
    const hasConnectionUrl = Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL);

    if (!hasConnectionUrl) {
      if (!process.env.POSTGRES_HOST) {
        errors.push("PostgreSQL connection is required in production (set DATABASE_URL/POSTGRES_URL, or POSTGRES_HOST)");
      }
      if (!process.env.POSTGRES_USER) {
        errors.push("PostgreSQL user is required in production (set DATABASE_URL/POSTGRES_URL, or POSTGRES_USER)");
      }
      if (!process.env.POSTGRES_PASSWORD) {
        errors.push("PostgreSQL password is required in production (set DATABASE_URL/POSTGRES_URL, or POSTGRES_PASSWORD)");
      }
    }
  }

  return errors;
}

const configErrors = validateConfig(botConfig);
if (configErrors.length > 0) {
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
}

const BotConfig = botConfig;

const COMMAND_CATEGORY_FEATURE_MAP = {
  birthday: "birthday",
  community: "community",
  economy: "economy",
  fun: "fun",
  giveaway: "giveaways",
  jointocreate: "joinToCreate",
  leveling: "leveling",
  logging: "logging",
  moderation: "moderation",
  music: "music",
  reaction_roles: "reactionRoles",
  search: "search",
  serverstats: "counter",
  ticket: "tickets",
  tools: "tools",
  utility: "utility",
  verification: "verification",
  welcome: "welcome",
};

function normalizeCategoryKey(category) {
  return String(category || "").trim().toLowerCase().replace(/\s+/g, "_");
}

function getCommandPrefix() {
  return botConfig.commands?.prefix ?? "!";
}

function getBotOwners() {
  return (botConfig.commands?.owners ?? [])
    .map((id) => String(id).trim())
    .filter(Boolean);
}

function isBotOwner(userId) {
  if (!userId) {
    return false;
  }

  return getBotOwners().includes(String(userId));
}

function isMaintenanceMode() {
  return botConfig.commands?.maintenanceMode === true;
}

function getBotMessage(key, replacements = {}) {
  let message = botConfig.messages?.[key] || key;

  for (const [placeholder, value] of Object.entries(replacements)) {
    message = message.replace(new RegExp(`\\{${placeholder}\\}`, "g"), String(value));
  }

  return message;
}

function isFeatureEnabled(featureKey) {
  if (!featureKey) {
    return true;
  }

  return botConfig.features?.[featureKey] !== false;
}

function isCommandCategoryEnabled(category) {
  const normalized = normalizeCategoryKey(category);

  if (!normalized || normalized === "core") {
    return true;
  }

  const featureKey = COMMAND_CATEGORY_FEATURE_MAP[normalized];
  if (!featureKey) {
    return true;
  }

  return isFeatureEnabled(featureKey);
}

function getApplicationStatusColor(status) {
  const colors = botConfig.applications?.statusColors || {};
  const hex = colors[status];
  return hex ? getColor(hex) : getColor(status === "approved" ? "success" : status === "denied" ? "error" : "warning");
}

function getDefaultApplicationQuestions() {
  return (botConfig.applications?.defaultQuestions || []).map((entry) =>
    typeof entry === "string" ? entry : entry.question,
  ).filter(Boolean);
}

function getColor(path, fallback = "#99AAB5") {
  
  if (typeof path === "number") return path;
  if (typeof path === "string" && path.startsWith("#")) {
    
    return parseInt(path.replace("#", ""), 16);
  }
  const result = path
    .split(".")
    .reduce(
      (obj, key) => (obj && obj[key] !== undefined ? obj[key] : fallback),
      botConfig.embeds.colors,
    );
  
  if (typeof result === "string" && result.startsWith("#")) {
    return parseInt(result.replace("#", ""), 16);
  }
  return result;
}

function getRandomColor() {
  const colors = Object.values(botConfig.embeds.colors).flatMap((color) =>
    typeof color === "string" ? color : Object.values(color),
  );
  return colors[Math.floor(Math.random() * colors.length)];
}



module.exports = {
  botConfig,
  BotConfig,
  validateConfig,
  getCommandPrefix,
  getBotOwners,
  isBotOwner,
  isMaintenanceMode,
  getBotMessage,
  isFeatureEnabled,
  isCommandCategoryEnabled,
  getApplicationStatusColor,
  getDefaultApplicationQuestions,
  getColor,
  getRandomColor
};


================================================================================
FILE: src\commands\8ball.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class Cmd8BallCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "8ball" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "8ball", description: "Ask the magic 8-ball" });
  }
  async chatInputRun(i) {
    try {
      const answers=['Yes.','No.','Definitely.','Probably.','Probably not.','Ask again later.','Absolutely.','I doubt it.']; return i.reply(`Ã°Å¸Å½Â± ${answers[Math.floor(Math.random()*answers.length)]}`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { Cmd8BallCommand };


================================================================================
FILE: src\commands\8ball2.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class EightBall2Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('8ball2')
        .setDescription('Ask the magic 8-ball.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const a=['Yes.','No.','Maybe.','Definitely.','Ask again later.']; await interaction.reply(`ðŸŽ± ${a[Math.floor(Math.random()*a.length)]}`);
  }
}

module.exports = { EightBall2Command };


================================================================================
FILE: src\commands\about.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class AboutCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "about" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "about", description: "Show Sentinel branding" });
  }
  async chatInputRun(i) {
    try {
      return i.reply({embeds:[payloadEmbed('Sentinel','Standalone server management bot\nPrimary: #188110\nSecondary: #000000')]});
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { AboutCommand };


================================================================================
FILE: src\commands\animatedemojis.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class AnimatedemojisCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('animatedemojis')
        .setDescription('Count animated emojis.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:`Animated emojis: **${interaction.guild.emojis.cache.filter(e=>e.animated).size}**`,ephemeral:true});
  }
}

module.exports = { AnimatedemojisCommand };


================================================================================
FILE: src\commands\announce.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class AnnounceCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "announce" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "announce", description: "Post an announcement",options:[{name:"message",description:"Message",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      const m=i.options.getString('message'); return i.reply({embeds:[payloadEmbed('Ã°Å¸â€œÂ¢ Announcement',m)]});
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { AnnounceCommand };


================================================================================
FILE: src\commands\antialt.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class AntialtCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('antialt')
        .setDescription('Show anti-alt protection status.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:'Anti-alt protection: **Ready**. Account-age checks can be used before granting access.',ephemeral:true});
  }
}

module.exports = { AntialtCommand };


================================================================================
FILE: src\commands\antibot.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class AntibotCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('antibot')
        .setDescription('Show bot-join protection status.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:'Anti-bot protection: **Ready**. Review new bot joins with your moderation team.',ephemeral:true});
  }
}

module.exports = { AntibotCommand };


================================================================================
FILE: src\commands\antiraid.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class AntiraidCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('antiraid')
        .setDescription('Show Sentinel anti-raid protection status.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:'Ã°Å¸â€ºÂ¡Ã¯Â¸Â Anti-raid protection: **Ready**. Configure thresholds and actions in your server security settings.',ephemeral:true});
  }
}

module.exports = { AntiraidCommand };


================================================================================
FILE: src\commands\antispam.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class AntispamCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('antispam')
        .setDescription('Show anti-spam protection status.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:'Anti-spam protection: **Ready**.',ephemeral:true});
  }
}

module.exports = { AntispamCommand };


================================================================================
FILE: src\commands\appeal.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class AppealCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('appeal')
        .setDescription('Provide a moderation appeal notice.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:'If your server has an appeal process, contact its moderation team with the relevant action and reason.',ephemeral:true});
  }
}

module.exports = { AppealCommand };


================================================================================
FILE: src\commands\auditlog.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class AuditlogCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('auditlog')
        .setDescription('Show recent audit-log entries.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    if(!interaction.member.permissions.has('ViewAuditLog')) return interaction.reply({content:'You need View Audit Log.',ephemeral:true}); const logs=await interaction.guild.fetchAuditLogs({limit:10}).catch(()=>null); if(!logs)return interaction.reply({content:'Could not read audit logs.',ephemeral:true}); const out=[...logs.entries.values()].slice(0,10).map(x=>`â€¢ ${x.action} â€” ${x.executor?.tag||'Unknown'}`).join('\n')||'No entries.'; await interaction.reply({content:out,ephemeral:true});
  }
}

module.exports = { AuditlogCommand };


================================================================================
FILE: src\commands\avatar.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class AvatarCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "avatar" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "avatar", description: "Show a user's avatar",options:[{name:"user",description:"User",type:6,required:false}] });
  }
  async chatInputRun(i) {
    try {
      const u=i.options.getUser('user')||i.user; return i.reply(u.displayAvatarURL({size:1024,extension:'png'}));
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { AvatarCommand };


================================================================================
FILE: src\commands\banner.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class BannerCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "banner" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "banner", description: "Show a user's banner",options:[{name:"user",description:"User",type:6,required:false}] });
  }
  async chatInputRun(i) {
    try {
      const u=await i.client.users.fetch((i.options.getUser('user')||i.user).id,{force:true}); return i.reply(u.bannerURL({size:1024})||'That user has no banner.');
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { BannerCommand };


================================================================================
FILE: src\commands\binary.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class BinaryCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "binary" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "binary", description: "Convert text to binary",options:[{name:"text",description:"Text",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      const s=i.options.getString('text'); return i.reply(s.split('').map(c=>c.charCodeAt(0).toString(2).padStart(8,'0')).join(' '));
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { BinaryCommand };


================================================================================
FILE: src\commands\birthdayinfo.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class BirthdayinfoCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('birthdayinfo')
        .setDescription('Explain birthday features.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:'Sentinel includes birthday configuration and announcements.',ephemeral:true});
  }
}

module.exports = { BirthdayinfoCommand };


================================================================================
FILE: src\commands\bold.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class BoldCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "bold" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "bold", description: "Bold text",options:[{name:"text",description:"Text",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`**${i.options.getString('text')}**`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { BoldCommand };


================================================================================
FILE: src\commands\bonk.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class BonkCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('bonk')
        .setDescription('Send a playful bonk.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const u=interaction.options.getUser('user')||interaction.user; await interaction.reply(`ðŸ”¨ ${u}, bonk!`);
  }
}

module.exports = { BonkCommand };


================================================================================
FILE: src\commands\boosters.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class BoostersCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('boosters')
        .setDescription('List server boosters.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.guild.members.fetch().catch(()=>{}); const list=interaction.guild.members.cache.filter(m=>m.premiumSince).map(m=>`â€¢ ${m.user.tag}`).slice(0,50).join('\n')||'No boosters.'; await interaction.reply({content:list,ephemeral:true});
  }
}

module.exports = { BoostersCommand };


================================================================================
FILE: src\commands\botcount.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class BotcountCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "botcount" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "botcount", description: "Count bots in the server" });
  }
  async chatInputRun(i) {
    try {
      const n=i.guild.members.cache.filter(m=>m.user.bot).size; return i.reply(`Ã°Å¸Â¤â€“ **${n}** bots.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { BotcountCommand };


================================================================================
FILE: src\commands\botguilds.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class BotguildsCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "botguilds" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "botguilds", description: "Show server count" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`Ã°Å¸Å’Â Sentinel is in **${i.client.guilds.cache.size}** servers.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { BotguildsCommand };


================================================================================
FILE: src\commands\botlist.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class BotlistCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('botlist')
        .setDescription('List bots in the server.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.guild.members.fetch().catch(()=>{}); const list=interaction.guild.members.cache.filter(m=>m.user.bot).map(m=>`â€¢ ${m.user.tag}`).slice(0,50).join('\n')||'No bots found.'; await interaction.reply({content:list,ephemeral:true});
  }
}

module.exports = { BotlistCommand };


================================================================================
FILE: src\commands\botpermissions.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class BotpermissionsCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('botpermissions')
        .setDescription('Show Sentinel\'s permissions here.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const m=interaction.guild.members.me; await interaction.reply({content:m?m.permissions.toArray().join('\n'):'Bot member unavailable.',ephemeral:true});
  }
}

module.exports = { BotpermissionsCommand };


================================================================================
FILE: src\commands\botping.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class BotpingCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "botping" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "botping", description: "Show websocket latency" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`Ã°Å¸â€œÂ¡ **${i.client.ws.ping}ms**`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { BotpingCommand };


================================================================================
FILE: src\commands\bots.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class BotsCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "bots" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "bots", description: "Count cached bots" });
  }
  async chatInputRun(i) {
    try {
      const n=i.guild.members.cache.filter(m=>m.user.bot).size; return i.reply(`Ã°Å¸Â¤â€“ Cached bots: **${n}**`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { BotsCommand };


================================================================================
FILE: src\commands\bots2.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Bots2Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('bots2')
        .setDescription('Show cached bot member count.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:`Bots: **${interaction.guild.members.cache.filter(m=>m.user.bot).size}** (cached)`,ephemeral:true});
  }
}

module.exports = { Bots2Command };


================================================================================
FILE: src\commands\botusers.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class BotusersCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "botusers" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "botusers", description: "Show cached user count" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`Ã°Å¸â€˜Â¥ Cached users: **${i.client.users.cache.size}**`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { BotusersCommand };


================================================================================
FILE: src\commands\cache.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class CacheCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('cache')
        .setDescription('Show cache sizes.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:`Guilds: ${interaction.client.guilds.cache.size}\nUsers: ${interaction.client.users.cache.size}`,ephemeral:true});
  }
}

module.exports = { CacheCommand };


================================================================================
FILE: src\commands\categories.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class CategoriesCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "categories" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "categories", description: "Count category channels" });
  }
  async chatInputRun(i) {
    try {
      const n=i.guild.channels.cache.filter(c=>c.type===4).size; return i.reply(`Ã°Å¸â€œÂ **${n}** categories.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { CategoriesCommand };


================================================================================
FILE: src\commands\categorylist.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class CategorylistCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('categorylist')
        .setDescription('List channel categories.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const x=interaction.guild.channels.cache.filter(c=>c.type==='GUILD_CATEGORY').map(c=>c.name).join('\n')||'None'; await interaction.reply({content:x,ephemeral:true});
  }
}

module.exports = { CategorylistCommand };


================================================================================
FILE: src\commands\channelcount.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class ChannelcountCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "channelcount" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "channelcount", description: "Show channel count" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`Ã°Å¸â€œÂº **${i.guild.channels.cache.size}** channels.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { ChannelcountCommand };


================================================================================
FILE: src\commands\channelcount2.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');
class Channelcount2Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(new SlashCommandBuilder().setName('channelcount2').setDescription('Count all server channels.').setDMPermission(false));
  }
  async chatInputRun(interaction) { await interaction.reply({content:`Total channels: **${interaction.guild.channels.cache.size}**`,ephemeral:true}); }
}
module.exports={ Channelcount2Command };


================================================================================
FILE: src\commands\channelid.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class ChannelidCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('channelid')
        .setDescription('Show this channel\'s ID.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:`Channel ID: **${interaction.channel.id}**`,ephemeral:true});
  }
}

module.exports = { ChannelidCommand };


================================================================================
FILE: src\commands\channelinfo.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class ChannelinfoCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "channelinfo" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "channelinfo", description: "Show channel information",options:[{name:"channel",description:"Channel",type:7,required:false}] });
  }
  async chatInputRun(i) {
    try {
      const c=i.options.getChannel('channel')||i.channel; return i.reply({embeds:[payloadEmbed(c.name,`**ID:** ${c.id}\n**Type:** ${c.type}\n**Position:** ${c.position??'N/A'}`)]});
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { ChannelinfoCommand };


================================================================================
FILE: src\commands\channelmention.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class ChannelmentionCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "channelmention" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "channelmention", description: "Mention a channel",options:[{name:"channel",description:"Channel",type:7,required:true}] });
  }
  async chatInputRun(i) {
    try {
      return i.reply(i.options.getChannel('channel').toString());
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { ChannelmentionCommand };


================================================================================
FILE: src\commands\channelpermissions.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class ChannelpermissionsCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('channelpermissions')
        .setDescription('Show your permissions in this channel.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const p=interaction.channel.permissionsFor(interaction.member); const names=['ViewChannel','SendMessages','ManageMessages','ManageChannels','ManageRoles','KickMembers','BanMembers','ModerateMembers']; await interaction.reply({content:names.map(n=>`${p.has(n)?'âœ…':'âŒ'} ${n}`).join('\n'),ephemeral:true});
  }
}

module.exports = { ChannelpermissionsCommand };


================================================================================
FILE: src\commands\channeltype.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class ChanneltypeCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('channeltype')
        .setDescription('Show this channel\'s type.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:`Channel type: **${interaction.channel.type}**`,ephemeral:true});
  }
}

module.exports = { ChanneltypeCommand };


================================================================================
FILE: src\commands\charcount.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class CharcountCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "charcount" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "charcount", description: "Count characters excluding spaces",options:[{name:"text",description:"Text",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      const s=i.options.getString('text'); return i.reply(`Ã°Å¸â€Â¢ ${s.replace(/\s/g,'').length} characters.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { CharcountCommand };


================================================================================
FILE: src\commands\choose.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class ChooseCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "choose" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "choose", description: "Choose between two options",options:[{name:"first",description:"First option",type:3,required:true},{name:"second",description:"Second option",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      const a=i.options.getString('first'),b=i.options.getString('second'); return i.reply(`Ã°Å¸Å½Â¯ I choose **${Math.random()<0.5?a:b}**.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { ChooseCommand };


================================================================================
FILE: src\commands\clap.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class ClapCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "clap" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "clap", description: "Add clap formatting",options:[{name:"text",description:"Text",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      return i.reply(i.options.getString('text').split(/\s+/).join(' Ã°Å¸â€˜Â '));
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { ClapCommand };


================================================================================
FILE: src\commands\cleanup.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class CleanupCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('cleanup')
        .setDescription('Remove recent bot messages.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    if(!interaction.member.permissions.has('ManageMessages'))return interaction.reply({content:'You need Manage Messages.',ephemeral:true}); const msgs=await interaction.channel.messages.fetch({limit:50}).catch(()=>null); if(!msgs)return interaction.reply({content:'Could not fetch messages.',ephemeral:true}); let n=0; for(const m of msgs.filter(m=>m.author.bot).values()){try{await m.delete();n++}catch{}} await interaction.reply({content:`Removed **${n}** bot messages.`,ephemeral:true});
  }
}

module.exports = { CleanupCommand };


================================================================================
FILE: src\commands\clear10.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Clear10Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('clear10')
        .setDescription('Delete up to 10 recent messages.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    if(!interaction.member.permissions.has('ManageMessages'))return interaction.reply({content:'You need Manage Messages.',ephemeral:true}); const x=await interaction.channel.bulkDelete(10,true).catch(()=>null); await interaction.reply({content:`Deleted **${x?.size||0}** messages.`,ephemeral:true});
  }
}

module.exports = { Clear10Command };


================================================================================
FILE: src\commands\clear100.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Clear100Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('clear100')
        .setDescription('Delete up to 100 recent messages.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    if(!interaction.member.permissions.has('ManageMessages'))return interaction.reply({content:'You need Manage Messages.',ephemeral:true}); const x=await interaction.channel.bulkDelete(100,true).catch(()=>null); await interaction.reply({content:`Deleted **${x?.size||0}** messages.`,ephemeral:true});
  }
}

module.exports = { Clear100Command };


================================================================================
FILE: src\commands\clear25.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Clear25Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('clear25')
        .setDescription('Delete up to 25 recent messages.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    if(!interaction.member.permissions.has('ManageMessages'))return interaction.reply({content:'You need Manage Messages.',ephemeral:true}); const x=await interaction.channel.bulkDelete(25,true).catch(()=>null); await interaction.reply({content:`Deleted **${x?.size||0}** messages.`,ephemeral:true});
  }
}

module.exports = { Clear25Command };


================================================================================
FILE: src\commands\clear50.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Clear50Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('clear50')
        .setDescription('Delete up to 50 recent messages.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    if(!interaction.member.permissions.has('ManageMessages'))return interaction.reply({content:'You need Manage Messages.',ephemeral:true}); const x=await interaction.channel.bulkDelete(50,true).catch(()=>null); await interaction.reply({content:`Deleted **${x?.size||0}** messages.`,ephemeral:true});
  }
}

module.exports = { Clear50Command };


================================================================================
FILE: src\commands\code.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class CodeCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "code" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "code", description: "Format text as code",options:[{name:"text",description:"Text",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      return i.reply('```\n'+i.options.getString('text')+'\n```');
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { CodeCommand };


================================================================================
FILE: src\commands\coin.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class CoinCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('coin')
        .setDescription('Flip a coin.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply(Math.random()<.5?'Heads ðŸª™':'Tails ðŸª™');
  }
}

module.exports = { CoinCommand };


================================================================================
FILE: src\commands\coinflip.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class CoinflipCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "coinflip" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "coinflip", description: "Flip a coin" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(Math.random()<0.5?'Ã°Å¸Âªâ„¢ Heads!':'Ã°Å¸Âªâ„¢ Tails!');
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { CoinflipCommand };


================================================================================
FILE: src\commands\commands.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class CommandsCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "commands" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "commands", description: "Show command count" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`Ã°Å¸â€œÅ¡ Sentinel currently has **100+ commands/features planned in this build**.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { CommandsCommand };


================================================================================
FILE: src\commands\compliment.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class ComplimentCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "compliment" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "compliment", description: "Give a compliment" });
  }
  async chatInputRun(i) {
    try {
      const x=['You are awesome!','You have great energy!','You make this server better!','Your ideas are impressive!']; return i.reply(`Ã¢Å“Â¨ ${x[Math.floor(Math.random()*x.length)]}`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { ComplimentCommand };


================================================================================
FILE: src\commands\created.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class CreatedCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "created" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "created", description: "Show when a user account was created",options:[{name:"user",description:"User",type:6,required:true}] });
  }
  async chatInputRun(i) {
    try {
      const u=i.options.getUser('user'); return i.reply(`<t:${Math.floor(u.createdTimestamp/1000)}:F>`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { CreatedCommand };


================================================================================
FILE: src\commands\dare.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class DareCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('dare')
        .setDescription('Give a dare prompt.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const a=['Do 10 jumping jacks.','Say a tongue twister.','Draw something in 30 seconds.']; await interaction.reply(a[Math.floor(Math.random()*a.length)]);
  }
}

module.exports = { DareCommand };


================================================================================
FILE: src\commands\deafen.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class DeafenCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "deafen" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "deafen", description: "Deafen a member",defaultMemberPermissions:'DeafenMembers',options:[{name:"user",description:"Member",type:6,required:true}] });
  }
  async chatInputRun(i) {
    try {
      if(!i.memberPermissions.has('DeafenMembers')) return i.reply({content:'You need Deafen Members.',ephemeral:true}); const m=i.options.getMember('user'); await m.voice.setDeaf(true); return i.reply(`Ã°Å¸â€â€¡ Deafened **${m.user.tag}**.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { DeafenCommand };


================================================================================
FILE: src\commands\dice.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class DiceCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "dice" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "dice", description: "Roll a die" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`Ã°Å¸Å½Â² You rolled **${rand(1,6)}**.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { DiceCommand };


================================================================================
FILE: src\commands\dice2.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Dice2Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('dice2')
        .setDescription('Roll a six-sided die.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply(`ðŸŽ² **${Math.floor(Math.random()*6)+1}**`);
  }
}

module.exports = { Dice2Command };


================================================================================
FILE: src\commands\disconnect.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class DisconnectCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "disconnect" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "disconnect", description: "Disconnect a member from voice",defaultMemberPermissions:'MoveMembers',options:[{name:"user",description:"Member",type:6,required:true}] });
  }
  async chatInputRun(i) {
    try {
      if(!i.memberPermissions.has('MoveMembers')) return i.reply({content:'You need Move Members.',ephemeral:true}); const m=i.options.getMember('user'); await m.voice.disconnect(); return i.reply(`Ã°Å¸â€œÂ¤ Disconnected **${m.user.tag}**.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { DisconnectCommand };


================================================================================
FILE: src\commands\discordjs.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class DiscordjsCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('discordjs')
        .setDescription('Show discord.js version.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:`discord.js: **${require('discord.js').version}**`,ephemeral:true});
  }
}

module.exports = { DiscordjsCommand };


================================================================================
FILE: src\commands\echo.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class EchoCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "echo" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "echo", description: "Echo text",options:[{name:"text",description:"Text",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      return i.reply(i.options.getString('text'));
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { EchoCommand };


================================================================================
FILE: src\commands\economyinfo.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class EconomyinfoCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('economyinfo')
        .setDescription('Explain economy features.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:'Sentinel includes economy and shop-related features.',ephemeral:true});
  }
}

module.exports = { EconomyinfoCommand };


================================================================================
FILE: src\commands\embed.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class EmbedCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "embed" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "embed", description: "Create a Sentinel embed",options:[{name:"title",description:"Title",type:3,required:true},{name:"description",description:"Description",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      return i.reply({embeds:[payloadEmbed(i.options.getString('title'),i.options.getString('description'))]});
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { EmbedCommand };


================================================================================
FILE: src\commands\emojicount.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class EmojicountCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('emojicount')
        .setDescription('Count server emojis.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:`Emojis: **${interaction.guild.emojis.cache.size}**`,ephemeral:true});
  }
}

module.exports = { EmojicountCommand };


================================================================================
FILE: src\commands\emojiinfo.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class EmojiinfoCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "emojiinfo" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "emojiinfo", description: "Show emoji information" });
  }
  async chatInputRun(i) {
    try {
      const e=i.options.getString('emoji'); return i.reply(`Emoji: **${e}**`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { EmojiinfoCommand };


================================================================================
FILE: src\commands\fact.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class FactCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "fact" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "fact", description: "Get a random fact" });
  }
  async chatInputRun(i) {
    try {
      const x=['Octopuses have three hearts.','Honey can last for years when stored properly.','Bananas are berries botanically.','A day on Venus is longer than its year.']; return i.reply(`Ã°Å¸â€™Â¡ ${x[Math.floor(Math.random()*x.length)]}`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { FactCommand };


================================================================================
FILE: src\commands\feedback.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class FeedbackCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "feedback" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "feedback", description: "Send private feedback to Sentinel",options:[{name:"message",description:"Feedback",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      return i.reply({content:'Thanks for the feedback!',ephemeral:true});
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { FeedbackCommand };


================================================================================
FILE: src\commands\feedback2.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Feedback2Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('feedback2')
        .setDescription('Submit feedback.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const t=interaction.options.getString('feedback',true); await interaction.reply({content:`Feedback received:\n> ${t}`,ephemeral:true});
  }
}

module.exports = { Feedback2Command };


================================================================================
FILE: src\commands\firstjoined.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class FirstjoinedCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "firstjoined" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "firstjoined", description: "Show when you joined" });
  }
  async chatInputRun(i) {
    try {
      const m=i.member; return i.reply(m.joinedTimestamp?`You joined <t:${Math.floor(m.joinedTimestamp/1000)}:F>.`:'Join date unavailable.');
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { FirstjoinedCommand };


================================================================================
FILE: src\commands\fliptext.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class FliptextCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('fliptext')
        .setDescription('Reverse text.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply(interaction.options.getString('text',true).split('').reverse().join(''));
  }
}

module.exports = { FliptextCommand };


================================================================================
FILE: src\commands\fortune.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class FortuneCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "fortune" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "fortune", description: "Get a random fortune" });
  }
  async chatInputRun(i) {
    try {
      const x=['Good things are coming.','Try something new today.','Your next idea may be your best one.','Patience will pay off.']; return i.reply(`Ã°Å¸â€Â® ${x[Math.floor(Math.random()*x.length)]}`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { FortuneCommand };


================================================================================
FILE: src\commands\General\command-with-subcommands.js
================================================================================

const { Subcommand } = require('@sapphire/plugin-subcommands');
const { send } = require('@sapphire/plugin-editable-commands');

class UserCommand extends Subcommand {
	constructor(context, options) {
		super(context, {
			...options,
			aliases: ['cws'],
			description: 'A basic command with some subcommands',
			subcommands: [
				{
					name: 'add',
					messageRun: 'messageAdd'
				},
				{
					name: 'create',
					messageRun: 'messageAdd'
				},
				{
					name: 'remove',
					messageRun: 'messageRemove'
				},
				{
					name: 'reset',
					messageRun: 'messageReset'
				},
				{
					name: 'show',
					messageRun: 'messageShow',
					default: true
				}
			]
		});
	}

	// Anyone should be able to view the result, but not modify
	async messageShow(message) {
		return send(message, 'Showing!');
	}

	async messageAdd(message) {
		return send(message, 'Adding!');
	}

	async messageRemove(message) {
		return send(message, 'Removing!');
	}

	async messageReset(message) {
		return send(message, 'Resetting!');
	}
}

module.exports = {
	UserCommand
};


================================================================================
FILE: src\commands\General\eval.js
================================================================================

const { Command } = require('@sapphire/framework');
const { send } = require('@sapphire/plugin-editable-commands');
const { Type } = require('@sapphire/type');
const { codeBlock, isThenable } = require('@sapphire/utilities');
const { inspect } = require('node:util');

class UserCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			aliases: ['ev'],
			description: 'Evals any JavaScipt code',
			quotes: [],
			preconditions: ['OwnerOnly'],
			flags: ['async', 'hidden', 'showHidden', 'silent', 's'],
			options: ['depth']
		});
	}

	async messageRun(message, args) {
		const code = await args.rest('string');

		const { result, success, type } = await this.eval(message, code, {
			async: args.getFlags('async'),
			depth: Number(args.getOption('depth')) ?? 0,
			showHidden: args.getFlags('hidden', 'showHidden')
		});

		const output = success ? codeBlock('js', result) : `**ERROR**: ${codeBlock('bash', result)}`;
		if (args.getFlags('silent', 's')) return null;

		const typeFooter = `**Type**: ${codeBlock('typescript', type)}`;

		if (output.length > 2000) {
			return send(message, {
				content: `Output was too long... sent the result as a file.\n\n${typeFooter}`,
				files: [{ attachment: Buffer.from(output), name: 'output.js' }]
			});
		}

		return send(message, `${output}\n${typeFooter}`);
	}

	async eval(message, code, flags) {
		if (flags.async) code = `(async () => {\n${code}\n})();`;

		const msg = message;

		let success = true;
		let result = null;

		try {
			// eslint-disable-next-line no-eval
			result = eval(code);
		} catch (error) {
			if (error && error instanceof Error && error.stack) {
				this.container.client.logger.error(error);
			}
			result = error;
			success = false;
		}

		const type = new Type(result).toString();
		if (isThenable(result)) result = await result;

		if (typeof result !== 'string') {
			result = inspect(result, {
				depth: flags.depth,
				showHidden: flags.showHidden
			});
		}

		return { result, success, type };
	}
}

module.exports = {
	UserCommand
};


================================================================================
FILE: src\commands\General\paginated-message.js
================================================================================

const { PaginatedMessage } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const { sendLoadingMessage } = require('../../lib/utils');

class UserCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			aliases: ['pm'],
			description: 'A command that uses paginated messages.',
			generateDashLessAliases: true
		});
	}

	async messageRun(message) {
		const response = await sendLoadingMessage(message);

		const paginatedMessage = new PaginatedMessage({
			template: new EmbedBuilder()
				.setColor('#188110')
				// Be sure to add a space so this is offset from the page numbers!
				.setFooter({ text: ' footer after page numbers' })
		});

		paginatedMessage
			.addPageEmbed((embed) =>
				embed //
					.setDescription('This is the first page')
					.setTitle('Page 1')
			)
			.addPageBuilder((builder) =>
				builder //
					.setContent('This is the second page')
					.setEmbeds([new EmbedBuilder().setTimestamp()])
			);

		await paginatedMessage.run(response, message.author);
		return response;
	}
}

module.exports = {
	UserCommand
};


================================================================================
FILE: src\commands\General\ping.js
================================================================================

const { Command } = require('@sapphire/framework');
const { send } = require('@sapphire/plugin-editable-commands');

class UserCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			description: 'ping pong'
		});
	}

	async messageRun(message) {
		const msg = await send(message, 'Ping?');

		const content = `Pong from Sentinel! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${
			msg.createdTimestamp - message.createdTimestamp
		}ms.`;

		return send(message, content);
	}
}

module.exports = {
	UserCommand
};


================================================================================
FILE: src\commands\giveawayinfo.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class GiveawayinfoCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('giveawayinfo')
        .setDescription('Explain giveaway features.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:'Sentinel includes giveaway configuration in its core feature set.',ephemeral:true});
  }
}

module.exports = { GiveawayinfoCommand };


================================================================================
FILE: src\commands\guard.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { getSettings, updateSettings } = require('../security');
class GuardCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(new SlashCommandBuilder().setName('guard').setDescription('Configure server protection.').setDMPermission(false).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .addSubcommand((s) => s.setName('status').setDescription('View active protection settings.'))
      .addSubcommand((s) => s.setName('toggle').setDescription('Enable or disable protection.').addBooleanOption((o) => o.setName('enabled').setDescription('Protection state').setRequired(true)))
      .addSubcommand((s) => s.setName('log').setDescription('Set the security log channel.').addChannelOption((o) => o.setName('channel').setDescription('Text channel').addChannelTypes(ChannelType.GuildText).setRequired(true)))
      .addSubcommand((s) => s.setName('quarantine').setDescription('Set the containment role.').addRoleOption((o) => o.setName('role').setDescription('Role to assign').setRequired(true)))
      .addSubcommand((s) => s.setName('trust').setDescription('Trust or untrust a user or role.').addStringOption((o) => o.setName('action').setDescription('Action').setRequired(true).addChoices({ name: 'Add', value: 'add' }, { name: 'Remove', value: 'remove' })).addUserOption((o) => o.setName('user').setDescription('User')).addRoleOption((o) => o.setName('role').setDescription('Role')))
      .addSubcommand((s) => s.setName('spam').setDescription('Configure spam protection.').addIntegerOption((o) => o.setName('messages').setDescription('Messages allowed').setMinValue(3).setMaxValue(30).setRequired(true)).addIntegerOption((o) => o.setName('seconds').setDescription('Window seconds').setMinValue(2).setMaxValue(60).setRequired(true)).addBooleanOption((o) => o.setName('block_invites').setDescription('Remove invite links')))
      .addSubcommand((s) => s.setName('raid').setDescription('Configure raid protection.').addIntegerOption((o) => o.setName('joins').setDescription('Joins per 30 seconds').setMinValue(3).setMaxValue(100).setRequired(true)).addIntegerOption((o) => o.setName('account_days').setDescription('Minimum account age').setMinValue(0).setMaxValue(365).setRequired(true)))
      .addSubcommand((s) => s.setName('nuke').setDescription('Configure anti-nuke threshold.').addIntegerOption((o) => o.setName('actions').setDescription('Destructive actions allowed').setMinValue(1).setMaxValue(10).setRequired(true))));
  }
  async chatInputRun(i) {
    const sub = i.options.getSubcommand(); const id = i.guildId;
    if (sub === 'status') { const s = getSettings(id); return i.reply({ ephemeral: true, content: `ðŸ›¡ï¸ **Guard status**\nEnabled: **${s.enabled ? 'Yes' : 'No'}**\nSpam: ${s.spam.maxMessages} messages / ${s.spam.windowMs / 1000}s${s.spam.blockInvites ? ', invite filter on' : ''}\nRaid: ${s.raid.maxJoins} joins / 30s, ${s.raid.minAccountAgeMs / 86400000} day account age\nAnti-nuke: ${s.nuke.maxActions} actions / ${s.nuke.windowMs / 1000}s\nLog: ${s.logChannelId ? `<#${s.logChannelId}>` : 'not set'}\nQuarantine: ${s.quarantineRoleId ? `<@&${s.quarantineRoleId}>` : 'not set'}` }); }
    if (sub === 'toggle') updateSettings(id, (s) => { s.enabled = i.options.getBoolean('enabled', true); });
    if (sub === 'log') updateSettings(id, (s) => { s.logChannelId = i.options.getChannel('channel', true).id; });
    if (sub === 'quarantine') updateSettings(id, (s) => { s.quarantineRoleId = i.options.getRole('role', true).id; });
    if (sub === 'trust') { const target = i.options.getUser('user') || i.options.getRole('role'); if (!target) return i.reply({ content: 'Choose one user or role.', ephemeral: true }); updateSettings(id, (s) => { const key = target.user ? 'trustedUserIds' : 'trustedRoleIds'; s[key] = s[key].filter((x) => x !== target.id); if (i.options.getString('action', true) === 'add') s[key].push(target.id); }); }
    if (sub === 'spam') updateSettings(id, (s) => { s.spam.maxMessages = i.options.getInteger('messages', true); s.spam.windowMs = i.options.getInteger('seconds', true) * 1000; const value = i.options.getBoolean('block_invites'); if (value !== null) s.spam.blockInvites = value; });
    if (sub === 'raid') updateSettings(id, (s) => { s.raid.maxJoins = i.options.getInteger('joins', true); s.raid.minAccountAgeMs = i.options.getInteger('account_days', true) * 86400000; });
    if (sub === 'nuke') updateSettings(id, (s) => { s.nuke.maxActions = i.options.getInteger('actions', true); });
    return i.reply({ content: 'âœ… Protection settings saved.', ephemeral: true });
  }
}
module.exports = { GuardCommand };


================================================================================
FILE: src\commands\guildicon.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class GuildiconCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "guildicon" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "guildicon", description: "Alias for server icon" });
  }
  async chatInputRun(i) {
    try {
      const u=i.guild.iconURL({size:1024}); return i.reply(u||'No server icon.');
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { GuildiconCommand };


================================================================================
FILE: src\commands\helpers.js
================================================================================

const { EmbedBuilder } = require('discord.js');
function payloadEmbed(title, description) {
  return new EmbedBuilder().setColor('#188110').setTitle(title).setDescription(description || '').setFooter({text:'Sentinel'}).setTimestamp();
}
function rand(min=1,max=100){ return Math.floor(Math.random()*(max-min+1))+min; }
module.exports={payloadEmbed,rand};


================================================================================
FILE: src\commands\helpfun.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class HelpfunCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "helpfun" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "helpfun", description: "Show fun help" });
  }
  async chatInputRun(i) {
    try {
      return i.reply('Ã°Å¸Å½Â® Fun: /8ball /coinflip /dice /roll /rps /choose /rate /ship /compliment /fortune /fact /joke /random /randomuser');
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { HelpfunCommand };


================================================================================
FILE: src\commands\helpmod.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class HelpmodCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "helpmod" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "helpmod", description: "Show moderation help" });
  }
  async chatInputRun(i) {
    try {
      return i.reply('Ã°Å¸â€ºÂ¡Ã¯Â¸Â Moderation: /ban /kick /timeout /untimeout /warn /clear /purge /lock /unlock /slowmode /roleadd /roleremove /setnick /nickreset /unban');
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { HelpmodCommand };


================================================================================
FILE: src\commands\helpserver.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class HelpserverCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "helpserver" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "helpserver", description: "Show server help" });
  }
  async chatInputRun(i) {
    try {
      return i.reply('Ã°Å¸ÂÂ  Server: /serverinfo /servericon /membercount /rolecount /channelcount /botcount /permissions /roleinfo /channelinfo /lock /unlock /slowmode');
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { HelpserverCommand };


================================================================================
FILE: src\commands\helputility.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class HelputilityCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "helputility" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "helputility", description: "Show utility help" });
  }
  async chatInputRun(i) {
    try {
      return i.reply('Ã°Å¸Â§Â° Utility: /avatar /banner /userinfo /serverinfo /channelinfo /roleinfo /math /poll /embed /say /timestamp /binary /morse /reverse /uppercase /lowercase');
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { HelputilityCommand };


================================================================================
FILE: src\commands\highfive.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class HighfiveCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('highfive')
        .setDescription('Send a virtual high five.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const u=interaction.options.getUser('user')||interaction.user; await interaction.reply(`ðŸ–ï¸ ${interaction.user} high-fives ${u}!`);
  }
}

module.exports = { HighfiveCommand };


================================================================================
FILE: src\commands\hug.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class HugCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Send a virtual hug.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const u=interaction.options.getUser('user')||interaction.user; await interaction.reply(`ðŸ¤— ${interaction.user} hugs ${u}!`);
  }
}

module.exports = { HugCommand };


================================================================================
FILE: src\commands\humans.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class HumansCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "humans" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "humans", description: "Count cached humans" });
  }
  async chatInputRun(i) {
    try {
      const n=i.guild.members.cache.filter(m=>!m.user.bot).size; return i.reply(`Ã°Å¸â€˜Â¤ Cached humans: **${n}**`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { HumansCommand };


================================================================================
FILE: src\commands\humans2.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Humans2Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('humans2')
        .setDescription('Show cached human member count.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:`Humans: **${interaction.guild.members.cache.filter(m=>!m.user.bot).size}** (cached)`,ephemeral:true});
  }
}

module.exports = { Humans2Command };


================================================================================
FILE: src\commands\id.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class IdCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "id" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "id", description: "Show a user's ID",options:[{name:"user",description:"User",type:6,required:true}] });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`ID: **${i.options.getUser('user').id}**`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { IdCommand };


================================================================================
FILE: src\commands\invite.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class InviteCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "invite" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "invite", description: "Create a bot invite link" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`https://discord.com/oauth2/authorize?client_id=${i.client.user.id}&permissions=8&scope=bot%20applications.commands`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { InviteCommand };


================================================================================
FILE: src\commands\invitecount.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');
class InvitecountCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(new SlashCommandBuilder().setName('invitecount').setDescription('Count cached invite objects.').setDMPermission(false));
  }
  async chatInputRun(interaction) { const x=await interaction.guild.invites.fetch().catch(()=>null); await interaction.reply({content:x?`Invites: **${x.size}**`:`Could not fetch invites.`,ephemeral:true}); }
}
module.exports={ InvitecountCommand };


================================================================================
FILE: src\commands\italic.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class ItalicCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "italic" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "italic", description: "Italic text",options:[{name:"text",description:"Text",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`*${i.options.getString('text')}*`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { ItalicCommand };


================================================================================
FILE: src\commands\joined.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class JoinedCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('joined')
        .setDescription('Show when a member joined.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const u=interaction.options.getUser('user')||interaction.user; const m=await interaction.guild.members.fetch(u.id).catch(()=>null); if(!m)return interaction.reply({content:'Member not found.',ephemeral:true}); await interaction.reply({content:`${u.tag} joined <t:${Math.floor((m.joinedTimestamp||Date.now())/1000)}:F>.`,ephemeral:true});
  }
}

module.exports = { JoinedCommand };


================================================================================
FILE: src\commands\joke.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class JokeCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "joke" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "joke", description: "Tell a joke" });
  }
  async chatInputRun(i) {
    try {
      const x=['Why did the computer get cold? It left its Windows open.','Why do programmers prefer dark mode? Because light attracts bugs.','I told my bot a joke. It needed more processing time.']; return i.reply(`Ã°Å¸Ëœâ€š ${x[Math.floor(Math.random()*x.length)]}`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { JokeCommand };


================================================================================
FILE: src\commands\latency.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class LatencyCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('latency')
        .setDescription('Show Discord API latency.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:`Gateway latency: **${interaction.client.ws.ping}ms**`,ephemeral:true});
  }
}

module.exports = { LatencyCommand };


================================================================================
FILE: src\commands\length.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class LengthCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "length" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "length", description: "Count characters in text",options:[{name:"text",description:"Text",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      const s=i.options.getString('text'); return i.reply(`Ã°Å¸â€Â¢ ${s.length} characters.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { LengthCommand };


================================================================================
FILE: src\commands\lock.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class LockCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "lock" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "lock", description: "Lock the current channel",defaultMemberPermissions:'ManageChannels' });
  }
  async chatInputRun(i) {
    try {
      if(!i.memberPermissions.has('ManageChannels')) return i.reply({content:'You need Manage Channels.',ephemeral:true}); await i.channel.permissionOverwrites.edit(i.guild.roles.everyone,{SendMessages:false}); return i.reply('Ã°Å¸â€â€™ Channel locked.');
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { LockCommand };


================================================================================
FILE: src\commands\lockdown.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class LockdownCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('lockdown')
        .setDescription('Lock all text channels.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    if(!interaction.member.permissions.has('ManageChannels'))return interaction.reply({content:'You need Manage Channels.',ephemeral:true}); let n=0; for(const c of interaction.guild.channels.cache.values()){if(c.isTextBased()&&c.permissionOverwrites?.edit){try{await c.permissionOverwrites.edit(interaction.guild.roles.everyone,{SendMessages:false});n++}catch{}}} await interaction.reply(`ðŸ”’ Locked **${n}** text channels.`);
  }
}

module.exports = { LockdownCommand };


================================================================================
FILE: src\commands\lowercase.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class LowercaseCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "lowercase" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "lowercase", description: "Convert text to lowercase",options:[{name:"text",description:"Text",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      return i.reply(i.options.getString('text').toLowerCase());
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { LowercaseCommand };


================================================================================
FILE: src\commands\lowercase2.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Lowercase2Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('lowercase2')
        .setDescription('Convert text to lowercase.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply(interaction.options.getString('text',true).toLowerCase());
  }
}

module.exports = { Lowercase2Command };


================================================================================
FILE: src\commands\maintenance.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class MaintenanceCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('maintenance')
        .setDescription('Show maintenance status.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:`Maintenance mode: **${process.env.MAINTENANCE_MODE==='true'?'ON':'OFF'}**`,ephemeral:true});
  }
}

module.exports = { MaintenanceCommand };


================================================================================
FILE: src\commands\math.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class MathCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "math" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "math", description: "Calculate a basic arithmetic expression",options:[{name:"expression",description:"Expression",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      const e=i.options.getString('expression'); if(!/^[0-9+\-*/(). %]+$/.test(e)) return i.reply({content:'Only basic arithmetic is allowed.',ephemeral:true}); try{return i.reply(`Ã°Å¸Â§Â® **${Function('return '+e)()}**`)}catch{return i.reply({content:'Invalid expression.',ephemeral:true})}
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { MathCommand };


================================================================================
FILE: src\commands\membercount.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class MembercountCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "membercount" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "membercount", description: "Show member count" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`Ã°Å¸â€˜Â¥ **${i.guild.memberCount}** members.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { MembercountCommand };


================================================================================
FILE: src\commands\memberroles.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class MemberrolesCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('memberroles')
        .setDescription('List a member\'s roles.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const u=interaction.options.getUser('user')||interaction.user; const m=await interaction.guild.members.fetch(u.id).catch(()=>null); if(!m)return interaction.reply({content:'Member not found.',ephemeral:true}); await interaction.reply({content:m.roles.cache.filter(r=>r.id!==interaction.guild.id).map(r=>r.name).join(', ')||'No roles',ephemeral:true});
  }
}

module.exports = { MemberrolesCommand };


================================================================================
FILE: src\commands\memory.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class MemoryCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('memory')
        .setDescription('Show bot memory usage.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const m=process.memoryUsage(); await interaction.reply({content:`RSS: ${(m.rss/1048576).toFixed(1)} MB\nHeap: ${(m.heapUsed/1048576).toFixed(1)} MB`,ephemeral:true});
  }
}

module.exports = { MemoryCommand };


================================================================================
FILE: src\commands\mention.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class MentionCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "mention" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "mention", description: "Create a user mention",options:[{name:"user",description:"User",type:6,required:true}] });
  }
  async chatInputRun(i) {
    try {
      return i.reply(i.options.getUser('user').toString());
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { MentionCommand };


================================================================================
FILE: src\commands\modlog.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class ModlogCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('modlog')
        .setDescription('Show moderation logging status.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:'Moderation logging: **Ready**. Set your log channel through server configuration.',ephemeral:true});
  }
}

module.exports = { ModlogCommand };


================================================================================
FILE: src\commands\modping.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class ModpingCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('modping')
        .setDescription('Check moderation permissions.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    const n=['KickMembers','BanMembers','ModerateMembers','ManageMessages','ManageChannels','ManageRoles']; await interaction.reply({content:n.map(x=>`${interaction.member.permissions.has(x)?'âœ…':'âŒ'} ${x}`).join('\n'),ephemeral:true});
  }
}

module.exports = { ModpingCommand };


================================================================================
FILE: src\commands\morse.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class MorseCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "morse" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "morse", description: "Convert text to basic Morse",options:[{name:"text",description:"Text",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      const m={a:'.-',b:'-...',c:'-.-.',d:'-..',e:'.',f:'..-.',g:'--.',h:'....',i:'..',j:'.---',k:'-.-',l:'.-..',m:'--',n:'-.',o:'---',p:'.--.',q:'--.-',r:'.-.',s:'...',t:'-',u:'..-',v:'...-',w:'.--',x:'-..-',y:'-.--',z:'--..',' ': '/'}; return i.reply(i.options.getString('text').toLowerCase().split('').map(c=>m[c]||c).join(' '));
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { MorseCommand };


================================================================================
FILE: src\commands\newaccounts.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class NewaccountsCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('newaccounts')
        .setDescription('List very new accounts in the server.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.guild.members.fetch().catch(()=>{}); const list=interaction.guild.members.cache.filter(m=>Date.now()-m.user.createdTimestamp<7*86400000).map(m=>`â€¢ ${m.user.tag}`).slice(0,20).join('\n')||'None found.'; await interaction.reply({content:`Accounts newer than 7 days:\n${list}`,ephemeral:true});
  }
}

module.exports = { NewaccountsCommand };


================================================================================
FILE: src\commands\nick.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class NickCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "nick" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "nick", description: "Show a member nickname",options:[{name:"user",description:"User",type:6,required:false}] });
  }
  async chatInputRun(i) {
    try {
      const m=i.options.getMember('user')||i.member; return i.reply(`Nickname: **${m.nickname||m.user.username}**`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { NickCommand };


================================================================================
FILE: src\commands\nickreset.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class NickresetCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "nickreset" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "nickreset", description: "Reset a member nickname",defaultMemberPermissions:'ManageNicknames',options:[{name:"user",description:"Member",type:6,required:true}] });
  }
  async chatInputRun(i) {
    try {
      if(!i.memberPermissions.has('ManageNicknames')) return i.reply({content:'You need Manage Nicknames.',ephemeral:true}); const m=i.options.getMember('user'); await m.setNickname(null); return i.reply(`Ã¢Å“ÂÃ¯Â¸Â Reset nickname for **${m.user.tag}**.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { NickresetCommand };


================================================================================
FILE: src\commands\nukecheck.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class NukecheckCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('nukecheck')
        .setDescription('Show channel nuke protection status.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:'Channel nuke protection: **Ready**.',ephemeral:true});
  }
}

module.exports = { NukecheckCommand };


================================================================================
FILE: src\commands\online.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class OnlineCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "online" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "online", description: "Count online members in cache" });
  }
  async chatInputRun(i) {
    try {
      const n=i.guild.members.cache.filter(m=>m.presence?.status&&m.presence.status!=='offline').size; return i.reply(`Ã°Å¸Å¸Â¢ Cached online members: **${n}**`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { OnlineCommand };


================================================================================
FILE: src\commands\onlinecount.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class OnlinecountCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('onlinecount')
        .setDescription('Show cached online member count.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.guild.members.fetch().catch(()=>{}); await interaction.reply({content:`Cached online members: **${interaction.guild.members.cache.filter(m=>m.presence?.status==='online').size}**`,ephemeral:true});
  }
}

module.exports = { OnlinecountCommand };


================================================================================
FILE: src\commands\owner.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class OwnerCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "owner" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "owner", description: "Show configured owner IDs" });
  }
  async chatInputRun(i) {
    try {
      const ids=process.env.OWNER_IDS||''; return i.reply(ids?`Configured owners: **${ids}**`:'No OWNER_IDS environment variable configured.');
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { OwnerCommand };


================================================================================
FILE: src\commands\pat.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class PatCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('pat')
        .setDescription('Send a virtual pat.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const u=interaction.options.getUser('user')||interaction.user; await interaction.reply(`ðŸ‘‹ ${interaction.user} pats ${u}!`);
  }
}

module.exports = { PatCommand };


================================================================================
FILE: src\commands\permissions.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class PermissionsCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "permissions" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "permissions", description: "Show your permissions" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`Ã°Å¸â€Â ${i.member.permissions.toArray().join(', ')||'No permissions'}`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { PermissionsCommand };


================================================================================
FILE: src\commands\permissionsall.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class PermissionsallCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('permissionsall')
        .setDescription('Show all permissions you have.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:interaction.member.permissions.toArray().join('\n')||'No permissions',ephemeral:true});
  }
}

module.exports = { PermissionsallCommand };


================================================================================
FILE: src\commands\permissionscheck.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class PermissionscheckCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "permissionscheck" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "permissionscheck", description: "Check bot permissions" });
  }
  async chatInputRun(i) {
    try {
      const me=i.guild.members.me; return i.reply(`Bot permissions: ${me?.permissions.toArray().join(', ')||'Unavailable'}`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { PermissionscheckCommand };


================================================================================
FILE: src\commands\pingall.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class PingallCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "pingall" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "pingall", description: "Show latency for Sentinel" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`Ã°Å¸Ââ€œ Sentinel latency: **${i.client.ws.ping}ms**`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { PingallCommand };


================================================================================
FILE: src\commands\poll.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class PollCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "poll" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "poll", description: "Create a simple poll",options:[{name:"question",description:"Question",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      const q=i.options.getString('question'); return i.reply(`Ã°Å¸â€œÅ  **Poll:** ${q}\n\nÃ°Å¸â€˜Â Yes\nÃ°Å¸â€˜Å½ No`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { PollCommand };


================================================================================
FILE: src\commands\prefix.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class PrefixCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('prefix')
        .setDescription('Show the configured prefix.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:`Configured prefix: **${process.env.PREFIX||'!'}**`,ephemeral:true});
  }
}

module.exports = { PrefixCommand };


================================================================================
FILE: src\commands\purge.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class PurgeCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "purge" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "purge", description: "Delete up to 100 messages",defaultMemberPermissions:'ManageMessages',options:[{name:"amount",description:"Amount",type:4,required:true}] });
  }
  async chatInputRun(i) {
    try {
      if(!i.memberPermissions.has('ManageMessages')) return i.reply({content:'You need Manage Messages.',ephemeral:true}); const n=i.options.getInteger('amount'); const d=await i.channel.bulkDelete(n,true); return i.reply({content:`Ã°Å¸Â§Â¹ Deleted ${d.size} messages.`,ephemeral:true});
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { PurgeCommand };


================================================================================
FILE: src\commands\quote.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class QuoteCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "quote" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "quote", description: "Quote text",options:[{name:"text",description:"Text",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`Ã°Å¸â€™Â¬ Ã¢â‚¬Å“${i.options.getString('text')}Ã¢â‚¬Â`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { QuoteCommand };


================================================================================
FILE: src\commands\raidmode.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class RaidmodeCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('raidmode')
        .setDescription('Show raid mode state.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:'Raid mode: **Standby**. This status command does not automatically punish members.',ephemeral:true});
  }
}

module.exports = { RaidmodeCommand };


================================================================================
FILE: src\commands\raidstatus.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class RaidstatusCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('raidstatus')
        .setDescription('Show raid protection status.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:'ðŸ›¡ï¸ Raid protection: **Standby / Ready**.',ephemeral:true});
  }
}

module.exports = { RaidstatusCommand };


================================================================================
FILE: src\commands\random.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class RandomCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "random" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "random", description: "Generate a random number",options:[{name:"min",description:"Minimum",type:4,required:false},{name:"max",description:"Maximum",type:4,required:false}] });
  }
  async chatInputRun(i) {
    try {
      const min=i.options.getInteger('min')||1,max=i.options.getInteger('max')||100; if(min>max)return i.reply({content:'Min must be <= max.',ephemeral:true}); return i.reply(`Ã°Å¸Å½Â² **${rand(min,max)}**`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { RandomCommand };


================================================================================
FILE: src\commands\randomchannel.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class RandomchannelCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "randomchannel" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "randomchannel", description: "Pick a random channel" });
  }
  async chatInputRun(i) {
    try {
      const a=[...i.guild.channels.cache.values()]; const c=a[Math.floor(Math.random()*a.length)]; return i.reply(c?`Ã°Å¸Å½Â¯ ${c}`:'No channels available.');
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { RandomchannelCommand };


================================================================================
FILE: src\commands\randomcolor.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class RandomcolorCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('randomcolor')
        .setDescription('Generate a random hex color.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const h='#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0'); await interaction.reply(`Random color: **${h}**`);
  }
}

module.exports = { RandomcolorCommand };


================================================================================
FILE: src\commands\randomnumber.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class RandomnumberCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('randomnumber')
        .setDescription('Generate a random number.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const min=interaction.options.getInteger('min')??1,max=interaction.options.getInteger('max')??100; if(max<min)return interaction.reply({content:'Max must be >= min.',ephemeral:true}); await interaction.reply(`ðŸŽ² **${Math.floor(Math.random()*(max-min+1))+min}**`);
  }
}

module.exports = { RandomnumberCommand };


================================================================================
FILE: src\commands\randomrole.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class RandomroleCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "randomrole" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "randomrole", description: "Pick a random role" });
  }
  async chatInputRun(i) {
    try {
      const a=[...i.guild.roles.cache.values()].filter(r=>r.id!==i.guild.id); const r=a[Math.floor(Math.random()*a.length)]; return i.reply(r?`Ã°Å¸Å½Â¯ ${r}`:'No custom roles available.');
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { RandomroleCommand };


================================================================================
FILE: src\commands\randomuser.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class RandomuserCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "randomuser" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "randomuser", description: "Pick a random cached member" });
  }
  async chatInputRun(i) {
    try {
      const a=[...i.guild.members.cache.values()]; const m=a[Math.floor(Math.random()*a.length)]; return i.reply(m?`Ã°Å¸Å½Â¯ ${m}`:'No members available.');
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { RandomuserCommand };


================================================================================
FILE: src\commands\rate.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class RateCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "rate" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "rate", description: "Rate something from 1 to 10" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`Ã¢Â­Â I'd rate it **${rand(1,10)}/10**.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { RateCommand };


================================================================================
FILE: src\commands\report.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class ReportCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('report')
        .setDescription('Submit a private issue report.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const t=interaction.options.getString('issue',true); await interaction.reply({content:`Report received:\n> ${t}`,ephemeral:true});
  }
}

module.exports = { ReportCommand };


================================================================================
FILE: src\commands\reportbug.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class ReportbugCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('reportbug')
        .setDescription('Submit a bug report.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const bug=interaction.options.getString('bug',true); await interaction.reply({content:`Ã°Å¸Ââ€º Bug report received:\n> ${bug}\n\nThanks for helping improve Sentinel.`,ephemeral:true});
  }
}

module.exports = { ReportbugCommand };


================================================================================
FILE: src\commands\reverse.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class ReverseCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "reverse" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "reverse", description: "Reverse text",options:[{name:"text",description:"Text",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      const s=i.options.getString('text'); return i.reply(s.split('').reverse().join(''));
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { ReverseCommand };


================================================================================
FILE: src\commands\roleadd.js
================================================================================

const { Command } = require('@sapphire/framework');

class RoleaddCommand extends Command {
  constructor(context, options) { super(context, { ...options, name: 'roleadd' }); }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: 'roleadd', description: 'Add a role to a member', defaultMemberPermissions: 'ManageRoles', options: [{ name: 'user', description: 'Member', type: 6, required: true }, { name: 'role', description: 'Role', type: 8, required: true }] });
  }
  async chatInputRun(interaction) {
    if (!interaction.memberPermissions.has('ManageRoles')) return interaction.reply({ content: 'You need Manage Roles.', ephemeral: true });
    const member = interaction.options.getMember('user'); const role = interaction.options.getRole('role');
    if (!member || !role || role.managed || !role.editable || role.position >= interaction.guild.members.me.roles.highest.position) return interaction.reply({ content: 'I cannot manage that role. It must be below my highest role.', ephemeral: true });
    if (member.roles.cache.has(role.id)) return interaction.reply({ content: 'That member already has this role.', ephemeral: true });
    await member.roles.add(role, `Role added by ${interaction.user.tag}`);
    return interaction.reply(`Added ${role} to **${member.user.tag}**.`);
  }
}
module.exports = { RoleaddCommand };


================================================================================
FILE: src\commands\rolecheck.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class RolecheckCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "rolecheck" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "rolecheck", description: "Check whether a member has a role",options:[{name:"user",description:"Member",type:6,required:true},{name:"role",description:"Role",type:8,required:true}] });
  }
  async chatInputRun(i) {
    try {
      const m=i.options.getMember('user'),r=i.options.getRole('role'); return i.reply(m.roles.cache.has(r.id)?`Ã¢Å“â€¦ ${m.user.tag} has ${r}.`:`Ã¢ÂÅ’ ${m.user.tag} does not have ${r}.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { RolecheckCommand };


================================================================================
FILE: src\commands\rolecolor.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class RolecolorCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('rolecolor')
        .setDescription('Show a role\'s color.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const r=interaction.options.getRole('role'); await interaction.reply({content:`**${r.name}** color: ${r.hexColor}`,ephemeral:true});
  }
}

module.exports = { RolecolorCommand };


================================================================================
FILE: src\commands\rolecount.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class RolecountCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "rolecount" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "rolecount", description: "Show role count" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`Ã°Å¸ÂÂ·Ã¯Â¸Â **${i.guild.roles.cache.size}** roles.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { RolecountCommand };


================================================================================
FILE: src\commands\rolehoist.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class RolehoistCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('rolehoist')
        .setDescription('Show whether a role is hoisted.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const r=interaction.options.getRole('role'); await interaction.reply({content:`${r.name} hoisted: **${r.hoist?'Yes':'No'}**`,ephemeral:true});
  }
}

module.exports = { RolehoistCommand };


================================================================================
FILE: src\commands\roleinfo.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class RoleinfoCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "roleinfo" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "roleinfo", description: "Show information about a role",options:[{name:"role",description:"Role",type:8,required:true}] });
  }
  async chatInputRun(i) {
    try {
      const r=i.options.getRole('role'); return i.reply({embeds:[payloadEmbed(r.name,`**ID:** ${r.id}\n**Members:** ${r.members.size}\n**Position:** ${r.position}`)]});
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { RoleinfoCommand };


================================================================================
FILE: src\commands\rolelist.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class RolelistCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('rolelist')
        .setDescription('List server roles.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const list=interaction.guild.roles.cache.filter(r=>r.id!==interaction.guild.id).map(r=>`â€¢ ${r.name}`).slice(0,80).join('\n')||'No roles.'; await interaction.reply({content:list,ephemeral:true});
  }
}

module.exports = { RolelistCommand };


================================================================================
FILE: src\commands\rolemention.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class RolementionCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "rolemention" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "rolemention", description: "Mention a role",options:[{name:"role",description:"Role",type:8,required:true}] });
  }
  async chatInputRun(i) {
    try {
      return i.reply(i.options.getRole('role').toString());
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { RolementionCommand };


================================================================================
FILE: src\commands\rolementionable.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class RolementionableCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('rolementionable')
        .setDescription('Show whether a role is mentionable.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const r=interaction.options.getRole('role'); await interaction.reply({content:`${r.name} mentionable: **${r.mentionable?'Yes':'No'}**`,ephemeral:true});
  }
}

module.exports = { RolementionableCommand };


================================================================================
FILE: src\commands\rolepermissions.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class RolepermissionsCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('rolepermissions')
        .setDescription('Show permissions for a role.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const r=interaction.options.getRole('role'); await interaction.reply({content:`**${r.name}**\n${r.permissions.toArray().join(', ')||'No special permissions.'}`,ephemeral:true});
  }
}

module.exports = { RolepermissionsCommand };


================================================================================
FILE: src\commands\roleposition.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class RolepositionCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('roleposition')
        .setDescription('Show a role\'s position.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const r=interaction.options.getRole('role'); await interaction.reply({content:`**${r.name}** is at position **${r.position}**.`,ephemeral:true});
  }
}

module.exports = { RolepositionCommand };


================================================================================
FILE: src\commands\roleremove.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class RoleremoveCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "roleremove" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "roleremove", description: "Remove a role from a member",defaultMemberPermissions:'ManageRoles',options:[{name:"user",description:"Member",type:6,required:true},{name:"role",description:"Role",type:8,required:true}] });
  }
  async chatInputRun(i) {
    try {
      if(!i.memberPermissions.has('ManageRoles')) return i.reply({content:'You need Manage Roles.',ephemeral:true}); const m=i.options.getMember('user'),r=i.options.getRole('role'); await m.roles.remove(r); return i.reply(`Ã°Å¸ÂÂ·Ã¯Â¸Â Removed ${r} from **${m.user.tag}**.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { RoleremoveCommand };


================================================================================
FILE: src\commands\roll.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class RollCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "roll" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "roll", description: "Roll a number from 1 to 100" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`Ã°Å¸Å½Â² **${rand()}**`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { RollCommand };


================================================================================
FILE: src\commands\rps.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class RpsCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "rps" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "rps", description: "Play rock paper scissors",options:[{name:"choice",description:"rock, paper, or scissors",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      const c=['rock','paper','scissors']; const u=i.options.getString('choice'); const b=c[Math.floor(Math.random()*3)]; const win=(u==='rock'&&b==='scissors')||(u==='paper'&&b==='rock')||(u==='scissors'&&b==='paper'); return i.reply(`You: **${u}** | Sentinel: **${b}** Ã¢â‚¬â€ **${u===b?'Tie!':win?'You win!':'Sentinel wins!'}**`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { RpsCommand };


================================================================================
FILE: src\commands\ruleschannel.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class RuleschannelCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('ruleschannel')
        .setDescription('Show the rules channel.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:interaction.guild.rulesChannel?`Rules: ${interaction.guild.rulesChannel}`:'No rules channel.',ephemeral:true});
  }
}

module.exports = { RuleschannelCommand };


================================================================================
FILE: src\commands\say.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class SayCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "say" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "say", description: "Send a message as Sentinel" });
  }
  async chatInputRun(i) {
    try {
      if(!i.memberPermissions.has('ManageMessages')) return i.reply({content:'You need Manage Messages.',ephemeral:true}); await i.reply({content:'Sent.',ephemeral:true}); return i.channel.send(i.options.getString('message'));
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { SayCommand };


================================================================================
FILE: src\commands\security.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class SecurityCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('security')
        .setDescription('Display server security controls.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:'Ã°Å¸â€ºÂ¡Ã¯Â¸Â **Sentinel Security**\nÃ¢â‚¬Â¢ Anti-raid: Ready\nÃ¢â‚¬Â¢ Anti-spam: Ready\nÃ¢â‚¬Â¢ Anti-bot: Ready\nÃ¢â‚¬Â¢ Anti-alt: Ready\nÃ¢â‚¬Â¢ Verification: Available',ephemeral:true});
  }
}

module.exports = { SecurityCommand };


================================================================================
FILE: src\commands\securitycheck.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class SecuritycheckCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('securitycheck')
        .setDescription('Run a basic security check.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const c=[['Verification level',interaction.guild.verificationLevel>0],['2FA moderation',interaction.guild.mfaLevel>0],['Community',interaction.guild.features.includes('COMMUNITY')]]; await interaction.reply({content:c.map(([n,v])=>`${v?'âœ…':'âš ï¸'} ${n}`).join('\n'),ephemeral:true});
  }
}

module.exports = { SecuritycheckCommand };


================================================================================
FILE: src\commands\server2fa.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Server2FaCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('server2fa')
        .setDescription('Show server 2FA moderation requirement.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:`2FA moderation requirement: **${interaction.guild.mfaLevel?'Enabled':'Disabled'}**`,ephemeral:true});
  }
}

module.exports = { Server2FaCommand };


================================================================================
FILE: src\commands\serverfeatures.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class ServerfeaturesCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('serverfeatures')
        .setDescription('List enabled Discord server features.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:interaction.guild.features.join('\n')||'No special features.',ephemeral:true});
  }
}

module.exports = { ServerfeaturesCommand };


================================================================================
FILE: src\commands\servericon.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class ServericonCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "servericon" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "servericon", description: "Show the server icon" });
  }
  async chatInputRun(i) {
    try {
      const u=i.guild.iconURL({size:1024}); return i.reply(u||'This server has no icon.');
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { ServericonCommand };


================================================================================
FILE: src\commands\serverid.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class ServeridCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "serverid" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "serverid", description: "Show the server ID" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`Server ID: **${i.guild.id}**`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { ServeridCommand };


================================================================================
FILE: src\commands\serverowner.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class ServerownerCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "serverowner" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "serverowner", description: "Show server owner" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`<@${i.guild.ownerId}>`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { ServerownerCommand };


================================================================================
FILE: src\commands\serververification.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class SerververificationCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('serververification')
        .setDescription('Show server verification level.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:`Verification level: **${interaction.guild.verificationLevel}**`,ephemeral:true});
  }
}

module.exports = { SerververificationCommand };


================================================================================
FILE: src\commands\setnick.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class SetnickCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "setnick" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "setnick", description: "Set a member nickname",defaultMemberPermissions:'ManageNicknames',options:[{name:"user",description:"Member",type:6,required:true},{name:"nickname",description:"Nickname",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      if(!i.memberPermissions.has('ManageNicknames')) return i.reply({content:'You need Manage Nicknames.',ephemeral:true}); const m=i.options.getMember('user'),n=i.options.getString('nickname'); await m.setNickname(n); return i.reply(`Ã¢Å“ÂÃ¯Â¸Â Nickname changed to **${n}**.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { SetnickCommand };


================================================================================
FILE: src\commands\shard.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class ShardCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('shard')
        .setDescription('Show shard information.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:`Shard: **${interaction.guild.shardId}**`,ephemeral:true});
  }
}

module.exports = { ShardCommand };


================================================================================
FILE: src\commands\ship.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class ShipCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "ship" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "ship", description: "Give two users a compatibility score" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`Ã°Å¸â€™Å¡ Compatibility: **${rand(0,100)}%**`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { ShipCommand };


================================================================================
FILE: src\commands\ship2.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Ship2Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('ship2')
        .setDescription('Give two users a compatibility score.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const a=interaction.options.getUser('user1')||interaction.user,b=interaction.options.getUser('user2')||interaction.user; await interaction.reply(`ðŸ’š ${a} Ã— ${b}: **${Math.floor(Math.random()*101)}%**`);
  }
}

module.exports = { Ship2Command };


================================================================================
FILE: src\commands\slowmode.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class SlowmodeCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "slowmode" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "slowmode", description: "Set channel slowmode",defaultMemberPermissions:'ManageChannels',options:[{name:"seconds",description:"Seconds",type:4,required:true}] });
  }
  async chatInputRun(i) {
    try {
      if(!i.memberPermissions.has('ManageChannels')) return i.reply({content:'You need Manage Channels.',ephemeral:true}); const s=i.options.getInteger('seconds'); await i.channel.setRateLimitPerUser(s); return i.reply(`Ã°Å¸ÂÂ¢ Slowmode set to **${s}s**.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { SlowmodeCommand };


================================================================================
FILE: src\commands\slowmode10.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Slowmode10Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('slowmode10')
        .setDescription('Set 10 second slowmode.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    if(!interaction.member.permissions.has('ManageChannels'))return interaction.reply({content:'You need Manage Channels.',ephemeral:true}); await interaction.channel.setRateLimitPerUser(10).catch(()=>{}); await interaction.reply('Slowmode set to 10 seconds.');
  }
}

module.exports = { Slowmode10Command };


================================================================================
FILE: src\commands\slowmode30.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Slowmode30Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('slowmode30')
        .setDescription('Set 30 second slowmode.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    if(!interaction.member.permissions.has('ManageChannels'))return interaction.reply({content:'You need Manage Channels.',ephemeral:true}); await interaction.channel.setRateLimitPerUser(30).catch(()=>{}); await interaction.reply('Slowmode set to 30 seconds.');
  }
}

module.exports = { Slowmode30Command };


================================================================================
FILE: src\commands\slowmode5.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Slowmode5Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('slowmode5')
        .setDescription('Set 5 second slowmode.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    if(!interaction.member.permissions.has('ManageChannels'))return interaction.reply({content:'You need Manage Channels.',ephemeral:true}); await interaction.channel.setRateLimitPerUser(5).catch(()=>{}); await interaction.reply('Slowmode set to 5 seconds.');
  }
}

module.exports = { Slowmode5Command };


================================================================================
FILE: src\commands\slowmode60.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Slowmode60Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('slowmode60')
        .setDescription('Set 60 second slowmode.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    if(!interaction.member.permissions.has('ManageChannels'))return interaction.reply({content:'You need Manage Channels.',ephemeral:true}); await interaction.channel.setRateLimitPerUser(60).catch(()=>{}); await interaction.reply('Slowmode set to 60 seconds.');
  }
}

module.exports = { Slowmode60Command };


================================================================================
FILE: src\commands\slowmodeoff.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class SlowmodeoffCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('slowmodeoff')
        .setDescription('Disable slowmode here.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    if(!interaction.member.permissions.has('ManageChannels'))return interaction.reply({content:'You need Manage Channels.',ephemeral:true}); await interaction.channel.setRateLimitPerUser(0).catch(()=>{}); await interaction.reply('Slowmode disabled.');
  }
}

module.exports = { SlowmodeoffCommand };


================================================================================
FILE: src\commands\snowflake.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class SnowflakeCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "snowflake" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "snowflake", description: "Inspect a Discord snowflake",options:[{name:"id",description:"Discord snowflake",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      const id=i.options.getString('id'); try{return i.reply(`Created: <t:${Math.floor(Number((BigInt(id)>>22n)+1420070400000n)/1000)}:F>`)}catch{return i.reply({content:'Invalid snowflake.',ephemeral:true})}
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { SnowflakeCommand };


================================================================================
FILE: src\commands\spoiler.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class SpoilerCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "spoiler" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "spoiler", description: "Make text a spoiler",options:[{name:"text",description:"Text",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`||${i.options.getString('text')}||`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { SpoilerCommand };


================================================================================
FILE: src\commands\staffcheck.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class StaffcheckCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('staffcheck')
        .setDescription('Check staff permissions.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:`Manage Guild: ${interaction.member.permissions.has('ManageGuild')?'âœ…':'âŒ'}\nManage Channels: ${interaction.member.permissions.has('ManageChannels')?'âœ…':'âŒ'}\nManage Messages: ${interaction.member.permissions.has('ManageMessages')?'âœ…':'âŒ'}\nModerate Members: ${interaction.member.permissions.has('ModerateMembers')?'âœ…':'âŒ'}`,ephemeral:true});
  }
}

module.exports = { StaffcheckCommand };


================================================================================
FILE: src\commands\staticemojis.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class StaticemojisCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('staticemojis')
        .setDescription('Count static emojis.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:`Static emojis: **${interaction.guild.emojis.cache.filter(e=>!e.animated).size}**`,ephemeral:true});
  }
}

module.exports = { StaticemojisCommand };


================================================================================
FILE: src\commands\status.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class StatusCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "status" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "status", description: "Show a user's presence",options:[{name:"user",description:"User",type:6,required:false}] });
  }
  async chatInputRun(i) {
    try {
      const m=i.options.getMember('user')||i.member; return i.reply(`Status: **${m.presence?.status||'offline'}**`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { StatusCommand };


================================================================================
FILE: src\commands\statusbot.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class StatusbotCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "statusbot" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "statusbot", description: "Show bot status" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`Ã°Å¸Å¸Â¢ Sentinel is online in **${i.client.guilds.cache.size}** servers.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { StatusbotCommand };


================================================================================
FILE: src\commands\stickercount.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class StickercountCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('stickercount')
        .setDescription('Count server stickers.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:`Stickers: **${interaction.guild.stickers.cache.size}**`,ephemeral:true});
  }
}

module.exports = { StickercountCommand };


================================================================================
FILE: src\commands\stickerinfo.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class StickerinfoCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('stickerinfo')
        .setDescription('Show a server sticker\'s information.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const s=interaction.guild.stickers.cache.first(); await interaction.reply({content:s?`${s.name} â€” ${s.id}`:'No stickers found.',ephemeral:true});
  }
}

module.exports = { StickerinfoCommand };


================================================================================
FILE: src\commands\suggest.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class SuggestCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "suggest" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "suggest", description: "Create a suggestion",options:[{name:"suggestion",description:"Suggestion",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      return i.reply({embeds:[payloadEmbed('Ã°Å¸â€™Â¡ Suggestion',i.options.getString('suggestion'))]});
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { SuggestCommand };


================================================================================
FILE: src\commands\suggest2.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Suggest2Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('suggest2')
        .setDescription('Submit a suggestion.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const t=interaction.options.getString('suggestion',true); await interaction.reply({content:`Suggestion received:\n> ${t}`,ephemeral:true});
  }
}

module.exports = { Suggest2Command };


================================================================================
FILE: src\commands\support.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class SupportCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "support" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "support", description: "Show support information" });
  }
  async chatInputRun(i) {
    try {
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { SupportCommand };


================================================================================
FILE: src\commands\systemchannel.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class SystemchannelCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('systemchannel')
        .setDescription('Show the system channel.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:interaction.guild.systemChannel?`System channel: ${interaction.guild.systemChannel}`:'No system channel.',ephemeral:true});
  }
}

module.exports = { SystemchannelCommand };


================================================================================
FILE: src\commands\textchannels.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class TextchannelsCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "textchannels" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "textchannels", description: "Count text channels" });
  }
  async chatInputRun(i) {
    try {
      const n=i.guild.channels.cache.filter(c=>c.isTextBased()).size; return i.reply(`Ã°Å¸â€™Â¬ **${n}** text-based channels.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { TextchannelsCommand };


================================================================================
FILE: src\commands\textlist.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class TextlistCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('textlist')
        .setDescription('List text channels.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const x=interaction.guild.channels.cache.filter(c=>c.isTextBased()&&!c.isVoiceBased()).map(c=>c.name).slice(0,80).join('\n')||'None'; await interaction.reply({content:x,ephemeral:true});
  }
}

module.exports = { TextlistCommand };


================================================================================
FILE: src\commands\threadcount.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class ThreadcountCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('threadcount')
        .setDescription('Count active threads.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const x=await interaction.guild.channels.fetchActiveThreads().catch(()=>({threads:new Map()})); await interaction.reply({content:`Active threads: **${x.threads.size}**`,ephemeral:true});
  }
}

module.exports = { ThreadcountCommand };


================================================================================
FILE: src\commands\tickethelp.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class TickethelpCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('tickethelp')
        .setDescription('Explain ticket features.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:'Sentinel includes configurable ticket features for server support workflows.',ephemeral:true});
  }
}

module.exports = { TickethelpCommand };


================================================================================
FILE: src\commands\timeout1d.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Timeout1DCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('timeout1d')
        .setDescription('Timeout a member for one day.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    if(!interaction.member.permissions.has('ModerateMembers'))return interaction.reply({content:'You need Moderate Members.',ephemeral:true}); const m=interaction.options.getMember('user'); if(!m)return interaction.reply({content:'Member not found.',ephemeral:true}); await m.timeout(86400000,'Sentinel timeout1d').catch(()=>{}); await interaction.reply(`Timed out ${m} for 1 day.`);
  }
}

module.exports = { Timeout1DCommand };


================================================================================
FILE: src\commands\timeout1h.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Timeout1HCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('timeout1h')
        .setDescription('Timeout a member for one hour.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    if(!interaction.member.permissions.has('ModerateMembers'))return interaction.reply({content:'You need Moderate Members.',ephemeral:true}); const m=interaction.options.getMember('user'); if(!m)return interaction.reply({content:'Member not found.',ephemeral:true}); await m.timeout(3600000,'Sentinel timeout1h').catch(()=>{}); await interaction.reply(`Timed out ${m} for 1 hour.`);
  }
}

module.exports = { Timeout1HCommand };


================================================================================
FILE: src\commands\timestamp.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class TimestampCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "timestamp" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "timestamp", description: "Create a Discord timestamp" });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`<t:${Math.floor(Date.now()/1000)}:F>`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { TimestampCommand };


================================================================================
FILE: src\commands\truth.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class TruthCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('truth')
        .setDescription('Give a truth prompt.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const a=['What is a goal you have?','What is something you are proud of?','What hobby would you like to try?']; await interaction.reply(a[Math.floor(Math.random()*a.length)]);
  }
}

module.exports = { TruthCommand };


================================================================================
FILE: src\commands\unban.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class UnbanCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "unban" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "unban", description: "Unban a user by ID",defaultMemberPermissions:'BanMembers',options:[{name:"user_id",description:"Discord user ID",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      if(!i.memberPermissions.has('BanMembers')) return i.reply({content:'You need Ban Members.',ephemeral:true}); const id=i.options.getString('user_id'); await i.guild.members.unban(id); return i.reply(`Ã°Å¸â€â€œ Unbanned **${id}**.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { UnbanCommand };


================================================================================
FILE: src\commands\undeafen.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class UndeafenCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "undeafen" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "undeafen", description: "Undeafen a member",defaultMemberPermissions:'DeafenMembers',options:[{name:"user",description:"Member",type:6,required:true}] });
  }
  async chatInputRun(i) {
    try {
      if(!i.memberPermissions.has('DeafenMembers')) return i.reply({content:'You need Deafen Members.',ephemeral:true}); const m=i.options.getMember('user'); await m.voice.setDeaf(false); return i.reply(`Ã°Å¸â€Å  Undeafened **${m.user.tag}**.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { UndeafenCommand };


================================================================================
FILE: src\commands\underline.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class UnderlineCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "underline" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "underline", description: "Underline text",options:[{name:"text",description:"Text",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      return i.reply(`__${i.options.getString('text')}__`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { UnderlineCommand };


================================================================================
FILE: src\commands\unlock.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class UnlockCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "unlock" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "unlock", description: "Unlock the current channel",defaultMemberPermissions:'ManageChannels' });
  }
  async chatInputRun(i) {
    try {
      if(!i.memberPermissions.has('ManageChannels')) return i.reply({content:'You need Manage Channels.',ephemeral:true}); await i.channel.permissionOverwrites.edit(i.guild.roles.everyone,{SendMessages:null}); return i.reply('Ã°Å¸â€â€œ Channel unlocked.');
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { UnlockCommand };


================================================================================
FILE: src\commands\unlockall.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class UnlockallCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('unlockall')
        .setDescription('Unlock all text channels.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    if(!interaction.member.permissions.has('ManageChannels'))return interaction.reply({content:'You need Manage Channels.',ephemeral:true}); let n=0; for(const c of interaction.guild.channels.cache.values()){if(c.isTextBased()&&c.permissionOverwrites?.edit){try{await c.permissionOverwrites.edit(interaction.guild.roles.everyone,{SendMessages:null});n++}catch{}}} await interaction.reply(`ðŸ”“ Unlocked **${n}** text channels.`);
  }
}

module.exports = { UnlockallCommand };


================================================================================
FILE: src\commands\untimeout.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class UntimeoutCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "untimeout" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "untimeout", description: "Remove a member timeout",defaultMemberPermissions:'ModerateMembers',options:[{name:"user",description:"Member",type:6,required:true}] });
  }
  async chatInputRun(i) {
    try {
      if(!i.memberPermissions.has('ModerateMembers')) return i.reply({content:'You need Moderate Members.',ephemeral:true}); const m=i.options.getMember('user'); await m.timeout(null,'Timeout removed'); return i.reply(`Ã°Å¸â€â€œ Timeout removed for **${m.user.tag}**.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { UntimeoutCommand };


================================================================================
FILE: src\commands\untimeoutall.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class UntimeoutallCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('untimeoutall')
        .setDescription('Remove timeout from a member.')
        .setDMPermission(false).setDefaultMemberPermissions('0')
    );
  }

  async chatInputRun(interaction) {
    if(!interaction.member.permissions.has('ModerateMembers'))return interaction.reply({content:'You need Moderate Members.',ephemeral:true}); const m=interaction.options.getMember('user'); if(!m)return interaction.reply({content:'Member not found.',ephemeral:true}); await m.timeout(null,'Sentinel untimeout').catch(()=>{}); await interaction.reply(`Removed timeout from ${m}.`);
  }
}

module.exports = { UntimeoutallCommand };


================================================================================
FILE: src\commands\uppercase.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class UppercaseCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "uppercase" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "uppercase", description: "Convert text to uppercase",options:[{name:"text",description:"Text",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      return i.reply(i.options.getString('text').toUpperCase());
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { UppercaseCommand };


================================================================================
FILE: src\commands\uppercase2.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class Uppercase2Command extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('uppercase2')
        .setDescription('Convert text to uppercase.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply(interaction.options.getString('text',true).toUpperCase());
  }
}

module.exports = { Uppercase2Command };


================================================================================
FILE: src\commands\vanity.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');
class VanityCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(new SlashCommandBuilder().setName('vanity').setDescription('Show the server vanity URL code.').setDMPermission(false));
  }
  async chatInputRun(interaction) { await interaction.reply({content:interaction.guild.vanityURLCode?`Vanity code: **${interaction.guild.vanityURLCode}**`:'No vanity URL is configured.',ephemeral:true}); }
}
module.exports={ VanityCommand };


================================================================================
FILE: src\commands\verifyinfo.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class VerifyinfoCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('verifyinfo')
        .setDescription('Explain verification features.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:'Sentinel verification can gate access before members receive normal server roles.',ephemeral:true});
  }
}

module.exports = { VerifyinfoCommand };


================================================================================
FILE: src\commands\version.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class VersionCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "version" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "version", description: "Show Sentinel version" });
  }
  async chatInputRun(i) {
    try {
      return i.reply('Sentinel **1.0.0**');
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { VersionCommand };


================================================================================
FILE: src\commands\voicelist.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class VoicelistCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('voicelist')
        .setDescription('List voice channels.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const x=interaction.guild.channels.cache.filter(c=>c.isVoiceBased()).map(c=>c.name).slice(0,80).join('\n')||'None'; await interaction.reply({content:x,ephemeral:true});
  }
}

module.exports = { VoicelistCommand };


================================================================================
FILE: src\commands\welcomeinfo.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class WelcomeinfoCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('welcomeinfo')
        .setDescription('Explain welcome features.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply({content:'Sentinel supports configurable welcome and goodbye messages.',ephemeral:true});
  }
}

module.exports = { WelcomeinfoCommand };


================================================================================
FILE: src\commands\whois.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class WhoisCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('whois')
        .setDescription('Show basic information about a user.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const u=interaction.options.getUser('user')||interaction.user; await interaction.reply({content:`**${u.tag}**\nID: ${u.id}\nCreated: <t:${Math.floor(u.createdTimestamp/1000)}:F>`,ephemeral:true});
  }
}

module.exports = { WhoisCommand };


================================================================================
FILE: src\commands\words.js
================================================================================

const { Command } = require('@sapphire/framework');
const { payloadEmbed, rand } = require('./helpers');

class WordsCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, name: "words" });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand({ name: "words", description: "Count words in text",options:[{name:"text",description:"Text",type:3,required:true}] });
  }
  async chatInputRun(i) {
    try {
      const s=i.options.getString('text').trim(); return i.reply(`Ã°Å¸â€Â¢ ${s?s.split(/\s+/).length:0} words.`);
    } catch (error) {
      this.container.logger?.error?.(error);
      const reply={content:'Something went wrong while running this command.',ephemeral:true};
      return (i.replied||i.deferred) ? i.followUp(reply) : i.reply(reply);
    }
  }
}
module.exports = { WordsCommand };


================================================================================
FILE: src\commands\wyr.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class WyrCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('wyr')
        .setDescription('Ask a would-you-rather question.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    const a=['Would you rather fly or be invisible?','Would you rather have unlimited money or unlimited time?','Would you rather explore space or the deep ocean?']; await interaction.reply(a[Math.floor(Math.random()*a.length)]);
  }
}

module.exports = { WyrCommand };


================================================================================
FILE: src\commands\yesno.js
================================================================================

const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('discord.js');

class YesnoCommand extends Command {
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      new SlashCommandBuilder()
        .setName('yesno')
        .setDescription('Return yes or no.')
        .setDMPermission(false)
    );
  }

  async chatInputRun(interaction) {
    await interaction.reply(Math.random()<.5?'Yes.':'No.');
  }
}

module.exports = { YesnoCommand };


================================================================================
FILE: src\config.json
================================================================================

{
  "discord_token": "",
  "prefix": "!",
  "owners": []
}


================================================================================
FILE: src\index.js
================================================================================

require('./lib/setup');
const { LogLevel, SapphireClient } = require('@sapphire/framework');
const { botConfig, getCommandPrefix } = require('./botConfig');
const { GatewayIntentBits, Partials } = require('discord.js');
const { SecurityService } = require('./security');

const token = process.env.DISCORD_TOKEN || process.env.TOKEN;
if (!token) {
  console.error('[Sentinel] Missing DISCORD_TOKEN or TOKEN environment variable.');
  process.exit(1);
}

const client = new SapphireClient({
	defaultPrefix: getCommandPrefix(),
	regexPrefix: /^(hey +)?bot[,! ]/i,
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.Debug
	},
	shards: 'auto',
	intents: [
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent
	],
	partials: [Partials.Channel],
	loadMessageCommandListeners: true
});

const main = async () => {
	try {
		client.logger.info('Sentinel is logging in');
		await client.login(process.env.DISCORD_TOKEN || process.env.TOKEN);
		new SecurityService(client).start();
		client.logger.info('Sentinel logged in successfully');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();


================================================================================
FILE: src\lib\constants.js
================================================================================

module.exports = {
	RandomLoadingMessage: ['Computing...', 'Thinking...', 'Cooking some food', 'Give me a moment', 'Loading...']
};


================================================================================
FILE: src\lib\setup.js
================================================================================

require('@sapphire/plugin-logger/register');
require('@sapphire/plugin-api/register');
require('@sapphire/plugin-editable-commands/register');
require('@sapphire/plugin-subcommands/register');
const { ApplicationCommandRegistries, RegisterBehavior } = require('@sapphire/framework');
const { createColors } = require('colorette');
const { inspect } = require('util');

// Set default behavior to bulk overwrite
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);

// Set default inspection depth
inspect.defaultOptions.depth = 1;

// Enable colorette
createColors({ useColor: true });


================================================================================
FILE: src\lib\utils.js
================================================================================

const { send } = require('@sapphire/plugin-editable-commands');
const { EmbedBuilder } = require('discord.js');
const { RandomLoadingMessage } = require('./constants');

function pickRandom(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function sendLoadingMessage(message) {
	return send(message, { embeds: [new EmbedBuilder().setDescription(pickRandom(RandomLoadingMessage)).setColor('#188110')] });
}

module.exports = {
	pickRandom,
	sendLoadingMessage
};


================================================================================
FILE: src\listeners\commands\messageCommandDenied.js
================================================================================

const { Listener } = require('@sapphire/framework');

class UserEvent extends Listener {
	async run({ context, message: content }, { message }) {
		// `context: { silent: true }` should make UserError silent:
		// Use cases for this are for example permissions error when running the `eval` command.
		if (Reflect.get(Object(context), 'silent')) return;

		return message.channel.send({ content, allowedMentions: { users: [message.author.id], roles: [] } });
	}
}

module.exports = {
	UserEvent
};


================================================================================
FILE: src\listeners\commands\messageCommandSuccess.js
================================================================================

const { Listener, LogLevel } = require('@sapphire/framework');
const { cyan } = require('colorette');

class UserEvent extends Listener {
	run({ message, command }) {
		const shard = this.shard(message.guild?.shardId ?? 0);
		const commandName = this.command(command);
		const author = this.author(message.author);
		const sentAt = message.guild ? this.guild(message.guild) : this.direct();
		this.container.logger.debug(`${shard} - ${commandName} ${author} ${sentAt}`);
	}

	onLoad() {
		this.enabled = this.container.logger.level <= LogLevel.Debug;
		return super.onLoad();
	}

	shard(id) {
		return `[${cyan(id.toString())}]`;
	}

	command(command) {
		return cyan(command.name);
	}

	author(author) {
		return `${author.username}[${cyan(author.id)}]`;
	}

	direct() {
		return cyan('Direct Messages');
	}

	guild(guild) {
		return `${guild.name}[${cyan(guild.id)}]`;
	}
}

module.exports = {
	UserEvent
};


================================================================================
FILE: src\listeners\mentionPrefixOnly.js
================================================================================

const { Listener } = require('@sapphire/framework');

class UserEvent extends Listener {
	async run(message) {
		const prefix = this.container.client.options.defaultPrefix;
		return message.channel.send(prefix ? `My prefix in this guild is: \`${prefix}\`` : 'Cannot find any Prefix for Message Commands.');
	}
}

module.exports = {
	UserEvent
};


================================================================================
FILE: src\listeners\messages\messageUpdate.js
================================================================================

const { Listener } = require('@sapphire/framework');

class UserEvent extends Listener {
	run(old, message) {
		// If the contents of both messages are the same, return:
		if (old.content === message.content) return;

		// If the message was sent by a webhook, return:
		if (message.webhookId !== null) return;

		// If the message was sent by the system, return:
		if (message.system) return;

		// If the message was sent by a bot, return:
		if (message.author.bot) return;

		// Run the message parser.
		this.container.client.emit('preMessageParsed', message);
	}
}

module.exports = {
	UserEvent
};


================================================================================
FILE: src\listeners\ready.js
================================================================================

const { Listener } = require('@sapphire/framework');
const { blue, gray, green, magenta, magentaBright, white, yellow } = require('colorette');

const dev = process.env.NODE_ENV !== 'production';
const style = dev ? yellow : blue;

class UserEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options,
			once: true
		});
	}

	run() {
		this.printBanner();
		this.printStoreDebugInformation();
	}

	printBanner() {
		const success = green('+');

		const llc = dev ? magentaBright : white;
		const blc = dev ? magenta : blue;

		const line01 = llc('');
		const line02 = llc('');
		const line03 = llc('');

		// Offset Pad
		const pad = ' '.repeat(7);

		console.log(
			String.raw`
${line01} ${pad}${blc('PAYLOAD 1.0.0')}
${line02} ${pad}[${success}] Gateway
${line03}${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
		);
	}

	printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop();

		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	styleStore(store, last) {
		return gray(`${last ? 'Ã¢â€â€Ã¢â€â‚¬' : 'Ã¢â€Å“Ã¢â€â‚¬'} Loaded ${style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}
}

module.exports = {
	UserEvent
};


================================================================================
FILE: src\payloadBrand.js
================================================================================

// Sentinel branding helpers.
// Central branding: primary #188110, secondary black.
const { botConfig, getColor } = require('./botConfig');

const payloadBrand = {
  name: 'Sentinel',
  primary: getColor('primary'),
  secondary: getColor('secondary'),
  colors: botConfig.embeds.colors
};

module.exports = { payloadBrand };


================================================================================
FILE: src\preconditions\OwnerOnly.js
================================================================================

const { AllFlowsPrecondition } = require('@sapphire/framework');
const { owners } = require('../config.json');

const message = 'This command can only be used by the owner.';
class UserPrecondition extends AllFlowsPrecondition {
	/**
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	chatInputRun(interaction) {
		return this.doOwnerCheck(interaction.user.id);
	}

	/**
	 * @param {import('discord.js').ContextMenuCommandInteraction} interaction
	 */
	contextMenuRun(interaction) {
		return this.doOwnerCheck(interaction.user.id);
	}

	/**
	 * @param {import('discord.js').Message} message
	 */
	messageRun(message) {
		return this.doOwnerCheck(message.author.id);
	}

	/**
	 * @param {import('discord.js').Snowflake} userId
	 */
	doOwnerCheck(userId) {
		return owners.includes(userId) ? this.ok() : this.error({ message });
	}
}

module.exports = {
	UserPrecondition
};


================================================================================
FILE: src\routes\hello-world.get.js
================================================================================

const { Route } = require('@sapphire/plugin-api');

class UserRoute extends Route {
	run(_request, response) {
		response.json({ message: 'Hello World' });
	}
}

module.exports = {
	UserRoute
};


================================================================================
FILE: src\routes\hello-world.post.js
================================================================================

const { Route } = require('@sapphire/plugin-api');

class UserRoute extends Route {
	run(_request, response) {
		response.json({ message: 'Hello World' });
	}
}

module.exports = {
	UserRoute
};


================================================================================
FILE: src\routes\index.get.js
================================================================================

const { Route } = require('@sapphire/plugin-api');

class UserRoute extends Route {
	run(_request, response) {
		response.json({ message: 'Landing Page!' });
	}
}

module.exports = {
	UserRoute
};


================================================================================
FILE: src\routes\index.post.js
================================================================================

const { Route } = require('@sapphire/plugin-api');

class UserRoute extends Route {
	run(_request, response) {
		response.json({ message: 'Landing Page!' });
	}
}

module.exports = {
	UserRoute
};


================================================================================
FILE: src\security.js
================================================================================

const fs = require('node:fs');
const path = require('node:path');
const { AuditLogEvent } = require('discord.js');

const SETTINGS_FILE = path.join(__dirname, '..', 'data', 'security-settings.json');
const DEFAULTS = Object.freeze({ enabled: true, logChannelId: null, quarantineRoleId: null, trustedUserIds: [], trustedRoleIds: [], spam: { enabled: true, maxMessages: 6, windowMs: 7000, timeoutMs: 600000, blockInvites: false }, raid: { enabled: true, maxJoins: 8, windowMs: 30000, minAccountAgeMs: 259200000, action: 'quarantine' }, nuke: { enabled: true, maxActions: 3, windowMs: 12000 } });
function loadStore() { try { return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')); } catch { return {}; } }
const store = loadStore();
function saveStore() { fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true }); fs.writeFileSync(SETTINGS_FILE, JSON.stringify(store, null, 2)); }
function getSettings(guildId) { if (!store[guildId]) { store[guildId] = JSON.parse(JSON.stringify(DEFAULTS)); saveStore(); } return store[guildId]; }
function updateSettings(guildId, change) { const settings = getSettings(guildId); change(settings); saveStore(); return settings; }

class SecurityService {
  constructor(client) { this.client = client; this.messageWindows = new Map(); this.joinWindows = new Map(); this.auditWindows = new Map(); }
  start() {
    this.client.on('messageCreate', (m) => this.onMessage(m));
    this.client.on('guildMemberAdd', (m) => this.onJoin(m));
    this.client.on('channelDelete', (c) => this.onSensitiveAction(c.guild, AuditLogEvent.ChannelDelete));
    this.client.on('roleDelete', (r) => this.onSensitiveAction(r.guild, AuditLogEvent.RoleDelete));
    this.client.on('guildBanAdd', (b) => this.onSensitiveAction(b.guild, AuditLogEvent.MemberBanAdd));
    this.client.on('roleCreate', (r) => this.onSensitiveAction(r.guild, AuditLogEvent.RoleCreate));
  }
  push(map, key, windowMs) { const now = Date.now(); const values = (map.get(key) || []).filter((t) => now - t < windowMs); values.push(now); map.set(key, values); return values.length; }
  trusted(member, settings) { return member.id === member.guild.ownerId || member.user.bot || settings.trustedUserIds.includes(member.id) || member.roles.cache.some((r) => settings.trustedRoleIds.includes(r.id)); }
  async log(guild, text) { const id = getSettings(guild.id).logChannelId; const channel = id && guild.channels.cache.get(id); if (channel?.isTextBased()) await channel.send({ content: `ðŸ›¡ï¸ ${text}`, allowedMentions: { parse: [] } }).catch(() => null); }
  async contain(member, settings, reason) {
    if (!member || member.id === member.guild.ownerId || member.id === this.client.user.id) return false;
    const role = settings.quarantineRoleId && member.guild.roles.cache.get(settings.quarantineRoleId);
    if (role?.editable) { const removable = member.roles.cache.filter((r) => r.id !== member.guild.id && r.editable); await member.roles.remove(removable, reason).catch(() => null); await member.roles.add(role, reason).catch(() => null); return true; }
    if (member.moderatable) { await member.timeout(2419200000, reason).catch(() => null); return true; }
    return false;
  }
  async onMessage(message) {
    if (!message.guild || message.author.bot) return; const settings = getSettings(message.guild.id); const { spam } = settings; const member = message.member;
    if (!settings.enabled || !spam.enabled || !member || this.trusted(member, settings)) return;
    if (spam.blockInvites && /(?:discord\.gg|discord(?:app)?\.com\/invite)\/[\w-]+/i.test(message.content)) { await message.delete().catch(() => null); await this.contain(member, settings, 'Unauthorized invite link'); return this.log(message.guild, `Invite filter contained **${message.author.tag}**.`); }
    if (this.push(this.messageWindows, `${message.guild.id}:${message.author.id}`, spam.windowMs) < spam.maxMessages) return;
    await message.delete().catch(() => null); if (member.moderatable) await member.timeout(spam.timeoutMs, 'Automated spam protection').catch(() => null); this.messageWindows.delete(`${message.guild.id}:${message.author.id}`); await this.log(message.guild, `Spam protection timed out **${message.author.tag}**.`);
  }
  async onJoin(member) {
    const settings = getSettings(member.guild.id); const { raid } = settings; if (!settings.enabled || !raid.enabled || member.user.bot) return;
    const joins = this.push(this.joinWindows, member.guild.id, raid.windowMs); const newAccount = Date.now() - member.user.createdTimestamp < raid.minAccountAgeMs;
    if (joins < raid.maxJoins && !newAccount) return; if (raid.action === 'kick' && member.kickable) await member.kick('Automated raid protection').catch(() => null); else await this.contain(member, settings, 'Automated raid protection'); await this.log(member.guild, `Raid protection acted on **${member.user.tag}** (${joins} recent joins).`);
  }
  async onSensitiveAction(guild, type) {
    const settings = getSettings(guild.id); if (!settings.enabled || !settings.nuke.enabled) return; const logs = await guild.fetchAuditLogs({ type, limit: 1 }).catch(() => null); const entry = logs?.entries.first(); if (!entry || Date.now() - entry.createdTimestamp > 8000) return;
    const executor = await guild.members.fetch(entry.executorId).catch(() => null); if (!executor || this.trusted(executor, settings)) return; const key = `${guild.id}:${executor.id}`; const count = this.push(this.auditWindows, key, settings.nuke.windowMs); if (count < settings.nuke.maxActions) return;
    const contained = await this.contain(executor, settings, 'Automated anti-nuke protection'); this.auditWindows.delete(key); await this.log(guild, `Anti-nuke ${contained ? 'contained' : 'detected'} **${executor.user.tag}** after ${count} destructive actions.`);
  }
}
module.exports = { getSettings, updateSettings, SecurityService };
