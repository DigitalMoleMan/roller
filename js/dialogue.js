
class DialogueHandler {
    constructor() {

        this.debugMsgs = [
            new DialogueBox({
                speakerName: "yee",
                text: "haw",
                camPosX: () => player.posX,
                camPosY: () => player.posY,
                next: () => dialogue.playDialogue(dialogue.debugMsgs[1])
            }), 
            new DialogueBox({
                speakerName: "Roll-3R",
                text: "This is another test message.",
                camPosX: () => player.posX - block(5),
                camPosY: () => player.posY,
                next: () => dialogue.playDialogue(dialogue.debugMsgs[2])
            }), 
            new DialogueBox({
                speakerName: "Roll-3R",
                text: "Another one.",
                camPosX: () => player.posX,
                camPosY: () => player.posY - block(10),
                next: () => dialogue.playDialogue(dialogue.debugMsgs[3])
            }), 
            new DialogueBox({
                speakerName: "Roll-3R",
                text: "Another one.",
                camPosX: () => player.posX + block(25),
                camPosY: () => player.posY - block(25),
                next: () => dialogue.playDialogue(dialogue.debugMsgs[4])
            }), 
            new DialogueBox({
                speakerName: "Roll-3R",
                text: "Another one.",
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
            if(activeScene == "gameDialogue") dialogue.currentDialogue.next();
        })
    };

    playDialogue(dlgObj) {
        setScene("gameDialogue");
        this.textProg = 0;
        this.currentDialogue = dlgObj;

        this.displayedText = "";
    }

    update() {
        var tl = this.currentDialogue.text.length;
        if (tl > this.textProg) {
            this.displayedText += this.currentDialogue.text[this.textProg];
            this.textProg++;
        }
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
        speakerName: undefined,
        text: undefined,
        camPosX: () => player.posX,
        camPosY: () => player.posY,
        next: () => setScene("game"),
        textSpeed: 1,
    }){
        this.options = options;
            this.speakerName = options.speakerName;
            this.text = options.text;
            this.textSpeed = options.textSpeed;
            this.camPosX = () => options.camPosX();
            this.camPosY = () => options.camPosY();
            this.next = () => options.next();
    }
}
