// list : list everything
let getTime = require('./../utils/getTime'),
    permissionHelper = require('./../utils/permissionHelper'),
    timeHelper = require('./../utils/timeHelper'),
    bracketHelper = require('./../utils/bracketHelper'),
    codes = require('./../utils/codes'),
    Store = require('./../utils/store'),
    settings = require('./../utils/settings').instance();

module.exports = async function (client, message){
    return new Promise(async function(resolve, reject){
        try {

            let store = await Store.instance(),
                winnings = store.getWinnings(message.author.id),
                reply = '';

            if (winnings.length ){
                reply += 'You recently won the following game(s):\n';
                for (let winning of winnings){
                    let daysSince = timeHelper.daysSince(winning.ended),
                        coolDown = settings.values.winningCooldownDays - daysSince;

                    reply += `${winning.steamName} ${daysSince} days ago. `;

                    let bracket = bracketHelper.fromString(winning.bracket);
                    if (bracket && coolDown >= 0){
                        reply += `You'll need to wait ${coolDown} days to try again for a game in the range ${bracket.min}-${bracket.max} ${settings.values.bracketsCurrencyZone}.`;
                    }

                    reply += '\n'
                }
            } else {
                reply = `You haven't won anything in the last ${settings.values.winningCooldownDays} days`
            }

            await message.author.send(reply);
            resolve(codes.MESSAGE_ACCEPTED);

        } catch (ex){
            reject(ex);
        }

    });
};