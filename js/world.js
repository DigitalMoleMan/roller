block = (n = 1) => n * 32;

var worldMemory = [];


class World {
    constructor() {
        this.spawn = {};

        this.tiles = [];
        this.npcs = [];

        this.segments = [];


        //this.inRangeActors = [];

        document.addEventListener(input.binds.game.interact, () => {
            if (activeScene == "game") this.interaction();
        })

    }

    interaction() {
        if (this.inRangeActors.length > 0) this.inRangeActors[0].onInteract();
    }

    loadLevel(lvl) {
        this.ready = false;

        this.width = block(lvl.layout[0].length);
        this.height = block(lvl.layout.length);

        this.tiles = [];
        this.npcs = [];
        this.lightSources = [];

        for (let y = 0; y < lvl.layout.length; y++) {
            for (let x = 0; x < lvl.layout[y].length; x++) {
                let tile = lvl.layout[y][x];
                switch (tile) {
                    case '@': {
                        this.spawn.x = block(x) + 16;
                        this.spawn.y = block(y) + 16;
                        break;
                    }
                    case 'X': this.tiles.push(new Block(block(x), block(y), 'metal')); break;
                    case 'D': this.tiles.push(new Block(block(x), block(y), 'dirt')); break
                    case '-': this.tiles.push(new Platform(block(x), block(y))); break
                    case '^': this.tiles.push(new Elevator(block(x), block(y), 0, 1, 64)); break;
                    case 'v': this.tiles.push(new Elevator(block(x), block(y), 0, 1, -64)); break;
                    case '<': this.tiles.push(new Elevator(block(x), block(y), 1, 0, 64)); break;
                    case '>': this.tiles.push(new Elevator(block(x), block(y), 1, 0, -64)); break;
                    case 'M': this.tiles.push(new Spikes(block(x), block(y), 'up')); break;
                    case 'W': this.tiles.push(new Spikes(block(x), block(y), 'down')); break;
                    case 'G': this.tiles.push(new Hookpoint(block(x), block(y))); break;
                    case 'L': this.tiles.push({
                        x: block(x + .25),
                        y: block(y),
                        width: block(0),
                        height: block(0),
                        type: tile,
                        update: () => {
                            this.lightSources.push(new Light(block(x + .5), block(y + .1), 0, 455, 460, [{
                                index: 0,
                                color: "#ffc04040"
                            }, {
                                index: 1,
                                color: "#00000000"
                            }]));
                        },
                        draw: () => { },
                    }); break;
                    case 'P': this.tiles.push(new Pumpkin(block(x), block(y))); break;
                    case 'C': this.tiles.push(new Candy(block(x), block(y))); break;

                }
            }
        }

        for (let tile of lvl.advancedLayer) {
            if (tile.type == 'door') tile.update = () => { }
            this.tiles.push(tile);
        }

        this.npcs = lvl.npcs
        this.segments = this.tiles.filter(tile => tile.type !== 'hookpoint');
        this.segments.push(
            new Barrier(block(-1.75), block(-1.75), block(1), this.height + block(3.5)),
            new Barrier(this.width + block(.75), block(-1), block(1), this.height + block(3.5)),
            new Barrier(block(-1.75), block(-1.75), this.width + block(3.5), block(1)),
            new Barrier(block(-1.75), this.height + block(.75), this.width + block(3.5), block(1)),
        );
        this.createMesh();

        this.tiles = this.tiles.filter((tile) => tile.type !== 'block');

    }

    update() {
        this.lightSources = [];

        for (let tile of this.tiles) tile.update()
        for (let npc of this.npcs) npc.update();

        this.inRangeActors = this.npcs.filter((npc) => (
            //npc.type == "actor" &&
            player.posX > (npc.posX) &&
            player.posX < (npc.posX + npc.interactionRadius) &&
            player.posY > (npc.posY) &&
            player.posY < (npc.posY + npc.interactionRadius)));
    }

