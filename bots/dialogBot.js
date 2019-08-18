const { ActivityHandler } = require('botbuilder');

class DialogBot extends ActivityHandler {
  constructor(conversationState, userState, dialog) {
    super();
    this.conversationState = conversationState;
    this.userState = userState;
    this.dialog = dialog;
    this.dialogState = this.conversationState.createProperty('DialogState');

    this.onMessage(async (context, next) => {
      await this.dialog.run(context, this.dialogState);
      await next();
    });

    this.onDialog(async (context, next) => {
      await this.conversationState.saveChanges(context, false);
      await this.userState.saveChanges(context, false);
      await next();
    });
  }
}

module.exports.DialogBot = DialogBot;
