
class DialogueHandler {
    constructor() {

        this.debugMsgs = [
            new DialogueBox({
                speakerName: "Roll-3R",
                text: "This is a test message.",
                textSpeed: 1,
                camPosX: () => player.posX,
                camPosY: () => player.posY,
                next: () => this.playDialogue(this.debugMsgs[1])
            }),
            new DialogueBox({
                speakerName: "Roll-3R",
                text: "This is another test message.",
                textSpeed: 1,
                camPosX: () => player.posX - block(5),
                camPosY: () => player.posY,
                next: () => this.playDialogue(this.debugMsgs[2])
            }),
            new DialogueBox({
                speakerName: "Roll-3R",
                text: "Another one.",
                textSpeed: 1,
                camPosX: () => player.posX,
                camPosY: () => player.posY - block(10),
                next: () => this.playDialogue(this.debugMsgs[3])
            }),
            new DialogueBox({
                speakerName: "Roll-3R",
                text: "Another one.",
                textSpeed: 1,
                camPosX: () => player.posX + block(25),
                camPosY: () => player.posY - block(25),
                next: () => this.playDialogue(this.debugMsgs[4])
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
