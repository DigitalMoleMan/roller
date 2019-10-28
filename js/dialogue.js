
class DialogueHandler {
    constructor() {



        this.currentDialogue;
        this.textBuffer = new String;
        this.displayedText = [];
        this.textProg = 0;

        this.hide = false;

        this.sfx = () => sfx.ui.dialogue;
        
        document.addEventListener(input.binds.gameDialogue.next, () => {
            if (activeScene == "gameDialogue" && this.textProg >= this.msglength(this.currentDialogue.text.length)) {
                dialogue.currentDialogue.next();
            }
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
        this.hide = false;
        this.sfx().next.volume = .5;
        playSound(this.sfx().next);
        this.textProg = 0;
        this.currentDialogue = dlgObj;
    }

    end() {
        setScene("game");
        this.currentDialogue = new Object;
    }
    msglength(n) {
        var l = 0;
        for (let i = 0; i < n; i++) l += this.currentDialogue.text[i].length;
        return l;
    }

    update() {
        if (this.msglength(this.currentDialogue.text.length) > this.textProg) this.textProg += this.currentDialogue.textSpeed;
    }

    draw() {
        if (!this.hide) {
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
                            //render.rect(this.tbX - block(1), this.tbY + y, 2, 32, "#2ce8f5");
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
                if (this.currentDialogue.text[i][this.textProg - this.msglength(i) - 1] !== ' ' && this.msglength(this.currentDialogue.text.length) !== this.textProg) {
                    playSound(this.sfx().text)
                } else if(!this.sfx().paused) stopSound(this.sfx().text);   
            }

            //next message symbol
            if (this.textProg >= this.msglength(this.currentDialogue.text.length)) render.text(">", tbR - block(1 - (Math.sin(gameClock / 5) / 4)), tbB - block(1), 1);
        }
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
        if (settings.misc.halloweenMode) {
            rollerDialogues = [
                new DialogueBox({
                    speakerName: "",
                    text: ["Welcome to the ROLLER alpha!", "- Now with 60% more spook!"],
                    textSpeed: 1,
                    camPosX: () => player.posX,
                    camPosY: () => player.posY,
                    next: () => dialogue.playDialogue(rollerDialogues[1])
                }),
                new DialogueBox({
                    speakerName: "",
                    text: ["Controls:"],
                    textSpeed: 1,
                    camPosX: () => player.posX,
                    camPosY: () => player.posY,
                    next: () => dialogue.playDialogue(rollerDialogues[2])
                }),
                new DialogueBox({
                    speakerName: "",
                    text: [`Move left and right using the arrow keys.`],
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
                    text: [`Press D to use your active item.`],
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
        } else
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
                    text: ["Controls:"],
                    textSpeed: 1,
                    camPosX: () => player.posX,
                    camPosY: () => player.posY,
                    next: () => dialogue.playDialogue(rollerDialogues[2])
                }),
                new DialogueBox({
                    speakerName: "",
                    text: [`Move left and right using the arrow keys.`],
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
                    next: () => dialogue.end()
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
                next: () => dialogue.end()
            })
        ]
    }

    bogusDialogues = [
        new DialogueBox({
            speakerName: "B.O.G.U.S.",
            text: ["Ooh, heeey."],
            textSpeed: .25,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => dialogue.playDialogue(bogusDialogues[1])
        }),
        new DialogueBox({
            speakerName: "B.O.G.U.S.",
            text: ["You might be wondering what a cool, ro-bro go-getta", "funky-as-few mean-bean-bustin-machine such as", "myself is doing in a filthy test build."],
            textSpeed: 1,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => dialogue.playDialogue(bogusDialogues[2])
        }),
        new DialogueBox({
            speakerName: "B.O.G.U.S.",
            text: ["HAHAHA! How utterly STUPID of you."],
            textSpeed: 2,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => dialogue.playDialogue(bogusDialogues[3])
        }),
        new DialogueBox({
            speakerName: "B.O.G.U.S.",
            text: ["OBVIOUSLY, I'm here to add value to this", "otherwise worthless game."],
            textSpeed: .5,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => dialogue.playDialogue(bogusDialogues[4])
        }),
        new DialogueBox({
            speakerName: "B.O.G.U.S.",
            text: ["What would the developer do without me?"],
            textSpeed: .5,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => dialogue.end()
        }),
        new DialogueBox({
            speakerName: "B.O.G.U.S.",
            text: ["WOAAH, A GHOST!"],
            textSpeed: .5,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => {
                dialogue.playDialogue(bogusDialogues[6])
            }
        }),
        new DialogueBox({
            speakerName: "B.O.G.U.S.",
            text: ["Knew I should have brought a vaccum cleaner!", "Hey! Wait a minute, it's just you..."],
            textSpeed: .5,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => {
                dialogue.playDialogue(bogusDialogues[7])
            }
        }),
        new DialogueBox({
            speakerName: "B.O.G.U.S.",
            text: ["Why are you wearing that lame costume?", "Is it halloween or somethin'?", "Oh, thats right! it is! But that means..."],
            textSpeed: .5,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => {
                if (!dialogue.hide) {
                    stopSound(musicPlayer);
                    world.npcs[0].performHalloweenTransformation();
                }
            }
        }),
        new DialogueBox({
            speakerName: "?",
            text: ["WAH HA HA!", "I'm here to ruin your day!"],
            textSpeed: .25,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => {
                dialogue.playDialogue(bogusDialogues[9])
            }
        }),
        new DialogueBox({
            speakerName: "?",
            text: ["Who am I?"],
            textSpeed: .5,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => {
                dialogue.playDialogue(bogusDialogues[10])
                // setScene("game")
            }
        }),
        new DialogueBox({
            speakerName: "?",
            text: ["Well. I am"],
            textSpeed: .5,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => {
                dialogue.playDialogue(bogusDialogues[11])
                //setScene("game")
            }
        }),
        new DialogueBox({
            speakerName: "?",
            text: ["B.O.O.G.U.S, the scariest robot in the world!"],
            textSpeed: .25,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => {
                dialogue.playDialogue(bogusDialogues[12])
                //setScene("game")
            }
        }),
        new DialogueBox({
            speakerName: "B.O.O.G.U.S.",
            text: ["They call me that because I curse people!", "And now, I have put a curse on YOU!", "From now on, you won't be able to take a shower!"],
            textSpeed: .5,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => {
                dialogue.playDialogue(bogusDialogues[13])
                //setScene("game")
            }
        }),
        new DialogueBox({
            speakerName: "B.O.O.G.U.S.",
            text: ["WAH HA HA HA! So delightfully evil!", "The only way to undo my curse is to collect 10 candies."],
            textSpeed: .5,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => {
                dialogue.playDialogue(bogusDialogues[14])
                //setScene("game")
            }
        }),
        new DialogueBox({
            speakerName: "B.O.O.G.U.S.",
            text: ["But that definitely won't happen", "since there definitely are no candies in", "the rooms up ahead!"],
            textSpeed: .5,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => {
                dialogue.playDialogue(bogusDialogues[15])
                //setScene("game")
            }
        }),
        new DialogueBox({
            speakerName: "B.O.O.G.U.S.",
            text: ["Smell you later you stinky sod!"],
            textSpeed: .5,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => {
                //dialogue.playDialogue(bogusDialogues[14])
                playMusic(14);
                hwQuest.started = true;
                dialogue.end();
            }
        }),
        new DialogueBox({
            speakerName: "B.O.O.G.U.S.",
            text: ["Smell you later you stinky sod!"],
            textSpeed: .5,
            camPosX: () => player.posX,
            camPosY: () => player.posY,
            next: () => {
                dialogue.end();
            }
        })
    ]
};
