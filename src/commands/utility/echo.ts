import {
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

const data = new SlashCommandBuilder()
  .setName("echo")
  .setDescription("Replies with your input!")
  .addStringOption((option) =>
    option
      .setName("input")
      .setDescription("The input to echo back")
      // Ensure the text will fit in an embed description, if the user chooses that option
      .setMaxLength(2_000)
      .setRequired(true),
  )
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel to echo into")
      .addChannelTypes(ChannelType.GuildText),
  )
  .addBooleanOption((option) =>
    option
      .setName("embed")
      .setDescription("Whether or not the echo should be embedded"),
  )
  .addBooleanOption((option) =>
    option
      .setName("public")
      .setDescription(
        "Whether or not the reply should be public, i.e. not ephemaral",
      ),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const input = interaction.options.getString("input", true);
  const embed = interaction.options.getBoolean("embed") ?? false;
  const pub = interaction.options.getBoolean("public") ?? false;
  const outChannel =
    interaction.options.getChannel<ChannelType.GuildText>("channel");

  const messagePayload = embed
    ? { embeds: [new EmbedBuilder().setDescription(input).setColor("Blue")] }
    : { content: input };

  if (!interaction.channel) {
    await interaction.reply({
      content: "Could not find the channel context.",
      flags: [MessageFlags.Ephemeral],
    });
    return;
  }

  if (outChannel && outChannel.id !== interaction.channelId) {
    // 1. Send publicly to the other channel
    await outChannel.send(messagePayload);

    // 2. Reply to the user privately so they know it worked
    await interaction.reply({
      content: `Message sent to ${outChannel}`,
      flags: [MessageFlags.Ephemeral],
    });
  } else {
    // 3. This handles both:
    //    - No channel was selected (default to current)
    //    - The selected channel IS the current channel
    // This respects the 'pub' variable perfectly.
    await interaction.reply({
      ...messagePayload,
      flags: pub ? [] : [MessageFlags.Ephemeral],
    });
  }
}
