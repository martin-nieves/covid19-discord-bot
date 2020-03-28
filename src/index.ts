import * as Discord from 'discord.js';
import { CoronaService } from './services/corona.service';
import { ConfigService } from './services/config.service';


async function main() {
  const coronaService = new CoronaService();
  const configService = new ConfigService();

  const bot = new Discord.Client();
  bot.on('ready', () => console.log('This bot is online!'));

  const codeBlock = '```';
  const formatMsg = (msg: string, lang: string = 'haskell') => `${codeBlock}${lang}\n${msg}${codeBlock}`;
  const random = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];
  const isBotId = (id: string) => id === configService.botId;

  bot.on('message', async msg => {

    if (msg.content === '-covid echo')
      msg.channel.send(formatMsg('echo', ''));

    if (msg.mentions.members.some(x => isBotId(x.id)))
      msg.reply(
        random([
          'hi',
          'how are you?',
          'hello',
          'psst, wanna see some magic? Try typing `-covid UY`',
          'I got some bat soup, want to share?'
        ])
      );

    if (msg.content !== '-covid echo' && msg.content.includes('-covid') && !isBotId(msg.member.id)) {
      msg.react('👍');
      const countryCode = msg.content.split(' ').pop().toUpperCase();
      coronaService.getCasesByCountry(countryCode).then(resp => {
        const confirmed = resp.data.latest.confirmed;
        const deaths = resp.data.latest.deaths;
        const country = resp.data.locations[0].country;
        msg.channel.send(
          [
            `Displaying Covid-19 cases for ${country}`,
            '\n',
            formatMsg(`Confirmed: ${confirmed}`),
            formatMsg(`Deaths: ${deaths}`),
          ].join('')
        );
      }, _err => {
        msg.channel.send(`Whoops, country code was not found.`);
      });
    }
  });

  bot.login(configService.botToken);

  // Zeit Now specific requirement (Listen for http traffic)
  import('http').then(x => x.createServer().listen(configService.port));

}

main();
