
class DialogueHandler {
    constructor() {



        this.currentDialogue;
        this.textBuffer = new String;
        this.displayedText = [];
        this.textProg = 0;
        document.addEventListener(input.binds.gameDialogue.next, () => {
            if (activeScene == "gameDialogue" && this.textProg >= this.msglength(this.currentDialogue.text.length)) dialogue.currentDialogue.next();
        })

        this.sprite = () => sprites.ui.dialogueBox;


        //TextBox draw variables
        this.tbX = canvasWidth / 16;
        this.tbY = canvasHeight - block(4.5);
        this.tbW = canvasWidth - (this.tbX * 2);
        this.tbH = block(4);


    };

    playDialogue(dlgObj) {
        setScene("gameDialogue");
        this.textProg = 0;
        this.currentDialogue = dlgObj;
    }

    end() {
        this.currentDialogue = new Object;
        setScene("game");
    }
    msglength(n) {
        var l = 0;
        for (var i = 0; i < n; i++) l += this.currentDialogue.text[i].length;
        return l;
    }

    update() {
        if (this.msglength(this.currentDialogue.text.length) > this.textProg) this.textProg += this.currentDialogue.textSpeed;
    }

    draw() {
        var tbR = this.tbX + this.tbW;
        var tbB = this.tbY + this.tbH;

        this.color1 = "#2ce8f5";
        this.color2 = "#0095e9";
        this.color3 = "#124e89";


        // background
        render.rect(this.tbX, this.tbY, this.tbW, this.tbH, "#002040c0", 0);

        //Speaker name.
        render.text(this.currentDialogue.speakerName, this.tbX, this.tbY, 1, "#fff", 0);

        //Border
        for (var x = 0; x < this.tbW; x += 32) {
            switch (x) {
                case 0: {
                    render.img(this.sprite().tl, this.tbX - block(1), this.tbY - block(1), 0, 2);

                    for (var y = 0; y < this.tbH; y += 32) {
                        render.img(this.sprite().ml, this.tbX - block(1), this.tbY + y, 0, 2);
                    }
                    render.img(this.sprite().bl, this.tbX - block(1), this.tbY + this.tbH, 0, 2);
                }
                case this.tbW: {
                    render.img(this.sprite().tr, this.tbX + this.tbW, this.tbY - block(1), 0, 2);
                    for (var y = 0; y < this.tbH; y += 32) {
                        render.img(this.sprite().mr, this.tbX + this.tbW, this.tbY + y, 0, 2);
                    }
                    render.img(this.sprite().br, this.tbX + this.tbW, this.tbY + this.tbH, 0, 2);
                }
                default: {
                    render.img(this.sprite().tm, this.tbX + x, this.tbY - block(1), 0, 2);
                    render.img(this.sprite().bm, this.tbX + x, this.tbY + this.tbH, 0, 2);
                }
            }
        }

        //dialogue message
        for (var i = 0; i < this.currentDialogue.text.length; i++) {
            render.text(this.currentDialogue.text[i].substr(0, this.textProg - this.msglength(i)), this.tbX + block(.75), this.tbY + block(.75) + block(i), 1, "#fff");
        }


        //next message symbol
        if (this.textProg >= this.msglength(this.currentDialogue.text.length)) render.text(">", tbR - block(1 - (Math.sin(gameClock / 5) / 4)), tbB - block(1), 1);
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
                text: ["Welcome to the [ROLLER] alpha!"],
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
                text: [`Press N to use your active item.`],
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
                text: ["Welcome to the [ROLLER] alpha!"],
                textSpeed: 1,
                camPosX: () => player.posX,
                camPosY: () => player.posY,
                next: () => dialogue.playDialogue(rollerDialogues[1])
            }),
            new DialogueBox({
                speakerName: "",
                text: ["CONTROLS:"],
                textSpeed: 1,
                camPosX: () => player.posX,
                camPosY: () => player.posY,
                next: () => dialogue.playDialogue(rollerDialogues[2])
            }),
            new DialogueBox({
                speakerName: "",
                text: ["Use the left half of the screen", "to move."],
                textSpeed: 1,
                camPosX: () => player.posX,
                camPosY: () => player.posY,
                next: () => dialogue.playDialogue(rollerDialogues[3])
            }),
            new DialogueBox({
                speakerName: "",
                text: ["Use the right half of the screen", "to jump and use your active item."],
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