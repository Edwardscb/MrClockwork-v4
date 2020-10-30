
const Command = require("../prototypes/command.js");
const CommandData = require("../prototypes/command_data.js");
const TimeLeft = require("../../games/prototypes/time_left.js");
const commandPermissions = require("../command_permissions.js");

const commandData = new CommandData("CURRENT_TIMER");

module.exports = CurrentTimerCommand;

function CurrentTimerCommand()
{
    const currentTimerCommand = new Command(commandData);

    currentTimerCommand.addBehaviour(_behaviour);

    currentTimerCommand.addRequirements(
        commandPermissions.assertMemberIsTrusted,
        commandPermissions.assertGameIsOnline,
        commandPermissions.assertGameHasStarted,
        commandPermissions.assertCommandIsUsedInGameChannel
    );

    return currentTimerCommand;
}

function _behaviour(commandContext)
{
    const gameObject = commandContext.getGameTargetedByCommand();
    const commandArguments = commandContext.getCommandArgumentsArray();

    return gameObject.updateLastKnownTimer()
    .then((tcpQuery) =>
    {
        const timeLeft = tcpQuery.getTimeLeft();

        if (tcpQuery.isInLobby() === true)
            return commandContext.respondToCommand(`Game is being setup in lobby.`);

        if (commandArguments.length <= 0)
            return _sendCurrentTimer(commandContext, timeLeft);
        
        return _changeCurrentTimer(gameObject, commandContext, commandArguments, timeLeft);
    });
}

function _sendCurrentTimer(commandContext, timeLeft)
{
    return commandContext.respondToCommand(timeLeft.printTimeLeft());
}

function _changeCurrentTimer(gameObject, commandContext, commandArguments, timeLeft)
{
    const timerChangeArg = commandArguments[0];

    return Promise.resolve()
    .then(() =>
    {
        if (_isTimerAddition(timerChangeArg))
            return _addTimeToGame(timerChangeArg, gameObject, timeLeft);

        else
            return _changeTimerForGame(timerChangeArg, gameObject);
    })
    .then(() => commandContext.respondToCommand(`The timer was changed. It may take a minute to update.`));
}

function _isTimerAddition(timerChangeArg)
{
    return timerChangeArg.indexOf("+") === 0;
}

function _addTimeToGame(timerChangeArg, gameObject, timeLeft)
{
    var newTimerStripped = timerChangeArg.replace(/\+/, "");
    var addedTimeLeft = TimeLeft.fromStringInput(newTimerStripped);

    return gameObject.emitPromiseWithGameDataToServer("CHANGE_CURRENT_TIMER", { timer: timeLeft.getMsLeft() + addedTimeLeft.getMsLeft() })
}

function _changeTimerForGame(timerChangeArg, gameObject)
{
    var addedTimeLeft = TimeLeft.fromStringInput(timerChangeArg);

    return gameObject.emitPromiseWithGameDataToServer("CHANGE_CURRENT_TIMER", { timer: addedTimeLeft.getMsLeft() });
}