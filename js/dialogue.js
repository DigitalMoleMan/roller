
class DialogueHandler {
    constructor() {



        this.currentDialogue;
        this.textBuffer = new String;
        this.displayedText = [];
        this.textProg = 0;
        document.addEventListener(input.binds.gameDialogue.next, () => {
            if (activeScene == "gameDialogue") dialogue.currentDialogue.next();
        })
    };

    playDialogue(dlgObj) {
        setScene("gameDialogue");
        this.textProg = 0;
        this.currentDialogue = dlgObj;
    }
    msglength(n) {
        var l = 0;
        for (var i = 0; i < n; i++) {
            l += this.currentDialogue.text[i].length;
        }
        return l;
    }

    update() {

        if (this.msglength(this.currentDialogue.text.length) > this.textProg) this.textProg += this.currentDialogue.textSpeed;
    }

    draw() {
        render.rect(block(3), canvasHeight - block(4.5), canvasWidth - block(6), block(4), "#00408080", 0); // background
        render.text(this.currentDialogue.speakerName, block(3), canvasHeight - block(4.5), 1, "#fff", 0);
        for (var i = 0; i < this.currentDialogue.text.length; i++) {
            render.text(this.currentDialogue.text[i].substr(0, this.textProg - this.msglength(i)), block(4), canvasHeight - block(3.5) + block(i), 1, "#fff");
        }
        if (this.textProg >= this.currentDialogue.text.length) render.text(">", canvasWidth - block(4 - (Math.sin(gameClock / 5) / 4)), canvasHeight - block(1.5), 1);
    }
}


class DialogueBox {
    constructor(options = {
        speakerName: String(),
        text: String(),
        textSpeed: Number(),
        camPosX: Function(),
        camPosY: Function(),
        next: Function()
    }) {
        this.speakerName = options.speakerName;
        this.text = options.text;
        this.textSpeed = options.textSpeed;
        this.camPosX = options.camPosX;
        this.camPosY = options.camPosY;
        this.next = options.next;
    }
}

var rollerDialogues = [];
var bogusDialogues = [];

loadDialogues = () => {
    if (!onMobile) {
        rollerDialogues = [
            new DialogueBox({
                speakerName: "",
                text: ["Welcome to the alpha build of [ROLLER]!"],
                textSpeed: 1,
                camPosX: () => player.posX,
                camPosY: () => player.posY,
                next: () => dialogue.playDialogue(rollerDialogues[1])
            }),
            new DialogueBox({
                speakerName: "",
                text: ["Controlls:"],
                textSpeed: 1,
                camPosX: () => player.posX,
                camPosY: () => player.posY,
                next: () => dialogue.playDialogue(rollerDialogues[2])
            }),
            new DialogueBox({
                speakerName: "",
                text: [`Move left and right using A and D.`],
                textSpeed: 1,
                camPosX: () => player.posX,
                camPosY: () => player.posY,
                next: () => dialogue.playDialogue(rollerDialogues[3])
            }),
            new DialogueBox({
                speakerName: "",
                text: [`Press Spacebar to jump.`],
                textSpeed: 1,
                camPosX: () => player.posX,
                camPosY: () => player.posY,
                next: () => dialogue.playDialogue(rollerDialogues[4])
            }),
            new DialogueBox({
                speakerName: "",
                text: [`Press N to use the hookshot.`],
                textSpeed: 1,
                camPosX: () => player.posX,
                camPosY: () => player.posY,
                next: () => dialogue.playDialogue(rollerDialogues[5])
            }),
            new DialogueBox({
                speakerName: "",
                text: [`Press E to interact/talk.`],
                textSpeed: 1,
                camPosX: () => player.posX,
                camPosY: () => player.posY,
                next: () => setScene("game")
            })
        ]
    } else {
        rollerDialogues = [
            new DialogueBox({
                speakerName: "",
                text: "Welcome to this build of ROLLER!",
                textSpeed: 1,
                camPosX: () => player.posX,
                camPosY: () => player.posY,
                next: () => dialogue.playDialogue(rollerDialogues[1])
            }),
            new DialogueBox({
                speakerName: "",
                text: "CONTROLS:",
                textSpeed: 1,
                camPosX: () => player.posX,
                camPosY: () => player.posY,
                next: () => dialogue.playDialogue(rollerDialogues[2])
            }),
            new DialogueBox({
                speakerName: "",
                text: `use the left half of the screen to move.`,
                textSpeed: 1,
                camPosX: () => player.posX,
                camPosY: () => player.posY,
                next: () => dialogue.playDialogue(rollerDialogues[3])
            }),
            new DialogueBox({
                speakerName: "",
                text: `use the right half of the screen to jump and use your active item.`,
                textSpeed: 1,
                camPosX: () => player.posX,
                camPosY: () => player.posY,
                next: () => dialogue.playDialogue(rollerDialogues[4])
            }),
            new DialogueBox({
                speakerName: "",
                text: `Press N to use the hookshot.`,
                textSpeed: 1,
                camPosX: () => player.posX,
                camPosY: () => player.posY,
                next: () => setScene("game")
            })
        ]
    }

    bogusDialogues = [
        new DialogueBox({
            speakerName: "B.O.G.U.S.",
            text: ["Ooh, heeey."],
            textSpeed: 1,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => dialogue.playDialogue(bogusDialogues[1])
        }),
        new DialogueBox({
            speakerName: "B.O.G.U.S.",
            text: ["You might be asking what a cool ro-bro go-getta", "funky-as-few mean-bean-bustin-machine such as", "myself is doing in a filthy test build."],
            textSpeed: 1,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => dialogue.playDialogue(bogusDialogues[2])
        }),
        new DialogueBox({
            speakerName: "B.O.G.U.S.",
            text: ["HAHAHA! How utterly STUPID of you."],
            textSpeed: 1,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => dialogue.playDialogue(bogusDialogues[3])
        }),
        new DialogueBox({
            speakerName: "B.O.G.U.S.",
            text: ["OBVIOUSLY, I'm here to add value to this", "otherwise worthless game."],
            textSpeed: 1,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => dialogue.playDialogue(bogusDialogues[4])
        }),
        new DialogueBox({
            speakerName: "B.O.G.U.S.",
            text: ["What would the developer do without me?"],
            textSpeed: 1,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => setScene("game")
        })
    ]
};