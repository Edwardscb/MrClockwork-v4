

module.exports = MessageEmbedWrapper;

function MessageEmbedWrapper(discordJsEmbed, messageWrapper)
{
    const _discordJsEmbed = discordJsEmbed;
    const _messageWrapper = messageWrapper;

    this.getMessageId = () => _messageWrapper.getId();
    this.getTitle = () => _discordJsEmbed.title;
    this.getDescription = () => _discordJsEmbed.description;
    this.getColor = () => _discordJsEmbed.hexColor;
    this.getFields = () => _discordJsEmbed.fields;
    this.getLength = () => _discordJsEmbed.length;

    this.addField = (fieldName, fieldValue, inline = false) => _discordJsEmbed.addField(fieldName, fieldValue, inline);

    this.removeFields = (index, numberOfFieldsToRemove = 1) =>
    {
        if (_discordJsEmbed.fields.length - index < numberOfFieldsToRemove)
            return;

        _discordJsEmbed.spliceFields(index, numberOfFieldsToRemove);
    };

    this.editField = (index, fieldName, fieldValue, inline = false) =>
    {
        //Add new field instead if the given index is beyond the stored fields
        if (_discordJsEmbed.fields.length < index)
            return;

        _discordJsEmbed.spliceFields(index, 1, {
            name: fieldName.toString(),
            value: fieldValue.toString(),
            inline
        });
    };

    this.replaceField = (index, fieldName, fieldValue, inline = false) =>
    {
        //Add new field at the end instead if the given index is beyond the stored fields
        if (_discordJsEmbed.fields.length < index)
            this.addField(fieldName, fieldValue, inline);

        else 
        {
            _discordJsEmbed.spliceFields(index, 1, {
                name: fieldName.toString(),
                value: fieldValue.toString(),
                inline
            });
        }
    };

    this.update = () => _messageWrapper.edit(null, _discordJsEmbed);
}