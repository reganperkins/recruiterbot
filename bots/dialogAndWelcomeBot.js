const { CardFactory } = require('botbuilder');
const { DialogBot } = require('./dialogBot');

class DialogAndWelcomeBot extends DialogBot {
  constructor(conversationState, userState, dialog) {
    super(conversationState, userState, dialog);

    // this.welcomedUserProperty = userState.createProperty('welcomedUser');
    this.userState = userState;

    this.onMembersAdded(async (context, next) => {
      for (const idx in context.activity.membersAdded) {
        if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
          const welcomeCard = CardFactory.animationCard(
            ' ',
            ['https://media.giphy.com/media/MB5cRgSVDW4F2/source.gif'],
          );
          await context.sendActivity({ attachments: [welcomeCard] });
          await dialog.run(context, conversationState.createProperty('DialogState'));
        }
      }
      await next();
    });
  }
}

module.exports.DialogAndWelcomeBot = DialogAndWelcomeBot;
