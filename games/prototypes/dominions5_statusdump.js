
/**
 * This module is mutually exclusive with dominions5_tcpquery.js
 * They are both methods to get the current status of a Dom5
 * game. This one consumes the statusdump.txt file generated by
 * the game while it's running with the --statusdump flag on.
 * While msLeft and isPaused are both bits of information that
 * would be available through the statusdump, this method
 * assumes that the bot is enforcing the timer and thus will
 * have no timer enabled in-game on the Dom5 game at all.
 */

const Dominions5StatusSnapshot = require("./dominions5_status_snapshot");


module.exports = fetchStatus;


async function fetchStatus(gameObject)
{
    const statusSnapshot = new Dominions5StatusSnapshot();
    statusSnapshot.setIsServerOnline(gameObject.isServerOnline());

    if (statusSnapshot.isServerOnline() === false)
        return statusSnapshot;


    const statusdumpWrapper = await gameObject.consumeStatusDump();


    if (statusdumpWrapper == null)
        return statusSnapshot;


    statusSnapshot.setIsOnline(statusdumpWrapper.isOnline);

    if (statusSnapshot.isOnline() === false)
        return statusSnapshot;


    statusSnapshot.setUptime(statusdumpWrapper.uptime);
    statusSnapshot.setTurnNumber(statusdumpWrapper.turnNbr);
    statusSnapshot.setPlayers(statusdumpWrapper.nationStatusArray);
    statusSnapshot.setSuccessfulCheckTimestamp(Date.now());
    statusSnapshot.setLastUpdateTimestamp(statusdumpWrapper.lastUpdateTimestamp);
    statusSnapshot.setHasStarted(statusdumpWrapper.hasStarted);

    return statusSnapshot;
}
