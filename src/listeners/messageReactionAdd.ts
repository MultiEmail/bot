import { Listener } from '@sapphire/framework';
import type { MessageReaction } from 'discord.js';
import { PrismaClient } from '@prisma/client';
export class messageREactionAdd extends Listener {
	public async run(reaction: MessageReaction) {
		const prisma = new PrismaClient();
		if (reaction.me) return;
		const data1 = await prisma.polls.findFirst({ where: { messageId: reaction.message.id } });

		if (!data1) return reaction.message.reply({ content: 'Failed to react to post!' });
		const filter = (reaction: MessageReaction, user: any) => {
			return reaction.emoji.name === '👍' || (reaction.emoji.name === '👎' && user.id === reaction.message.author?.id);
		};

		const collector = reaction.message.createReactionCollector({ filter, time: 15000 });

		collector.on('collect', async (reaction) => {
			if (reaction.me) return;
			if (reaction.emoji.name === '👍') {
				return await prisma.polls
					.update({ where: { id: data1.id }, data: { likes: data1.likes + 1 } })
					.then(() => reaction.message.reply({ content: 'YEEEEEEEE' }));
			} else {
				return await prisma.polls
					.update({ where: { id: data1.id }, data: { dislikes: data1.dislikes + 1 } })
					.then(() => reaction.message.reply({ content: 'NOOOOOOOO' }));
			}
		});
		return console.log('DONE');
	}
}