    createMesh() {

        let nSeg = [];

        this.segments = this.segments.sort((a, b) => {
            if (a.y < b.y) return -1;
        });


        let last = () => nSeg[nSeg.length - 1];
        for (let tile of this.segments) {
            if (nSeg.length > 0
                && (tile.type + tile.style) === (last().type + last().style)
                && tile.x == (last().x + last().width)
                && tile.y == last().y
                && tile.type !== "elevator") {
                last().width += tile.width;
            } else nSeg.push(tile)
        }

        this.segments = nSeg.sort((a, b) => {
            if (browser == 'firefox') {
                if (a.x < b.x) return 1
                return -1
            }
            if (a.x < b.x) return -1
            return 1
        });

        nSeg = [];

        for (let seg of this.segments) {
            if (nSeg.length > 0
                && (seg.type + seg.style) === (last().type + last().style)
                && seg.y == (last().y + last().height)
                && seg.x == last().x
                && seg.width == last().width) {
                last().height += seg.height;
            } else nSeg.push(seg)
        }

        this.segments = nSeg.sort((a, b) => {
            if (a.x < b.x) return -1;
            if (a.x == b.x) return 0;
            if (a.x > b.x) return 1;
        })

        this.buildTextures();

    }

    buildTextures() {
        let blockSegments = this.segments.filter((seg) => seg.type == 'block').sort((a, b) => {
            if (a.y < b.y) return -1;
        });
        //console.log(blockSegments);

        for (let segment of blockSegments) {
            try {
                let canvas = document.createElement('canvas')
                canvas.width = segment.width;
                canvas.height = segment.height;
                let ctx = canvas.getContext("2d")
                ctx.imageSmoothingEnabled = false;
                ctx.scale(2, 2);

                //console.log(segment)

                let sprite = sprites.tiles[segment.type][segment.style]
                let alteration = sprites.tiles[segment.type]['alt_' + segment.style]


                for (let y = 0; y < segment.height; y += 16) {
                    for (let x = 0; x < segment.width; x += 16) {
                        let dIndex = 0;
                        if (segment.width > 32) {
                            if (segment.height > 32) switch (y) {
                                case 0: switch (x) {
                                    case 0: dIndex = 1; break;
                                    case (segment.width / 2) - 16: dIndex = 3; break;
                                    default: dIndex = 2;
                                } break;
                                case (segment.height / 2) - 16: switch (x) {
                                    case 0: dIndex = 7; break;
                                    case (segment.width / 2) - 16: dIndex = 9; break;
                                    default: dIndex = 8;
                                } break;
                                default: switch (x) {
                                    case 0: dIndex = 4; break;
                                    case (segment.width / 2) - 16: dIndex = 6; break;
                                    default: dIndex = 5
                                } break;
                            } else switch (x) {
                                case 0: dIndex = 13; break;
                                case (segment.width / 2) - 16: dIndex = 15; break;
                                default: dIndex = 14;
                            }
                        } else if (segment.height > 32) switch (y) {
                            case 0: dIndex = 10; break;
                            case (segment.height / 2) - 16: dIndex = 12; break;
                            default: dIndex = 11;
                        } else dIndex = 0;



                        if (segment.width > 32 && x == 0 && segment.x == 0) dIndex++
                        if (segment.width > 32 && x == (segment.width / 2) - 16 && (segment.x + segment.width) == world.width) dIndex--;
                        if (segment.height > 32 && y == 0 && segment.y == 0) dIndex += 3;
                        if (segment.height > 32 && y == (segment.height / 2) - 16 && segment.y + segment.height == world.height) dIndex -= 3;

                        ctx.drawImage(sprite.source, sprite.sourceWidth * dIndex, 0, sprite.sourceWidth, sprite.sourceHeight, x, y, 16, 16);
                        if ((Math.random() * 20) < 1) ctx.drawImage(alteration[dIndex], x, y);


                    }


                }



                try {

                    Promise.all([createImageBitmap(canvas, 0, 0, segment.width, segment.height)]).then((map) => segment.bitmap = map[0]);
                } catch (error) {
                    console.log(sprite);
                    console.log("Failed to call createImageBitmap() - Fallback to canvas.toDataURL()");
                    segment.bitmap = new Image();
                    segment.bitmap.src = canvas.toDataURL();
                }


            } catch {

            }
        }

    }
}



