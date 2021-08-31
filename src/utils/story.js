// local story
class LocalStory {
    constructor(storyName) {
        this.story = this.defaultStorys.filter(
            story => story.storyName === storyName
        )[0]
        this.initStory()
    }

    setStory(story) {
        this.story = story
        this.initStory()
    }

    setNode(name) {
        this.currentNodeName = name
        this.currentNode = this.getNode(this.currentNodeName)
    }

    initStory() {
        this.currentNodeName = this.story.startNode
        this.currentNode = this.getNode(this.currentNodeName)
    }

    storyFinished() {
        return !this.story || !this.currentNode || !this.currentNode.nextNode
    }

    next(button, hookFun) {
        this.currentNodeName = this.currentNode.nextNode
        this.currentNode = this.getNode(this.currentNodeName)
        if (this.currentNode.type === 'judge') {
            this.currentNodeName = this.currentNode.nextNode.filter(
                item =>
                    item.condition.toLowerCase() ===
                    button.response.toLowerCase()
            )[0].nextNode
            this.currentNode = this.getNode(this.currentNodeName)
        }
        if (hookFun) hookFun(this)
    }

    getNode(name) {
        return this.story.nodes.filter(node => node.name === name)[0]
    }

    defaultStorys = [
        {
            storyName: 'sap',
            startNode: 'welcome',
            nodes: [
                {
                    name: 'welcome',
                    type: 'content',
                    content: [
                        {
                            type: 'text',
                            align: 'left',
                            message:
                                'Welcome to the FI Authorization Team. I\'m your inquiry ambassador.'
                        }
                    ],
                    nextNode: 'turtorial'
                },
                {
                    name: 'turtorial',
                    type: 'content',
                    content: [
                        {
                            type: 'text',
                            align: 'left',
                            message:
                                "Type your question and/or click below buttons to start chatting with me.<br/><div style='width: 60%;margin: 0 auto'><img style='width: 100%' src='/static/images/turtorial.gif'/></div>"
                        }
                    ],
                    nextNode: null
                },
                {
                    name: 'beginFIRoleSearch',
                    type: 'content',
                    content: [
                        {
                            type: 'button',
                            align: 'left',
                            message: {
                                text:
                                    'Search for a role based on transaction code, or write your question below.',
                                buttons: [
                                    {
                                        text: 'Search FI roles by T-code',
                                        response: 'SearchFIRole',
                                        origin: 'local'
                                    }
                                ]
                            }
                        }
                    ],
                    nextNode: 'transactionCodeForm'
                },
                {
                    name: 'transactionCodeForm',
                    type: 'content',
                    content: [
                        {
                            type: 'form',
                            align: 'left',
                            message: {
                                items: [
                                    {
                                        type: 'input',
                                        name: 'transactionCode',
                                        label: 'Enter transaction code:',
                                        placeholder: 'transaction code',
                                        required: true
                                    }
                                ],
                                buttons: [
                                    {
                                        text: 'Submit',
                                        response: 'Submit',
                                        origin: 'local'
                                    }
                                ]
                            }
                        }
                    ],
                    nextNode: 'submitTransactionCode'
                },
                {
                    name: 'submitTransactionCode',
                    type: 'judge',
                    nextNode: [
                        {
                            condition: 'Submit',
                            nextNode: 'fiRoleSearch'
                        }
                    ]
                },
                {
                    name: 'fiRoleSearch',
                    type: 'content',
                    content: [
                        {
                            type: 'fiRoleSelect',
                            align: 'left',
                            message: {
                                text:
                                    'Please add more criteria to refine the result:'
                            }
                        }
                    ],
                    nextNode: 'submitFIRoleSelect'
                },
                {
                    name: 'submitFIRoleSelect',
                    type: 'judge',
                    nextNode: [
                        {
                            condition: 'Submit',
                            nextNode: 'searchResult'
                        },
                        {
                            condition: 'NoResult',
                            nextNode: 'Retry'
                        }
                    ]
                },
                {
                    name: 'Retry',
                    type: 'content',
                    content: [
                        {
                            type: 'button',
                            align: 'left',
                            message: {
                                text:
                                    'I cannot find it. Are you sure the T-code is correct? ',
                                buttons: [
                                    {
                                        text: 'Re-enter',
                                        response: 'ReEnter',
                                        origin: 'local'
                                    },
                                    {
                                        text: 'Correct',
                                        response: 'Correct',
                                        origin: 'local'
                                    },
                                    {
                                        text: 'Back Menu',
                                        response: 'Cancel',
                                        origin: 'local'
                                    }
                                ]
                            }
                        }
                    ],
                    nextNode: 'judgeRetryButton'
                },
                {
                    name: 'judgeRetryButton',
                    type: 'judge',
                    nextNode: [
                        {
                            condition: 'ReEnter',
                            nextNode: 'transactionCodeForm'
                        },
                        {
                            condition: 'Correct',
                            nextNode: 'reportIssue'
                        },
                        {
                            condition: 'Cancel',
                            nextNode: 'turtorial'
                        }
                    ]
                },
                {
                    name: 'reportIssue',
                    type: 'content',
                    content: [
                        {
                            type: 'text',
                            align: 'left',
                            message:
                                'I am sorry I cannot find a role for you.'
                        },
                        {
                            type: 'button',
                            align: 'left',
                            message: {
                                text:
                                    'Please report this so that improve our service:',
                                buttons: [
                                    {
                                        text: 'Report issue',
                                        response: 'report',
                                        origin: 'local'
                                    },
                                    {
                                        text: 'No thanks',
                                        response: 'no',
                                        origin: 'local'
                                    }
                                ]
                            }
                        }
                    ],
                    nextNode: 'whetherReportIssue'
                },
                {
                    name: 'whetherReportIssue',
                    type: 'judge',
                    nextNode: [
                        {
                            condition: 'report',
                            nextNode: 'showReportIssue'
                        },
                        {
                            condition: 'no',
                            nextNode: 'doNext'
                        }
                    ]
                },
                {
                    name: 'showReportIssue',
                    type: 'content',
                    content: [
                        {
                            type: 'text',
                            align: 'left',
                            message: '"trigger to show feedback page"'
                        }
                    ],
                    nextNode: null
                },
                {
                    name: 'doNext',
                    type: 'content',
                    content: [
                        {
                            type: 'text',
                            align: 'left',
                            message: 'What would you like to do next?'
                        }
                    ],
                    nextNode: 'beginFIRoleSearch'
                },
                {
                    name: 'searchResult',
                    type: 'content',
                    content: [
                        {
                            type: 'text',
                            align: 'left',
                            message: 'Here are the FI roles. Click the bottom-right download icon for a detailed view.'
                        },
                        {
                            type: 'table',
                            align: 'left',
                            message: {
                                showHeader: false,
                                enableDownload: true,
                                columns: ['Role'],
                                values: [],
                                fileName: 'SAP FI Roles.xlsx'
                            }
                        },
                        {
                            type: 'specificCard',
                            align: 'left',
                            message: {
                                cards: [
                                    {
                                        title: 'Contact your LAC',
                                        content: 'Question about how to user these roles',
                                        image: '/static/images/contact-lac.png',
                                        link: 'https://connect.bosch.com/wikis/home?lang=de-de#!/wiki/W1ec19a3cb841_48bd_ba10_9e0337ae709a/page/The%20Accounting%20Authorization%20team%20Stakeholders'
                                    },
                                    {
                                        title: 'IdM Self Service',
                                        content: 'Go Further to apply for your roles',
                                        image: '/static/images/idm-service.png',
                                        link: 'https://rb-im.bosch.com/BOAWeb/pages/selfservice/selfservice-roles.xhtml'
                                    },
                                    {
                                        title: 'IT Service Portal',
                                        content: 'Don’t have the acces to IdM Self Service?',
                                        image: '/static/images/it-service.png',
                                        link: 'https://rb-servicecatalog.apps.intranet.bosch.com/RequestCenter/website/Grunt/application/search.html?q=Manage%20IT%20roles/authorizations%20via%20IdM'
                                    }
                                ]
                            }
                        }
                    ],
                    nextNode: 'doNext'
                }
            ]
        },
        {
            storyName: 'landingPage',
            startNode: 'welcome',
            nodes: [
                {
                    name: 'welcome',
                    type: 'content',
                    content: [
                        {
                            type: 'text',
                            align: 'left',
                            message:
                                'Hey there, welcome to the Chatbot Solution Center. Nice to meet you!'
                        },
                        {
                            type: 'text',
                            align: 'left',
                            message:
                                'I am Ruby, your chatbot ambassdor. Tell us your chatbot requirement:'
                        }
                    ],
                    nextNode: 'form'
                },
                {
                    name: 'form',
                    type: 'content',
                    content: [
                        {
                            type: 'form',
                            align: 'left',
                            message: {
                                items: [
                                    {
                                        type: 'input',
                                        name: 'email',
                                        label: 'Enter contact email:',
                                        placeholder: 'example@bosch.com',
                                        required: true,
                                        rules: [
                                            {
                                                regExp:
                                                    '^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}$',
                                                tip: 'Invalid email address'
                                            }
                                        ]
                                    },
                                    {
                                        type: 'textarea',
                                        name: 'requirement',
                                        label:
                                            'Fill in the requirement of chatbot:',
                                        placeholder:
                                            'Type the detailed needs here',
                                        required: true
                                    }
                                ],
                                buttons: [
                                    {
                                        text: 'Submit',
                                        response: 'Submit',
                                        origin: 'local'
                                    }
                                ]
                            }
                        }
                    ],
                    nextNode: 'submitForm'
                },
                {
                    name: 'submitForm',
                    type: 'judge',
                    nextNode: [
                        {
                            condition: 'Submit',
                            nextNode: 'thank'
                        }
                    ]
                },
                {
                    name: 'thank',
                    type: 'content',
                    content: [
                        {
                            type: 'text',
                            align: 'left',
                            message:
                                'Your requirement has been submitted! We will contact you as soon as possible by email.'
                        },
                        {
                            type: 'button',
                            align: 'left',
                            message: {
                                text:
                                    'Do you have any other chatbot requirements?',
                                buttons: [
                                    {
                                        text: 'Yes',
                                        response: 'Yes',
                                        origin: 'local'
                                    },
                                    {
                                        text: 'No',
                                        response: 'No',
                                        origin: 'local'
                                    }
                                ]
                            }
                        }
                    ],
                    nextNode: 'judgeButton'
                },
                {
                    name: 'judgeButton',
                    type: 'judge',
                    nextNode: [
                        {
                            condition: 'yes',
                            nextNode: 'form'
                        },
                        {
                            condition: 'no',
                            nextNode: 'bye'
                        }
                    ]
                },
                {
                    name: 'bye',
                    type: 'content',
                    content: [
                        {
                            type: 'text',
                            align: 'left',
                            message: 'Thank you, bye!'
                        }
                    ],
                    nextNode: null
                }
            ]
        }
    ]
}

export default LocalStory
