
class DialogueHandler {
    constructor() {



        this.currentDialogue;
        this.textBuffer = new String;
        this.displayedText = new String;
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

    update() {
        if (this.currentDialogue.text.length > this.textProg) this.textProg += this.currentDialogue.textSpeed;
    }

    draw() {
        render.rect(block(3), canvasHeight - block(4.5), canvasWidth - block(6), block(4), "#00408080", 0); // background
        render.text(this.currentDialogue.speakerName, block(3), canvasHeight - block(4.5), 12, "#fff", 0);
        render.text(this.currentDialogue.text.substr(0, this.textProg), block(4), canvasHeight - block(3.5), 16, "#fff");
        if (this.textProg >= this.currentDialogue.text.length) render.text(">", canvasWidth - block(4 - (Math.sin(gameClock / 5) / 4)), canvasHeight - block(1.5), 32);
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


const rollerDialogues = [
    new DialogueBox({
        speakerName: "Roll-3R",
        text: "This is a test message.",
        textSpeed: 1,
        camPosX: () => player.posX,
        camPosY: () => player.posY,
        next: () => dialogue.playDialogue(rollerDialogues[1])
    }),
    new DialogueBox({
        speakerName: "Roll-3R",
        text: "This is another test message.",
        textSpeed: 1,
        camPosX: () => player.posX - block(5),
        camPosY: () => player.posY,
        next: () => dialogue.playDialogue(rollerDialogues[2])
    }),
    new DialogueBox({
        speakerName: "Roll-3R",
        text: "Another one.",
        textSpeed: 1,
        camPosX: () => player.posX,
        camPosY: () => player.posY - block(10),
        next: () => dialogue.playDialogue(rollerDialogues[3])
    }),
    new DialogueBox({
        speakerName: "Roll-3R",
        text: "Another one.",
        textSpeed: 1,
        camPosX: () => player.posX + block(25),
        camPosY: () => player.posY - block(25),
        next: () => dialogue.playDialogue(rollerDialogues[4])
    }),
    new DialogueBox({
        speakerName: "Roll-3R",
        text: "Another one.",
        textSpeed: 1,
        camPosX: () => player.posX,
        camPosY: () => player.posY - block(10),
        next: () => setScene("game")
    })
]

const bogusDialogues = [
    new DialogueBox({
        speakerName: "B.O.G.U.S.",
        text: "Ooh, heeey.",
        textSpeed: 1,
        camPosX: () => player.posX,
        camPosY: () => player.posY,
        next: () => dialogue.playDialogue(bogusDialogues[1])
    }),
    new DialogueBox({
        speakerName: "B.O.G.U.S.",
        text: "You may be wondering what a cool robot like me is doing in a lame test build.",
        textSpeed: 1,
        camPosX: () => player.posX,
        camPosY: () => player.posY,
        next: () => dialogue.playDialogue(bogusDialogues[2])
    }),
    new DialogueBox({
        speakerName: "B.O.G.U.S.",
        text: "HAHAHA! How utterly stupid of you.",
        textSpeed: 1,
        camPosX: () => player.posX,
        camPosY: () => player.posY,
        next: () => dialogue.playDialogue(bogusDialogues[3])
    }),
    new DialogueBox({
        speakerName: "B.O.G.U.S.",
        text: "O b v i o u s l y, I'm here to add value to this otherwise worthless product.",
        textSpeed: 1,
        camPosX: () => player.posX,
        camPosY: () => player.posY,
        next: () => dialogue.playDialogue(bogusDialogues[4])
    }),
    new DialogueBox({
        speakerName: "B.O.G.U.S.",
        text: "What would the developer do without me?",
        textSpeed: 1,
        camPosX: () => player.posX,
        camPosY: () => player.posY,
        next: () => setScene("game")
    })
]