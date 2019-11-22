const musicPlayer = new Audio();
musicPlayer.volume = .1;
musicPlayer.loop = true;
let musicDuration = 1;


const sfxChannels = [
    new Audio(),
    new Audio(),
    new Audio(),
    new Audio(),
    new Audio(),
    new Audio(),
    new Audio(),
    new Audio()
]

let nextSfx = 0;


/**
 * @param {Number} track index in music[]
 */
playMusic = (track) => {
    musicPlayer.src = music[track];
    musicPlayer.currentTime = 0;
    musicPlayer.play();

    musicDuration = musicPlayer.duration;
}



/**
 * @param {Number} sound index in sfx[]
 * @param {Number} volume
 */
playSound = (sound, volume = .5) => {

    if (sfxChannels[nextSfx].src !== sound) sfxChannels[nextSfx].src = sound;
    if (sfxChannels[nextSfx].volume !== volume) sfxChannels[nextSfx].volume = volume;
    sfxChannels[nextSfx].play();
    nextSfx++
    nextSfx %= sfxChannels.length
}

loopSound = (sound) => {
    if (sound.currentTime >= sound.duration - .1) sound.currentTime = 0;
    sound.play();
}

stopSound = (sound) => {
    sound.pause();
    if (sound.currentTime) sound.currentTime = 0;
}
