export type Couplet = {
  lines: [string, string]
}

export type LetterContent = {
  greeting: string
  paragraphs: string[]
  closing: string
  signature: string
}

export type PhotoSlot = {
  file: string
  caption: string
  alt: string
}

export type Track = {
  id: string
  title: string
  file: string
}

export const birthdayConfig = {
  fatherTitle: 'Abu',
  familyName: 'Your family',
  birthdayDate: '2026-10-20',
  pageTitle: 'Happy Birthday, Abu',
  metaDescription:
    'A birthday gift from our family — a small surprise, and a lot of love.',

  opening: {
    title: 'For our dear Abu',
    subtitle: 'A gift from your whole family, for the man whose love is our world.',
    button: 'There is a surprise waiting for you',
    soundHint: 'This experience is best enjoyed with sound.',
    enableSound: 'Play music',
  },

  hero: {
    headline: 'Happy Birthday, our dear Abu',
    subhead: 'You are the greatest blessing of our lives.',
    english: 'With love, from your whole family.',
    cta: 'See this journey of love',
  },

  poetry: {
    heading: 'A few verses, from the heart',
    subheading: 'Words are few. Love is not.',
    nextLabel: 'Next verse',
    prevLabel: 'Previous verse',
    couplets: [
      {
        lines: [
          'ابو، آپ کی انگلی پکڑ کر ہم نے چلنا سیکھا تھا،',
          'آپ ہی سے ہم نے دنیا میں سنبھلنا سیکھا تھا۔',
        ],
      },
      {
        lines: [
          'ہماری ہر خوشی کے پیچھے آپ کی دعائیں ہیں،',
          'ہمارے ہر خواب میں شامل آپ کی وفائیں ہیں۔',
        ],
      },
      {
        lines: [
          'آپ کی مسکراہٹ ہمارے دل کا سکون ہے،',
          'آپ کا ساتھ ہماری زندگی کا سب سے حسین جنون ہے۔',
        ],
      },
      {
        lines: [
          'لفظ کم پڑ جاتے ہیں آپ کی محبت کے سامنے،',
          'ہماری دنیا جھک جاتی ہے ابو، آپ کی عظمت کے سامنے۔',
        ],
      },
      {
        lines: [
          'خود دھوپ میں رہ کر ہمیں چھاؤں دیتے رہے،',
          'اپنی خواہشیں بھول کر ہمارے خواب سجاتے رہے۔',
        ],
      },
      {
        lines: [
          'اللہ کرے آپ کی زندگی خوشیوں سے بھر جائے،',
          'آپ کے چہرے کی مسکراہٹ کبھی کم نہ ہو پائے۔',
        ],
      },
    ] satisfies Couplet[],
  },

  letter: {
    heading: 'A letter from your family',
    envelopeHint: 'Click the envelope to open the note',
    readAll: 'Read the full letter',
    greeting: 'میرے پیارے ابو،',
    paragraphs: [
      'سالگرہ مبارک ہو! ❤️',
      'آج کا دن ہمارے لیے بہت خاص ہے، کیونکہ آج اُس انسان کی سالگرہ ہے جو ہمارے گھر میں محبت، ہمت اور تحفظ کی سب سے خوبصورت مثال ہے۔',
      'ابو، شاید ہم ہر روز آپ کو یہ نہ بتا سکیں کہ آپ ہمارے لیے کتنے اہم ہیں، لیکن ہماری زندگی کی بہت سی خوشیوں کے پیچھے آپ کی محنت، آپ کی قربانیاں اور آپ کی دعائیں ہیں۔',
      'آپ کی موجودگی ہمیں حوصلہ دیتی ہے۔ آپ کی باتیں ہمیں راستہ دکھاتی ہیں، اور آپ کی محبت ہمیں یہ احساس دلاتی ہے کہ زندگی میں چاہے کتنی ہی مشکلات کیوں نہ ہوں، ہمارے پاس ایک ایسی ہستی ہے جس کی دعائیں ہمیشہ ہمارے ساتھ ہیں۔',
      'ہم دعا کرتے ہیں کہ اللہ تعالیٰ آپ کو صحت، لمبی عمر، سکون، خوشیاں اور بے شمار برکتیں عطا فرمائے۔ آپ کے چہرے پر ہمیشہ مسکراہٹ رہے، آپ کے دل کو کبھی کوئی غم نہ چھوئے، اور آپ کی ہر جائز خواہش پوری ہو۔',
      'ابو، ہماری خواہش ہے کہ ایک دن ہم آپ کو اپنی کامیابیوں پر فخر کرنے کا موقع دیں، آپ کی محنت کا حق ادا کرنے کی کوشش کریں، اور آپ کے لیے وہ خوشیاں لائیں جن کے آپ ہمیشہ مستحق رہے ہیں۔',
      'اگر ہم کبھی اپنی محبت الفاظ میں بیان نہ کر سکیں، تو بس اتنا یاد رکھیے گا کہ آپ ہمارے لیے ہمیشہ بہت خاص رہیں گے۔',
      'آپ صرف ہمارے والد نہیں، ہماری طاقت، ہماری رہنمائی اور ہماری زندگی کی سب سے قیمتی نعمتوں میں سے ایک ہیں۔',
      'اللہ آپ کو ہمیشہ اپنی حفظ و امان میں رکھے۔',
      'سالگرہ بہت بہت مبارک ہو، میرے پیارے ابو!',
      'آپ سے بہت محبت ہے۔ ❤️',
    ],
    closing: 'ہمیشہ آپ کے، آپ کا خاندان ❤️',
    signature: 'آپ کا خاندان',
  } satisfies LetterContent & {
    heading: string
    envelopeHint: string
    readAll: string
  },

  gift: {
    heading: 'Abu, a small gift from all of us...',
    hint: 'Click the box to open the gift',
    replay: 'Open again',
    message: 'Our greatest fortune is having a father like you.',
    blessing: 'May Allah keep the shade of your love over our family, always. Ameen.',
  },

  gallery: {
    heading: 'A few memories, a few smiles, and a lot of love',
    subheading: 'These moments belong to all of us.',
    placeholderTitle: 'Add your photo here',
    placeholderHint: (file: string) => `Place the file at public/images/${file}`,
    photos: [
      { file: 'family-photo.jpg', caption: 'Our family', alt: 'Our family together' },
      { file: 'waterfall.jpg', caption: 'Together', alt: 'Family by a waterfall' },
      { file: 'pines.jpg', caption: 'In the hills', alt: 'Family among the pines' },
      { file: 'murree.jpg', caption: 'Murree', alt: 'Family in Murree' },
      { file: 'together.jpg', caption: 'With Abu', alt: 'Family standing together' },
      { file: 'garden.jpg', caption: 'A quiet day', alt: 'Family in the garden' },
      { file: 'snow.jpg', caption: 'In the snow', alt: 'Family in the snow' },
      { file: 'river.jpg', caption: 'By the river', alt: 'Family by the river' },
      { file: 'all-of-us.jpg', caption: 'All of us', alt: 'Family selfie' },
      { file: 'balcony.jpg', caption: 'Side by side', alt: 'Family on a balcony' },
    ] satisfies PhotoSlot[],
  },

  music: {
    missing: 'Music could not be loaded. Please refresh, or add a file to public/audio.',
    paused: 'Music is paused',
    tracks: [
      {
        id: 'birthday',
        title: 'Happy Birthday',
        file: 'happy-birthday.wav',
      },
    ] satisfies Track[],
  },

  blessings: {
    heading: 'Prayers from the heart',
    duas: [
      'O Allah, grant our Abu health, ease, and peace.',
      'O Allah, fill his life with joy, mercy, and blessings.',
      'O Allah, lift his worries, fulfill his good wishes, and keep him in Your protection.',
      'O Allah, make our family a reason for his happiness, comfort, and pride. Ameen.',
    ],
  },

  candles: {
    heading: 'Abu, close your eyes and make a beautiful wish.',
    button: 'Let this prayer be accepted',
    micButton: 'Blow out the candles with your mic',
    after: 'May every birthday ahead be happier than the last.',
    relight: 'Light the candles again',
  },

  finale: {
    prelude: 'Abu, one last thing from all of us...',
    wish: [
      'Many people want to be successful in this world.',
      'Our greatest wish is simpler than that:',
      'that we keep making you proud, and keep you smiling.',
    ],
    truths: [
      'Your happiness is our happiness.',
      'Your prayer is our strength.',
      'And your love is our world.',
    ],
    closer: 'Happy Birthday, our dearest Abu.',
    signature: 'Your family, always yours.',
    replay: 'Watch again',
  },
} as const

export type BirthdayConfig = typeof birthdayConfig
