import { EmbedBuilder } from 'discord.js';

import { callbackEmbed } from '../../../utils/messages';
import { getCommandHelpInfo } from '../../../utils/cmds';

import { name as botname, githubLink } from '../../../../config/bot.json';

import type { TextChannel } from 'discord.js';
import type { TextCommand } from '../../../sturctures/command';

export const command: TextCommand = {
  data: {
    name: 'help',
    description: 'Get information or help from the bot.',
    directMessageAllowed: true,
  },
  run: async ({ message, args }) => {
    const embed = new EmbedBuilder();

    const { client, channel, guildId } = message;

    if (!args[0]) {
      const commandsCatagories = client.commandsCatagories;

      embed.setDescription(
        `Hello🙋‍♂️!\nOur source code: [Here](${githubLink})\nTurely appreciate that you are supporting us.`,
      );

      for (const catagory of commandsCatagories) {
        if (catagory[0].toLocaleLowerCase() === 'nsfw') {
          if (!(channel as TextChannel).nsfw) continue;
          else {
            catagory[0] += ' THIS CHANNEL ONLY';
          }
        }
        const text = catagory[1]
          .map((index: string) => {
            let _text: string | undefined;
            const cmd = client.commands.get(index);
            if (guildId || (cmd && cmd.data.directMessageAllowed === true)) {
              _text = `\`${index}\``;
            }

            return _text;
          })
          .filter(Boolean)
          .join(', ');

        if (text.length > 0) {
          embed.addFields([{ name: catagory[0], value: text }]);
        }
      }

      const avatarURL = client.user?.defaultAvatarURL;

      embed.setTitle('Bot Assistance Centre').setFooter({
        text: `© ${new Date().getFullYear()} ${botname}`,
        iconURL: avatarURL!,
      });

      message.reply({
        embeds: [embed],
      });
    } else {
      let cmd: TextCommand | undefined;
      const commandMatching = client.commands.get(args[0]);
      const aliasesMatching = client.aliases.get(args[0]);

      // Fetch command destination.
      if (commandMatching) {
        cmd = commandMatching;
      } else if (aliasesMatching) {
        cmd = client.commands.get(aliasesMatching);
      } else {
        const cEmbed = callbackEmbed({
          text: 'Command requested does not exist!',
          color: 'Red',
          mode: 'error',
        });
        message.reply({
          embeds: [cEmbed],
        });

        return;
      }

      if (cmd) {
        const helpInfo = getCommandHelpInfo(cmd);
        message.reply({
          embeds: [helpInfo],
        });
      }
    }
  },
};
