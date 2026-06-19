import { SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import { successEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('joinvc')
        .setDescription('Makes the bot join your voice channel.'),

    category: 'Utility',

    async execute(interaction, config, client) {
        try {
            const voiceChannel = interaction.member.voice.channel;

            if (!voiceChannel) {
                return await InteractionHelper.safeReply(interaction, {
                    content: 'You must be in a voice channel first.',
                    ephemeral: true
                });
            }

            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            const embed = successEmbed(
                'Joined Voice Channel',
                `Joined **${voiceChannel.name}**`
            );

            await InteractionHelper.safeReply(interaction, {
                embeds: [embed]
            });

            logger.debug(
                `joinvc command executed by ${interaction.user.id}`
            );

        } catch (error) {
            logger.error('joinvc command error:', error);
            await handleInteractionError(interaction, error, {
                commandName: 'joinvc',
                source: 'joinvc_command'
            });
        }
    },
};
