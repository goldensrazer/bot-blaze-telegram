import 'dotenv/config';

import ora from 'ora';
import gradient from 'gradient-string';
import figlet from 'figlet';

import { BotBlazeWithTelegram } from './src/index.mjs'
import { _getColorNameOrEmoticon } from './src/util/blaze.mjs';

figlet('Blaze with Telegram', (_, screen) => {
    console.log(gradient.vice(screen));
    console.log('       ' + gradient.cristal('by: Kel R.C'));
    console.log();
    start();
});

async function start() {
    let appOra = ora('Iniciando aplicação').start(),
        controllerBot = new BotBlazeWithTelegram({
            timeAfterWin: {
                message: "Tempo para analise apos win",
                time: 1
            },
            sticker: {
                win: "win.jpg",
                winGale: "win-in-gale.jpg",
                winWhite: "win-white.jpg",
                loss: "loss.jpg",
            },
            timeAfterLoss: {
                time: 1,
                message: "Tempo para analise apos loss"
            },
            summaryOfResult: {
                interval: 1,
                message: (number) => {
                    return `Total de jogadas: ${number.total}` +
                        `\nWins seguidos: ${number.consecutive} ✅` +
                        `\nTotal de win: ${number.win} ✅` +
                        `\nTotal de loss: ${number.loss} ❌` +
                        `\nTaxa de acertividade: ${(number.win / number.total * 100).toFixed(1)}%`
                }
            },
            messageEnterBet: (current, recents, cb) => {
                // cb('test callback');

                return "🔎 <b>SINAL ENCONTRADO:</b>\n" +
                    `\nENTRE NO ${_getColorNameOrEmoticon(current.color, { emoticon: true })} ${_getColorNameOrEmoticon(current.color, { pt: true, upper: true })}` +
                    `\nPROTEJA NO ${_getColorNameOrEmoticon(0, { emoticon: true })} ${_getColorNameOrEmoticon(0, { pt: true, upper: true })}` +
                    `\n\n<pre>https://blaze.com/</pre>` +
                    `\n\nLink para pré-analise abaixo!` +
                    `\n<a href="https://goldensrazer.github.io/Blaze_Double_history">Pagina de pré-analise</a>` +
                    `\n\n<pre>Compartilhe e ganhe cashback de $10 ${process.env.LINK_TO_INVITE}</pre>`;
            },
            gale: 1,
            IOptionsSummaryOfResult: true
        })

    await controllerBot.run();

    controllerBot.resetWin({
        time_reset_win_in_mili_seconds: Number(process.env.TIME_RESET_WIN_IN_MILI_SECONDS)
    });

    appOra.succeed('Iniciado com sucesso!');

    process.on('SIGINT', () => {
        controllerBot.telegram.close();
        controllerBot.blaze.socket.closeSocket();
        process.exit();
    });
    process.on('SIGQUIT', () => {
        controllerBot.telegram.close();
        controllerBot.blaze.socket.closeSocket();
        process.exit();
    });
    process.on('SIGTERM', () => {
        controllerBot.telegram.close();
        controllerBot.blaze.socket.closeSocket();
        process.exit();
    });
    process
        .on('unhandledRejection', (reason, p) => {
            console.error(reason, 'Unhandled Rejection at Promise', p);
        })
        .on('uncaughtException', err => {
            console.error(err, 'Uncaught Exception thrown');
        });
}