/* eslint-disable class-methods-use-this */
const {
  sendMail,
  createTableStringFromObject,
  createMailOptions,
} = require('../utils/email');

const {
  DialogSet,
  WaterfallDialog,
  ComponentDialog,
  DialogTurnStatus,
  ChoiceFactory,
  ConfirmPrompt,
  TextPrompt,
  ChoicePrompt,
} = require('botbuilder-dialogs');

const JOB_WATERFALL_DIALOG = 'jobWaterfallDialog';

class JobProfileDialog extends ComponentDialog {
  constructor(userState) {
    super('MainDialog'); // id set
    this.jobProfile = userState.createProperty('jobProfile');

    this.addDialog(new ChoicePrompt('ChoicePrompt'))
      .addDialog(new TextPrompt('TextPrompt'))
      .addDialog(new ConfirmPrompt('ConfirmPrompt'))
      .addDialog(new WaterfallDialog(JOB_WATERFALL_DIALOG, [
        this.initiateSteps.bind(this),
        this.hasVacancy.bind(this),
        this.jobLocation.bind(this),
        this.techStack.bind(this),
        // this.confirmTechStack.bind(this),
        this.companyName.bind(this),
        this.jobTitle.bind(this),
        this.startingSalary.bind(this),
        this.jobPost.bind(this),
        this.extraInfo.bind(this),
        this.contactInfo.bind(this),
        this.thankYou.bind(this),
      ]));

    this.initialDialogId = JOB_WATERFALL_DIALOG;
  }

  async run(turnContext, accessor) {
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(turnContext);
    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
      await dialogContext.beginDialog(this.id);
    }
  }

  async pickPath(stepContext, breakTerm, breakFn, continueFn) {
    const { value } = stepContext.result;
    if (value === breakTerm) {
      return breakFn();
    }
    return continueFn();
  }

  async initiateSteps(stepContext) {
    return stepContext.prompt('ChoicePrompt', {
      prompt: 'Hi! \n\n My name is Regan. I am a Front end developer mostly interested in Javascript, React, Redux and Node projects. If you have a job opportunity for me please use this bot.\n\nWhy you might ask? This way we both know if the project is one im interested in before we start talking and I don\'t get overwhelmed in my inbox and linkedIn',
      retryPrompt: 'I\'m sorry I did not understand you, use the buttons below if you have trouble',
      choices: ChoiceFactory.toChoices(['Let\'s do this!', 'I hate this, goodbye'])
    });
  }

  async hasVacancy(stepContext) {
    return this.pickPath(
      stepContext,
      'I hate this, goodbye',
      () => stepContext.prompt('TextPrompt', {
        prompt: 'No worries, I hope you find the perfect fit.',
      }),
      () => stepContext.prompt('ChoicePrompt', {
        prompt: 'Do you have a specific job in mind?',
        retryPrompt: 'I\'m sorry I did not understand you, use the buttons below if you have trouble',
        choices: ChoiceFactory.toChoices(['Yes', 'No']),
      }),
    );
  }

  async jobLocation(stepContext) {
    return this.pickPath(
      stepContext,
      'No',
      () => stepContext.prompt('TextPrompt', {
        prompt: 'Im sorry I am not actively looking at the moment so I am not interested in communicating about possible future opportunities. However, if you ever find a specific job you think I might be a good fit for feel free to message me again!',
      }),
      () => stepContext.prompt('TextPrompt', {
        prompt: 'Where is this job located?',
      }),
    );
  }

  async techStack(stepContext) {
    const { value } = stepContext.result;
    const text = value && value.toLowerCase() === 'vancouver' ? 'Awesome,' : 'Hmmm interesting,';
    stepContext.values.location = stepContext.result;
    return stepContext.prompt('TextPrompt', {
      prompt: `${text} what are the main frameworks and languages used?`,
    });
  }

  // async confirmTechStack(stepContext) {
  // }

  async companyName(stepContext) {
    stepContext.values.stack = stepContext.result;
    return stepContext.prompt('TextPrompt', {
      prompt: 'Sounds cool! What is the company name?',
    });
  }

  async jobTitle(stepContext) {
    stepContext.values.company = stepContext.result;
    return stepContext.prompt('TextPrompt', {
      prompt: 'And what is the position you are looking to fill?',
    });
  }

  async jobPost(stepContext) {
    stepContext.values.title = stepContext.result;
    return stepContext.prompt('TextPrompt', {
      prompt: 'Awesome, if you have a link to the job posting please enter it now.',
    });
  }

  async startingSalary(stepContext) {
    stepContext.values.link = stepContext.result;
    return stepContext.prompt('TextPrompt', {
      prompt: 'And now for the part everyone hates to ask: what is the annual salary?',
    });
  }

  async extraInfo(stepContext) {
    stepContext.values.salary = stepContext.result;
    return stepContext.prompt('TextPrompt', {
      prompt: 'Okay, this all sounds great, is there anything else you would like me to know?',
    });
  }

  async contactInfo(stepContext) {
    stepContext.values.extra = stepContext.result;
    return stepContext.prompt('TextPrompt', {
      prompt: 'One last thing, where can I contact you if I want to talk more about this opportunity?',
    });
  }

  async thankYou(stepContext) {
    stepContext.values.contact = stepContext.result;
    const stepValues = stepContext.values;
    if (stepValues.instanceId) delete stepValues.instanceId;

    const mailMessage = createTableStringFromObject(stepValues);
    const mailOptions = createMailOptions(mailMessage);
    sendMail(mailOptions);

    return stepContext.prompt('TextPrompt', {
      prompt: 'Thank you for thinking of me, I will be in touch if I think this position will be a good fit!',
    });
  }
}

module.exports.JobProfileDialog = JobProfileDialog;
