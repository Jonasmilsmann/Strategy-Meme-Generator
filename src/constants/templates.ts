// Meme-Vorlagen

export interface MemeTemplate {
  id: string;
  name: string;
  imageUrl: string;
  thumbnail: string;
  category: 'classic' | 'modern' | 'business';
  keywords: string[]; // Für Suche
}

// Top 20 beliebteste Meme-Templates
export const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'drake',
    name: 'Drake Hotline Bling',
    imageUrl: 'https://i.imgflip.com/30b1gx.jpg',
    thumbnail: 'https://i.imgflip.com/30b1gx.jpg',
    category: 'classic',
    keywords: ['drake', 'choice', 'preference', 'yes no', 'entscheidung', 'auswahl'],
  },
  {
    id: 'distracted-boyfriend',
    name: 'Distracted Boyfriend',
    imageUrl: 'https://i.imgflip.com/1ur9b0.jpg',
    thumbnail: 'https://i.imgflip.com/1ur9b0.jpg',
    category: 'classic',
    keywords: ['boyfriend', 'girlfriend', 'distraction', 'cheating', 'ablenkung', 'freund'],
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons',
    imageUrl: 'https://i.imgflip.com/1g8my4.jpg',
    thumbnail: 'https://i.imgflip.com/1g8my4.jpg',
    category: 'classic',
    keywords: ['choice', 'decision', 'buttons', 'difficult', 'entscheidung', 'schwierig'],
  },
  {
    id: 'change-my-mind',
    name: 'Change My Mind',
    imageUrl: 'https://i.imgflip.com/24y43o.jpg',
    thumbnail: 'https://i.imgflip.com/24y43o.jpg',
    category: 'modern',
    keywords: ['opinion', 'debate', 'crowder', 'convince', 'meinung', 'diskussion'],
  },
  {
    id: 'expanding-brain',
    name: 'Expanding Brain',
    imageUrl: 'https://i.imgflip.com/1jwhww.jpg',
    thumbnail: 'https://i.imgflip.com/1jwhww.jpg',
    category: 'classic',
    keywords: ['intelligence', 'smart', 'levels', 'evolution', 'intelligent', 'schlau'],
  },
  {
    id: 'success-kid',
    name: 'Success Kid',
    imageUrl: 'https://i.imgflip.com/1bhk.jpg',
    thumbnail: 'https://i.imgflip.com/1bhk.jpg',
    category: 'classic',
    keywords: ['success', 'victory', 'win', 'kid', 'erfolg', 'sieg'],
  },
  {
    id: 'is-this',
    name: 'Is This A Pigeon',
    imageUrl: 'https://i.imgflip.com/1o00in.jpg',
    thumbnail: 'https://i.imgflip.com/1o00in.jpg',
    category: 'modern',
    keywords: ['confused', 'misunderstanding', 'butterfly', 'anime', 'verwirrt'],
  },
  {
    id: 'exit-12',
    name: 'Left Exit 12 Off Ramp',
    imageUrl: 'https://i.imgflip.com/22bdq6.jpg',
    thumbnail: 'https://i.imgflip.com/22bdq6.jpg',
    category: 'modern',
    keywords: ['choice', 'highway', 'decision', 'direction', 'richtung', 'entscheidung'],
  },
  {
    id: 'mocking-spongebob',
    name: 'Mocking SpongeBob',
    imageUrl: 'https://i.imgflip.com/1otk96.jpg',
    thumbnail: 'https://i.imgflip.com/1otk96.jpg',
    category: 'classic',
    keywords: ['spongebob', 'mocking', 'sarcasm', 'irony', 'spott', 'sarkasmus'],
  },
  {
    id: 'uno-reverse',
    name: 'UNO Reverse Card',
    imageUrl: 'https://i.imgflip.com/26u2vx.jpg',
    thumbnail: 'https://i.imgflip.com/26u2vx.jpg',
    category: 'modern',
    keywords: ['uno', 'reverse', 'comeback', 'counter', 'zurück', 'konter'],
  },
  {
    id: 'woman-yelling-cat',
    name: 'Woman Yelling at Cat',
    imageUrl: 'https://i.imgflip.com/345v97.jpg',
    thumbnail: 'https://i.imgflip.com/345v97.jpg',
    category: 'modern',
    keywords: ['cat', 'yelling', 'argument', 'confused', 'katze', 'streit'],
  },
  {
    id: 'always-has-been',
    name: 'Always Has Been',
    imageUrl: 'https://i.imgflip.com/3gvdkx.jpg',
    thumbnail: 'https://i.imgflip.com/3gvdkx.jpg',
    category: 'modern',
    keywords: ['astronaut', 'space', 'revelation', 'truth', 'wahrheit', 'offenbarung'],
  },
  {
    id: 'disaster-girl',
    name: 'Disaster Girl',
    imageUrl: 'https://i.imgflip.com/23ls.jpg',
    thumbnail: 'https://i.imgflip.com/23ls.jpg',
    category: 'classic',
    keywords: ['fire', 'evil', 'chaos', 'disaster', 'feuer', 'böse'],
  },
  {
    id: 'hide-the-pain-harold',
    name: 'Hide the Pain Harold',
    imageUrl: 'https://i.imgflip.com/gk5el.jpg',
    thumbnail: 'https://i.imgflip.com/gk5el.jpg',
    category: 'classic',
    keywords: ['harold', 'pain', 'fake smile', 'uncomfortable', 'schmerz', 'lächeln'],
  },
  {
    id: 'this-is-fine',
    name: 'This Is Fine',
    imageUrl: 'https://i.imgflip.com/wxica.jpg',
    thumbnail: 'https://i.imgflip.com/wxica.jpg',
    category: 'modern',
    keywords: ['dog', 'fire', 'crisis', 'everything is fine', 'krise', 'hund'],
  },
  {
    id: 'surprised-pikachu',
    name: 'Surprised Pikachu',
    imageUrl: 'https://i.imgflip.com/1pjh6v.jpg',
    thumbnail: 'https://i.imgflip.com/1pjh6v.jpg',
    category: 'modern',
    keywords: ['pikachu', 'surprise', 'shock', 'unexpected', 'überrascht', 'schock'],
  },
  {
    id: 'roll-safe',
    name: 'Roll Safe Think About It',
    imageUrl: 'https://i.imgflip.com/1h7in3.jpg',
    thumbnail: 'https://i.imgflip.com/1h7in3.jpg',
    category: 'modern',
    keywords: ['smart', 'thinking', 'clever', 'logic', 'denken', 'clever'],
  },
  {
    id: 'Bernie-Sanders',
    name: 'Bernie Sanders Mittens',
    imageUrl: 'https://i.imgflip.com/4guvj4.jpg',
    thumbnail: 'https://i.imgflip.com/4guvj4.jpg',
    category: 'modern',
    keywords: ['bernie', 'mittens', 'cold', 'sitting', 'politics', 'politik'],
  },
  {
    id: 'they-the-same-picture',
    name: 'Corporate Needs You',
    imageUrl: 'https://i.imgflip.com/1c1uej.jpg',
    thumbnail: 'https://i.imgflip.com/1c1uej.jpg',
    category: 'business',
    keywords: ['same', 'difference', 'corporate', 'office', 'gleich', 'büro'],
  },
  {
    id: 'meeting-suggestion',
    name: 'Boardroom Meeting Suggestion',
    imageUrl: 'https://i.imgflip.com/m78d.jpg',
    thumbnail: 'https://i.imgflip.com/m78d.jpg',
    category: 'business',
    keywords: ['meeting', 'idea', 'suggestion', 'boardroom', 'präsentation', 'idee'],
  },
];

export const TEMPLATE_CATEGORIES = ['classic', 'modern', 'business'] as const;