const level = [
    {
        name: "The Well",
        layout: [
            "XXXXX--XXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX  XXXXXXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X    --    XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X--        XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X       ---XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X---       XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X    --    XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X        --XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X--        XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X    --    XX        XXXXXXXXXXX",
            "X          XX  XXXX  XXXXXXXXXXX",
            "X          XX  XXXX           XX",
            "X          XX  XXXXXXXXX      XX",
            "X       ---XX  XXXXXXXXX    @ XX",
            "X          XX  XXXXXXXXXXXXXXXXX",
            "X          XX  XXXXXXXXXXXXXXXXX",
            "X---       XX  XXXXXXXXXXXXXXXXX",
            "X              XXXXXXXXXXXXXXXXX",
            "X              XXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        ],
        advancedLayer: [
            {
                type: "door",
                x: block(5),
                y: block(0),
                width: block(2),
                height: block(0),
                entry: block(1),
                exit: 1,
                exitX: block(6),
                exitY: block(81.5),
                draw: () => { }
            },
        ],
        npcs: [
            //new SpikeGuard(block(3), block(15)),
        ]
    }, {
        name: "Toybox",
        layout: [

            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X      G                G                                   G          X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "                                                                        ",
            "X-            XXX               >>           <<   XXX               XXXX",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                    G                 G                               X",
            "X                                                                      X",
            "X                                                        XXXXXX        X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "XXXXXXXXXX                   XXX                      G                X",
            "X        X                    L                                        X",
            "X                                                                      X",
            "X     vv                                                               X",
            "X        XXXXXXXXXXXXXX                                                X",
            "X        X            X                        G                       X",
            "X    MMMMX            X                                                X",
            "X    XXXXX                                                             X",
            "X                                                                      X",
            "X                                                                      X",
            "XXXXXXXXXXXXXMMMMMMXXXX      XXXXXXXXXXX                     XXX-------X",
            "XXXXXXXXXXXXXXXXXXXXXXX        G     G                        G        X",
            "XX             L    X                                                  X",
            "XX                  X                                                  X",
            "XX                  X  ^^vv                                            X",
            "XX    vv                                                               X",
            "XX       XXX                                                           X",
            "XX       XXX                                                           X",
            "XX       XXX >>     XXXMMMMXXX                     XXX                 X",
            "XX       XXX        XXXXXXXXXX---   ---X                               X",
            "XX       XXX        XXXXXXXXXX         X     XX                        X",
            "XX       XXX        X        X         X     XX                        X",
            "XX                  X        X         X     XX                        X",
            "XX ^^               X    @   X   ---   X                               X",
            "                    X   XX                                              ",
            "                       XXXX                                             ",
            "XXXXX--XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        ],
        advancedLayer: [
            {
                type: "door",
                x: block(0),
                y: block(80),
                width: block(0),
                height: block(2),
                entry: block(1),
                exit: 2,
                exitX: block(81.5),
                exitY: block(9.5),
                draw: () => { }
            }, {
                type: "door",
                x: block(72),
                y: block(80),
                width: block(0),
                height: block(2),
                entry: block(1),
                exit: 3,
                exitX: block(.5),
                exitY: block(10.5),
                draw: () => { }
            }, {
                type: "door",
                x: block(72.5),
                y: block(5),
                width: block(0),
                height: block(2),
                entry: block(1),
                exit: 5,
                exitX: block(.5),
                exitY: block(1.5),
                draw: () => { }
            },
            {
                type: "door",
                x: block(-.5),
                y: block(5),
                width: block(0),
                height: block(1),
                entry: block(1),
                exit: 6,
                exitX: block(42),
                exitY: block(6.5),
                draw: () => { }
            }
        ],
        npcs: [
            //new TestSign(5, 90, () => dialogue.debugMsgs[0]),
            new Bogus(block(30), block(79), () => dialogue.playDialogue(bogusDialogues[0])), //block(20), block(20)),
            //new LaserTurret(block(20), block()),
            //new Roamer(block(40), block(81.5))
            new SpikeGuard(block(50), block(76)),
        ]
    }, {
        name: "GA-19",
        layout: [
            "X                                                                                X",
            "X                                                                                X",
            "X                                                                                X",
            "X                                                                                X",
            "X                                                                                X",
            "X                                                                                X",
            "X                                                                                X",
            "X                                                                                X",
            "X                                                                                 ",
            "X                                                                                 ",
            "X                             X----XXXX  >>        <<  XXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                             X    XXXX                XXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                             X    XXXXMMMMMMMMMMMMMMMMXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                             X----XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                                  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X        @                         XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXMMMMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        ],
        advancedLayer: [
            {
                type: "door",
                x: block(82.5),
                y: block(8),
                width: block(0),
                height: block(2),
                entry: block(1),
                exit: 1,
                exitX: block(.5),
                exitY: block(81.5),
                draw: () => { }
            }
        ],
        npcs: []
    }, {
        name: "MNKO Swinging Course - Hall",
        layout: [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                               XXX                                                             XXX",
            "X                               XXX                                                             XXX",
            "X            G                  XXX                                                             XXX",
            "X                               XXX                G                                            XXX",
            "X                               XXX                                                             XXX",
            "X                               XXX                                                 XXXXXXXXX   XXX",
            "X                               XXX                                                 XXXWWWWG    XXX",
            "X                               XXX                                                 XXX         XXX",
            "                       XXXXXX   XXX                            G            G       XXX         XXX",
            "  @                    XXXXXX   XXX   XXXXXX                                        XXX         XXX",
            "XXXX                   XXXXXX    G    XXXXXX                                        XXX         XXX",
            "XXXX                   XXXXXX         XXXXXX                                        XXX   MMMMMMXXX",
            "XXXX                   XXXXXX         XXXXXX                                        XXX   XXXXXXXXX",
            "XXXX                   XXXXXX         XXXXXX                                        XXX            ",
            "XXXX                   XXXXXX         XXXXXX                                        XXX            ",
            "XXXX                   XXXXXX         XXXXXX                                        XXX            ",
            "XXXXMMMMMMMMMMMMMMMMMMMXXXXXXMMMMMMMMMXXXXXXMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMXXXXXXXXXXXXXXX",
        ],
        advancedLayer: [
            {
                type: "door",
                x: block(0),
                y: block(11),
                width: block(0),
                height: block(2),
                exit: 1,
                exitX: block(71.5),
                exitY: block(81.5),
                draw: () => { }
            }, {
                type: "door",
                x: block(99.5),
                y: block(15),
                width: block(0),
                height: block(3),
                exit: 4,
                exitX: block(0),
                exitY: block(53.5),
                draw: () => { }
            }
        ],
        npcs: []
    }, {
        name: "MNKO Swinging Course - Tower",
        layout: [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "    XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXX XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXX XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXX XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXX         G      G         XXX",
            "XXXXXXX                  XXX-XXX",
            "XXXXXXX                  XXX XXX",
            "XXXXXXX                  XXX XXX",
            "XXXXXXX                  XXX-XXX",
            "XXXXXXX                  XXX XXX",
            "XXXXXXX                  XXX XXX",
            "XXXXXXXMMMMMMMMMMMMMMMMMMXXX-XXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXX XXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXX XXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXX-XXX",
            "XXXXXXX                  XXX XXX",
            "XXXXXXX                  XXX XXX",
            "XXXXXXX                  XXX-XXX",
            "XXXXXXX                  XXX XXX",
            "XXXXXXX                      XXX",
            "XXXXXXX     XXX       XXXXXXXXXX",
            "XXXXXXX     XXXMMMMMMMXXXXXXXXXX",
            "XXXXXXX     XXXXXXXXXXXXXXXXXXXX",
            "XXXXXXX     XXXXXXXXXXXXXXXXXXXX",
            "XXXXXXX     XXXXXXXXXXXXXXXXXXXX",
            "XXXXXXX     WWWWWWWWWWWWWXXXXXXX",
            "XXXXXXX         G        XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXXMMMMMMMMMMMMM     XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXX",
            "XXXXXXXWWWWWWWWWWWWW     XXXXXXX",
            "XXXXXXX         G        XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "                         XXXXXXX",
            "                         XXXXXXX",
            "        @                XXXXXXX",
            "XXXXXXX---               XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXXMMMMMMMMMMMMMMMMMMXXXXXXX",
        ],
        advancedLayer: [{
            type: "door",
            x: block(-.5),
            y: block(51),
            width: block(0),
            height: block(3),
            exit: 3,
            exitX: block(98.5),
            exitY: block(16.5),
            draw: () => { }
        },
        {
            type: "door",
            x: block(-.5),
            y: block(1),
            width: block(0),
            height: block(1),
            exit: 5,
            exitX: block(42.5),
            exitY: block(1.5),
            draw: () => { }
        }

        ],
        npcs: [
            //new SpikeGuard(block(10), block(10)),
        ]
    }, {
        name: "MNKO Swinging Course - Vents",
        layout: [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "                                         @ ",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        ],
        advancedLayer: [{
            type: "door",
            x: block(43.5),
            y: block(1),
            width: block(0),
            height: block(1),
            exit: 4,
            exitX: block(0),
            exitY: block(1.5),
            draw: () => { }
        }, {
            type: "door",
            x: block(-.5),
            y: block(1),
            width: block(0),
            height: block(1),
            exit: 1,
            exitX: block(71),
            exitY: block(5.5),
            draw: () => { }
        },],
        npcs: []
    },
    {
        name: "GA-19 - Vents",
        layout: [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXX                                    XXX",
            "XXX                                    XXX",
            "XXX                                    XXX",
            "XXX                                    XXX",
            "XXX                                    XXX",
            "XXX   XXX                        XXX   XXX",
            "XXX   XXX       XXX     XXX      XXX   XXX",
            "X                                       @ ",
            "XXXXXXMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMXXXXXX",
        ],
        advancedLayer: [{
            type: "door",
            x: block(42.5),
            y: block(8),
            width: block(0),
            height: block(1),
            exit: 1,
            exitX: block(0),
            exitY: block(5.5),
            draw: () => { }
        }],
        npcs: [
            new SpikeGuard(block(21.5), block(10)),

        ]
    }, {
        name: "Adv Layer Testing",
        layout: [
            "X                              X",
            "X                              X",
            "X                              X",
            "X                              X",
            "X                     G        X",
            "X                              X",
            "X                              X",
            "X  XXXXXXXXXXXXX               X",
            "X                              X",
            "X                              X",
            "X    G                         X",
            "X                              X",
            "X                              X",
            "X  XXXXX                       X",
            "X                              X",
            "X                              X",
            "X     @                        X",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        ],
        advancedLayer: [],
        npcs: []
    }, {
        name: "Light Test",
        layout: [
            "                                                                                      ",
            "                                          L                                           ",
            "                                                                                      ",
            "                                                                                      ",
            "                                                                                      ",
            "                                                                                      ",
            "                                                                                      ",
            "                                                                                      ",
            "                                                                                      ",
            "                                                                                      ",
            "                                                                                      ",
            "                                      ---------------                                 ",
            "                                                                                      ",
            "                                                                                      ",
            "                                      ---------------                                 ",
            " @                                                                                    ",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        ],
        advancedLayer: [],
        npcs: []
    }, {
        name: "Outside Hall of Ween",
        layout: [

            "                               XXXXXXXXX",
            "                               XXXXXXXXX",
            "                               XXXXXXXXX",
            "                               XXXXXXXXX",
            "                               XXXXXXXXX",
            "                               XXXXXXXXX",
            "                               XXXXXXXXX",
            "                               XXXXXXXXX",
            "                               XXXXXXXXX",
            "                               XXXXXXXXX",
            "                               XXXXXXXXX",
            "                                 XXXXXXX",
            "                                 XXXXXXX",
            "                                        ",
            "                                        ",
            "                            XXXXXXXXXXXX",
            "                            XXXXXXXXXXXX",
            "                          XXXXXXXXXXXXXX",
            "                          XXXXXXXXXXXXXX",
            "                        XXXXXXXXXXXXXXXX",
            "                  @     XXXXXXXXXXXXXXXX",
            "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
            "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
        ],
        advancedLayer: [
            {
                type: "door",
                x: block(40.5),
                y: block(13),
                width: block(0),
                height: block(2),
                exit: 10,
                exitX: block(0),
                exitY: block(9.5),
                draw: () => { }
            }
        ],
        npcs: []
    }, {
        name: "The Hall of Ween",
        layout: [

            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX       XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX         XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XX                                                               XX",
            "XX                                                               XX",
            "                                                                 PP",
            "@                                                                PP",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
            "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
        ],
        advancedLayer: [
            {
                type: "door",
                x: block(-.5),
                y: block(8),
                width: block(0),
                height: block(2),
                exit: 9,
                exitX: block(40),
                exitY: block(14.5),
                draw: () => { }
            },
            {
                type: "door",
                x: block(67),
                y: block(8),
                width: block(0),
                height: block(2),
                exit: 11,
                exitX: block(0),
                exitY: block(17.5),
                draw: () => { }
            }
        ],
        npcs: [
            //new TestSign(5, 90, () => dialogue.debugMsgs[0]),
            new Bogus(block(32), block(7), () => dialogue.playDialogue(bogusDialogues[5])) //block(20), block(20)),
            // new LaserTurret(block(20), block(31)),
            //new Roamer(30, 31)
        ]
    }, {
        name: "Halloween challenge 1",
        layout: [
            "XX                                                               XX",
            "XX                                                               XX",
            "XX                                                               XX",
            "XX                                                               XX",
            "XX                                                               XX",
            "XX                                                               XX",
            "XX                                                               XX",
            "XX                                                               XX",
            "XX                                                               XX",
            "XX                                                               XX",
            "XX                                                               XX",
            "XX                                      G                        XX",
            "XX                                                                 ",
            "XX         XXXXX                                                   ",
            "XX         XXXXX                                             XXXXXX",
            "XX         XXXXX                                  C          XXXXXX",
            "         --XXXXX--           --XXX--              --XXX          XX",
            "@          XXXXX     M C M     XXX                  XXX          XX",
            "XXXX       XXXXX     XXXXX     XXX                               XX",
            "XXXX       WWWWW               XXX                               XX",
            "XXXX                           XXX                               XX",
            "XXXXX                          XXX                               XX",
            "XXXXX                          XXX                               XX",
            "XXXXXMMMMMMMMMMMMMMMMMMMMMMMMMMXXXMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMXX",
            "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
            "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
        ],
        advancedLayer: [
            {
                type: "door",
                x: block(-.5),
                y: block(16),
                width: block(0),
                height: block(2),
                exit: 10,
                exitX: block(66.5),
                exitY: block(9.5),
                draw: () => { }
            },
            {
                type: "door",
                x: block(67.5),
                y: block(12),
                width: block(0),
                height: block(2),
                exit: 12,
                exitX: block(0),
                exitY: block(12.5),
                draw: () => { }
            }

        ],
        npcs: [
            new HalloweenSign(block(13), block(12), () => dialogue.playDialogue(hwSigns[0])),
            new HalloweenSign(block(32), block(15), () => dialogue.playDialogue(hwSigns[1])),
            new HalloweenSign(block(53), block(15), () => dialogue.playDialogue(hwSigns[2]))
        ]
    }, {
        name: "Halloween challenge 2",
        layout: [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXX  --XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXX    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXX                 XX    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXX                 XX    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXX    C            XX--  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXX                 XX    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXX                 XX    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXX                 XX    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXX                 XX  --XXXXXXXGXXXXXXXXXXGXXXXXXXXXXXXXXXXX",
            "XXXXX      XXX           XX                                      XX",
            "XXXXX G    XXX           XX                                      XX",
            "XXXXX      XXX     G     XX                                      XX",
            "           XXX           XX--                                    XX",
            "@          XXX           XX                                      XX",
            "XXXXXXXX   XXX           XX     C                                XX",
            "XXXXXXXX   XXX           XX    ---                    XX---------XX",
            "XXXXXXXXMMMXXX                                                   XX",
            "XXXXXXXXXXXXXX                                   C               XX",
            "XXXXXXXXXXXXXX                                                   XX",
            "XXXXXXXXXXXXXX                                               ----XX",
            "XXXXXXXXXXXXXX                                                   XX",
            "XXXXXXXXXXXXXX                                                   XX",
            "XXXXXXXXXXXXXX                  >>         XX         XX         XX",
            "XXXXXXXXXXXXXXMMMMDDDMMMMMMDDMMMMMMMMMMMMMMXXMMMMMMMMMXXMMMMMMMMMXX",
            "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
            "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
        ],
        advancedLayer: [
            {
                type: "door",
                x: block(-.5),
                y: block(12),
                width: block(0),
                height: block(2),
                exit: 11,
                exitX: block(67),
                exitY: block(12.5),
                draw: () => { }
            },
            {
                type: "door",
                x: block(27),
                y: block(-.5),
                width: block(4),
                height: block(0),
                exit: 13,
                exitX: block(30),
                exitY: block(23.5),
                draw: () => { }
            }

        ],
        npcs: [
        ]
    },
    {
        name: "Halloween challenge 3",
        layout: [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXX                                                  XX",
            "XXXXXXXXXXXXXXX                                                  XX",
            "XXXXXXXXXXXXXXX  C                                               XX",
            "XXXXXXXXXXXXXXX                                                  XX",
            "XXXXXXXXXXXXXXX                                                  XX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXXXX   >>           <<      C      XX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXXXXMMMMMMMMMMMMMMMMMMMMMMMXXX     XX",
            "XXXXXXXXXXXXXXXGXXXX     XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX     XX",
            "XXXXX                          XXXXXXXXXXXXXXXXXXXXXXXXXXXXX--   XX",
            "XXXXX                          XXXXXXXXXXXXXXXXXXXXXXXXXXXXX       ",
            "XXXXX                          XXXXXXXXXXXXXXXXXXXXXXXXXXXXX       ",
            "XXXXX                          XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX-----                     XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX                          XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX                          XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX                          XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX-----                     XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX                          XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX                          XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX  C                       XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXX--  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXX    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXX  @ XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXX  --XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        ],
        advancedLayer: [
            {
                type: "door",
                x: block(27),
                y: block(26),
                width: block(4),
                height: block(0),
                exit: 12,
                exitX: block(28),
                exitY: block(0),
                draw: () => { }
            },
            {
                type: "door",
                x: block(67.5),
                y: block(11),
                width: block(0),
                height: block(2),
                exit: 14,
                exitX: block(0),
                exitY: block(12.5),
                draw: () => { }
            }

        ],
        npcs: [
            new SpikeGuard(block(14.5), block(21)),
            //new SpikeGuard(block(21), block(10)),
        ]
    },
    {
        name: "Halloween challenge 4",
        layout: [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX                 C  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX        XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX       XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX      XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX     XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "             XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "@             XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXX       XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXX       XXXXXXXXXXXXXXGXXXXXGXXXXXGXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXX                                          XXXXXXXXXXXXXXX",
            "XXXXXXXXXXX                                         XXXXXXXXXXXXXXX",
            "XXXXXXXXXXXX                                        XXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXX                        C  XXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXX                      -----XXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXX                           XXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXX                           XXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXX                           XXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXMMMMMMMMMMMMMMMMMMMMMMMMMMMXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        ],
        advancedLayer: [
            {
                type: "door",
                x: block(-.5),
                y: block(11),
                width: block(0),
                height: block(2),
                exit: 13,
                exitX: block(67),
                exitY: block(12.5),
                draw: () => { }
            },

        ],
        npcs: [
            new SpikeGuard(block(24), block(3.5)),
            //new SpikeGuard(block(21), block(10)),
        ]
    }];