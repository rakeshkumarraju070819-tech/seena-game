// Swap these paths (files live in /public/assets) to use your own PNG/SVG/JPG artwork.
export const ASSETS = {
  character: '/assets/characters/player.png', // flying player (face + wings + glow)
  obstacle: '/assets/obstacles/goat.png',     // standing obstacle, HEAD at the top; auto-flipped for the upper one
};
export const MEMES = {
  start: '/assets/memes/meme-start.png',
  over: '/assets/memes/meme-start.png',
};

export const OBSTACLE_ASPECT = 0.565; // obstacle image width / height (goat.png = 286x506)

export const TEXT = {
  title: 'FLYING SEENA',
  startDialogue: 'ఒరేయ్ లంబోది! మేకలను తగలకుండా ఎగరరా!',
  playCta: 'PLAY KOTTU RA LAMBODI KODAKA!',
  instructions: 'Tap Screen | Spacebar or Click',
};

export const FAIL_DIALOGUES = [
  { max: 2, text: 'ఇంత తొందరగానా? నీ వల్ల కాదు రా!' },
  { max: 9, text: 'పర్వాలేదు రా, కానీ ఇంకా ప్రాక్టీస్ చెయ్!' },
  { max: 19, text: 'అదిరింది రా! ఇంకొంచెం ట్రై చెయ్!' },
  { max: Infinity, text: 'నువ్వు మామూలోడివి కాదు రా బాబు!' },
];
export const getFailDialogue = (score) => FAIL_DIALOGUES.find((d) => score <= d.max).text;
