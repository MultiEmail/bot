import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { PrismaClient } from '@prisma/client';

@ApplyOptions<Command.Options>({
	description: 'Creates a poll',
	name: 'poll',
	aliases: ['p'],
	fullCategory: ['General']
})
export class UserCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		let topic = await args.pick('string').catch(() => null);
		let description = await args.rest('string').catch(() => null);

		if (!(topic && description)) return message.reply('Invalid usage... Please use: ?poll <topic> <body>');

		const prisma = new PrismaClient();

		const poll = await prisma.polls.create({ data: { topic, description, messageId: message.id, author: message.author.username } });

		const embed = new MessageEmbed()
			.setAuthor({ name: `${poll.topic}`, iconURL: message.author.displayAvatarURL() })
			.setDescription(poll.description)
			.addFields(
				{ name: 'Likes', value: `${poll.likes}`, inline: true },
				{ name: 'Disikes', value: `${poll.dislikes}`, inline: true },
				{ name: 'Message ID', value: `${poll.messageId}`, inline: true }
			)
			.setThumbnail(message.guild?.iconURL() as string)
			.setColor('RANDOM');

		return message.channel.send({ embeds: [embed] }).then(async (embed) => {
			await embed.react('👍');
			await embed.react('👎');
			prisma.polls
				.update({ where: { id: poll.id }, data: { messageId: embed.id } })
				.then(() => this.container.logger.info('Successfully updated message id'));
		});
	}
}
