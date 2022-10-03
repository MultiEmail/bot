import { ApplyOptions } from '@sapphire/decorators';
import { Command, Args, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { envParseArray } from '../../lib/env-parser';
import { capitalise, removeDuplicates } from '../../Utils/Utils';

const OWNERS = envParseArray('OWNERS');

@ApplyOptions<CommandOptions>({
	name: 'help',
	description: 'Shows the help menu',
	fullCategory: ['General']
})
export default class helpCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const command: any = await args.pick('string').catch(() => null);

		const embed = new MessageEmbed()
			.setColor('BLUE')
			.setAuthor({ name: 'Help Menu', iconURL: message.author.displayAvatarURL() })
			.setThumbnail(this.container.client.user?.displayAvatarURL({ dynamic: true }) as string)
			.setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) as string })
			.setTimestamp();

		if (command) {
			const cmd: any = this.container.stores.get('commands');
			if (!cmd.has(command)) return message.channel.send(`Command \`${command}\` not found.`);
			embed.setAuthor({
				name: `${command}  Command Help`,
				iconURL: this.container.client.user?.displayAvatarURL({ dynamic: true }) as string
			});

			embed.setDescription(
				`**❯ Aliases: ${
					cmd.get(command).aliases.length
						? cmd
								.get(command)
								.aliases.map((a: any) => `\`${a}\``)
								.join(', ')
						: 'No aliases found'
				}**\n` +
					`**❯ Description: ${cmd.get(command).description}**\n` +
					`**❯ Category: ${capitalise(cmd.get(command).fullCategory[0])}**\n`
			);

			return message.channel.send({ embeds: [embed] });
		} else {
			embed.setDescription(
				`These are the available commands for ${message.guild?.name}\n The bot's prefix is: ${this.container.client.options.defaultPrefix} \n Command Parameters: \`<>\` is strict & \`[]\` is optional`
			);

			let categories;
			if (!OWNERS.includes(message.author.id)) {
				categories = await removeDuplicates(
					this.container.stores
						.get('commands')
						.filter((cmd: any) => cmd.category !== 'Owner')
						.map((cmd: any) => cmd.category)
				);
			} else {
				categories = removeDuplicates(this.container.stores.get('commands').map((cmd: any) => cmd.category));
			}

			for (const category of categories!) {
				embed.addField(
					`**${capitalise(category)}**`,
					this.container.stores
						.get('commands')
						.filter((cmd: any) => cmd.category === category)
						.map((cmd: any) => `\`${cmd.name}\``)
						.join(' ')
				);
			}
			return message.channel.send({ embeds: [embed] });
		}
	}
}
