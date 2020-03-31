import * as Discord from 'discord.js';
import { CoronaService } from '../services/corona.service';
import { ConfigService } from '../services/config.service';


export function startBot() {
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

    if (msg.mentions.members.some(x => isBotId(x.id))) {
      msg.reply(
        random([
          'psst, wanna see some magic? Try typing `-covid UY`',
          'I can show you the latest covid info per country, try this: `-covid IT`',
          'I got some bat soup, want to share?'
        ])
      );
    }
    const capitalizeFirst = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);
    const capitalizeFirstMultiple = (string: string) => string.split(' ').map(x => capitalizeFirst(x)).join(' ');

    if (msg.content !== '-covid echo' && msg.content.includes('-covid') && !isBotId(msg.member.id)) {
      msg.react('👍');
      try {
        let countryCode = msg.content.split(' ').slice(1).join(' ').toLowerCase();
        if (countryCode.length == 2) countryCode = countryCode.toUpperCase();
        const resp = await coronaService.getAllCases();
        const country = capitalizeFirstMultiple(countryCode);
        console.log(country);
        const countryData = resp.data[country];
        const confirmed = countryData[countryData?.length - 1].confirmed;
        const recovered = countryData[countryData?.length - 1].recovered;
        const deaths = countryData[countryData?.length - 1].deaths; 
        msg.channel.send(
          [
            `Displaying Covid-19 cases for ${country}`,
            '\n',
            formatMsg(`Confirmed: ${confirmed}`),
            formatMsg(`Recovered: ${recovered}`),
            formatMsg(`Deaths: ${deaths}`),
          ].join('')
        );
      } catch (_err) {
        console.log(_err);
        msg.channel.send(`Whoops, country code was not found.`);
      };
    }
  });
  bot.login(configService.botToken);
}