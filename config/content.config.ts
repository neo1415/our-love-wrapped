import { ContentConfig } from '@/types/content';

const contentConfig: ContentConfig = {
  names: {
    his: 'Daniel',
    hers: 'Alo',
    initials: 'D & A',
  },

  date: 'Our Love Story',

  audio: {
    tracks: [
      {
        name: 'Beautiful in White',
        path: '/audio/Shayne_Ward_-_Beautiful_In_White_(mp3.pm).mp3',
        sections: [0, 1, 2],
      },
      {
        name: 'Beautiful Things',
        path: '/audio/Benson_Boone_-_Beautiful_Things_(mp3.pm).mp3',
        sections: [3, 4, 5],
      },
      {
        name: 'Her by JVKE',
        path: '/audio/JVKE_-_her_(mp3.pm).mp3',
        sections: [6, 7],
      },
    ],
  },

  sections: [
    // Section 0: When I First Met You (uses section-1 photos)
    {
      id: 0,
      title: 'When I First Met You',
      slides: [
        {
          type: 'text',
          content: 'It is truly baffling how a man can meet a miracle\nand in his humanity miss the gift\nthat was right in front of him',
          duration: 5000,
        },
        {
          type: 'photo',
          content: '/photos/section-1/WhatsApp Image 2026-02-09 at 4.26.05 PM.jpeg',
          altText: 'When I first met you',
          duration: 5000,
        },
        {
          type: 'text',
          content: 'But you were so *beautiful*\nand so **bright**',
          duration: 4000,
        },
        {
          type: 'photo',
          content: '/photos/section-1/WhatsApp Image 2026-02-09 at 4.26.36 PMdcds.jpeg',
          altText: 'Your radiance',
          duration: 5000,
        },
        {
          type: 'text',
          content: 'It felt like trying to pluck\nthe sun from the sky',
          duration: 4000,
        },
      ],
    },

    // Section 1: Our Reunion (uses section-2 photos)
    {
      id: 1,
      title: 'Our Reunion',
      slides: [
        {
          type: 'text',
          content: 'But when love is meant to be\nFate will find a way\nto bend the rules to make it work',
          duration: 5000,
        },
        {
          type: 'photo',
          content: '/photos/section-2/WhatsApp Image 2026-02-09 at 4.26.06 PM.jpeg',
          altText: 'Together again',
          duration: 5000,
        },
        {
          type: 'text',
          content: 'With your goofy ass expressions\nand glass skin 😂',
          duration: 4000,
        },
        {
          type: 'photo',
          content: '/photos/section-2/WhatsApp Image 2026-02-09 at 4.26.37 ddwd.jpeg',
          altText: 'Your smile',
          duration: 5000,
        },
        {
          type: 'collage',
          content: '',
          duration: 7000,
          photos: [
            { src: '/photos/section-2/WhatsApp Image 2026-02-09 at 4.26.37 PM.jpeg', alt: 'Your beauty', focalPoint: 'top center' },
            { src: '/photos/section-2/WhatsApp Image 2026-02-09 at 4.26.38 PM.jpeg', alt: 'Your glow', focalPoint: 'top center' },
            { src: '/photos/section-2/WhatsApp Image 2026-02-09 at 4.26.38 PMdw.jpeg', alt: 'Your radiance', focalPoint: 'top center' },
          ],
          layout: 'masonry-burst',
        },
        {
          type: 'collage',
          content: '',
          duration: 7000,
          photos: [
            { src: '/photos/section-2/WhatsApp Image 2026-02-09 at 4.26.39 PM.jpeg', alt: 'Your light', focalPoint: 'top center' },
            { src: '/photos/section-2/WhatsApp Image 2026-02-09 at 4.26.39 PMew.jpeg', alt: 'Your essence', focalPoint: 'top center' },
            { src: '/photos/section-2/WhatsApp Image 2026-02-09 at 4.26.42 PM.jpeg', alt: 'You', focalPoint: 'top center' },
          ],
          layout: 'masonry-burst',
        },
      ],
    },

    // Section 2: Our First Date
    {
      id: 2,
      title: 'Our First Date',
      slides: [
        {
          type: 'text',
          content: 'You were *something else*',
          duration: 3000,
        },
        {
          type: 'photo',
          content: '/photos/section-3/WhatsApp Image 2026-02-09 at 4.26.40 PM.jpeg',
          altText: 'Our first date',
          duration: 5000,
        },
        {
          type: 'text',
          content: 'I literally didn\'t know\nwhat to do with myself',
          duration: 4000,
        },
        {
          type: 'collage',
          content: '',
          duration: 6000,
          photos: [
            { src: '/photos/section-3/WhatsApp Image 2026-02-09 at 4.26.40 PMdcs.jpeg', alt: 'That moment', focalPoint: 'top center' },
            { src: '/photos/section-3/WhatsApp Image 2026-02-09 at 4.26.41 PM.jpeg', alt: 'A prayer answered', focalPoint: 'top center' },
          ],
          layout: 'intimate-duo',
        },
        {
          type: 'text',
          content: 'All I prayed for\nthen also what my children\nand ancestors prayed for',
          duration: 5000,
        },
        {
          type: 'photo',
          content: '/photos/section-3/WhatsApp Image 2026-02-09 at 4.26.41 PMefwe.jpeg',
          altText: 'My blessing',
          duration: 5000,
        },
        {
          type: 'text',
          content: '**Omoooo** 💀',
          duration: 3000,
        },
        {
          type: 'photo',
          content: '/photos/section-3/cscscscscs.jpeg',
          altText: 'Speechless',
          duration: 5000,
        },
      ],
    },

    // Section 3: The First I Love You
    {
      id: 3,
      title: 'The First I Love You',
      slides: [
        {
          type: 'text',
          content: '**RIP Mr. Resistance**',
          duration: 3000,
        },
        {
          type: 'photo',
          content: '/photos/section-4/image.png',
          altText: 'The moment I surrendered',
          duration: 6000,
        },
        {
          type: 'text',
          content: '*Not sorry* 😌',
          duration: 3000,
        },
      ],
    },

    // Section 4: Her Brilliance
    {
      id: 4,
      title: 'Her Brilliance',
      slides: [
        {
          type: 'text',
          content: 'You push me to be\nthe **best version** of myself',
          duration: 5000,
        },
        {
          type: 'collage',
          content: '',
          duration: 6000,
          photos: [
            { src: '/photos/section-5/WhatsApp Image 2026-02-09 at 4.26.52 er.jpeg', alt: 'Your brilliance', focalPoint: 'top center' },
            { src: '/photos/section-5/WhatsApp Image 2026-02-09 at 4.26.58 PMfewgre.jpeg', alt: 'Your ambition', focalPoint: 'top center' },
            { src: '/photos/section-5/WhatsApp Image 2026-02-09 at 4.26.59 PM.jpeg', alt: 'Your drive', focalPoint: 'top center' },
          ],
          layout: 'cinematic-strip',
        },
        {
          type: 'text',
          content: 'And when I think I have gotten there\nI look at you and know\nI can never remain where I am',
          duration: 5000,
        },
        {
          type: 'photo',
          content: '/photos/section-5/WhatsApp Image 2026-02-09 at 4.27.00 wgwe.jpeg',
          altText: 'Your excellence',
          duration: 5000,
        },
        {
          type: 'photo',
          content: '/photos/section-5/WhatsApp Image 2026-02-09 at 4.27.00 wvfweew.jpeg',
          altText: 'Your grace',
          duration: 5000,
        },
        {
          type: 'text',
          content: 'She deserves the *heavens* and the *earth*',
          duration: 4000,
        },
        {
          type: 'photo',
          content: '/photos/section-5/WhatsApp Image 2026-02-09 at 4.27.01 PMb jnh jn.jpeg',
          altText: 'My Queen',
          duration: 5000,
        },
        {
          type: 'text',
          content: 'And I will pluck the heavens\nand harvest the earth\nfor my **Queen**',
          duration: 5000,
        },
        {
          type: 'collage',
          content: '',
          duration: 7000,
          photos: [
            { src: '/photos/section-5/WhatsApp Image 2026-02-09 at 4.27.02 PMjhbhjb.jpeg', alt: 'Your majesty', focalPoint: 'top center' },
            { src: '/photos/section-5/WhatsApp Image 2026-02-09 at 4.27.03 PM.jpeg', alt: 'Your power', focalPoint: 'top center' },
            { src: '/photos/section-5/WhatsApp Image 2026-02-09 at 4.27.03 PMhjbh.jpeg', alt: 'Your essence', focalPoint: 'top center' },
          ],
          layout: 'masonry-burst',
        },
        {
          type: 'collage',
          content: '',
          duration: 7000,
          photos: [
            { src: '/photos/section-5/ewfwe.jpeg', alt: 'You being you', focalPoint: 'top center' },
            { src: '/photos/section-5/jbjhjhhjj.jpeg', alt: 'Your authenticity', focalPoint: 'top center' },
            { src: '/photos/section-5/IMG_7442.jpeg', alt: 'Your spirit', focalPoint: 'top center' },
          ],
          layout: 'masonry-burst',
        },
      ],
    },

    // Section 5: Through The Fire
    {
      id: 5,
      title: 'Through The Fire',
      slides: [
        {
          type: 'text',
          content: 'Ain\'t no man as terrified\nas the man who\'s scared to lose you',
          duration: 5000,
        },
        {
          type: 'photo',
          content: '/photos/section-6/jbjhjhhjj.jpeg',
          altText: 'Through it all',
          duration: 6000,
        },
        {
          type: 'text',
          content: 'But you stuck with me\nand we made this work',
          duration: 4000,
        },
        {
          type: 'text',
          content: 'There is **nothing**\nwe can\'t conquer baby',
          duration: 4000,
        },
      ],
    },

    // Section 6: Our Together
    {
      id: 6,
      title: 'Our Together',
      slides: [
        {
          type: 'text',
          content: 'Every moment, every second\nI spend with you\nis a taste of *paradise*',
          duration: 5000,
        },
        {
          type: 'photo',
          content: '/photos/section-7/WhatsApp Image 2026-02-09 at 4.26.44 PM.jpeg',
          altText: 'Our moments',
          duration: 5000,
        },
        {
          type: 'photo',
          content: '/photos/section-7/WhatsApp Image 2026-02-09 at 4.26.44 hbhuj.jpeg',
          altText: 'Our time',
          duration: 5000,
        },
        {
          type: 'text',
          content: 'The winds blow more softly\nthe sun is more beautiful',
          duration: 4000,
        },
        {
          type: 'photo',
          content: '/photos/section-7/WhatsApp Image 2026-02-09 at 4.26.45 PMfewe.jpeg',
          altText: 'Our peace',
          duration: 5000,
        },
        {
          type: 'text',
          content: 'And the urge to crawl\ninto your arms\nis **overwhelming**',
          duration: 5000,
        },
        {
          type: 'collage',
          content: '',
          duration: 7000,
          photos: [
            { src: '/photos/section-7/WhatsApp Image 2026-02-09 at 4.26.47 PMdwc.jpeg', alt: 'Our joy', focalPoint: 'top center' },
            { src: '/photos/section-7/WhatsApp Image 2026-02-09 at 4.26.48 PM.jpeg', alt: 'In your arms', focalPoint: 'top center' },
            { src: '/photos/section-7/WhatsApp Image 2026-02-09 at 4.26.49 hbhusa.jpeg', alt: 'Our comfort', focalPoint: 'top center' },
          ],
          layout: 'masonry-burst',
        },
        {
          type: 'collage',
          content: '',
          duration: 7000,
          photos: [
            { src: '/photos/section-7/WhatsApp Image 2026-02-09 at 4.26.50 PMjnuj.jpeg', alt: 'Mine', focalPoint: 'top center' },
            { src: '/photos/section-7/IMG_7447.jpeg', alt: 'Together', focalPoint: 'top center' },
          ],
          layout: 'intimate-duo',
        },
        {
          type: 'text',
          content: 'My Queen, My woman\nMy Choice, My own',
          duration: 4000,
        },
        {
          type: 'photo',
          content: '/photos/section-7/IMG_7448.jpeg',
          altText: 'Us',
          duration: 6000,
        },
        {
          type: 'text',
          content: '{{Ifunnanya m}}\n{{Asanwa}}\n{{Eyiimofe}}',
          duration: 5000,
        },
        {
          type: 'text',
          content: 'My **heart throb**',
          duration: 3000,
        },
      ],
    },

    // Section 7: My Smile
    {
      id: 7,
      title: 'My Smile',
      slides: [
        {
          type: 'text',
          content: 'You are all I could ever ask for\nin a woman',
          duration: 5000,
        },
        {
          type: 'photo',
          content: '/photos/section-8/WhatsApp Image 2026-01-19 at 8.09.03 PM.jpeg',
          altText: 'Your smile',
          duration: 5000,
        },
        {
          type: 'photo',
          content: '/photos/section-8/WhatsApp Image 2026-01-19 at 8.09.03 PM (1).jpeg',
          altText: 'Your joy',
          duration: 5000,
        },
        {
          type: 'text',
          content: 'Your *smile* lightens my heart\nand brightens my day',
          duration: 5000,
        },
        {
          type: 'collage',
          content: '',
          duration: 6000,
          photos: [
            { src: '/photos/section-8/WhatsApp Image 2026-02-04 at 10.26.15 PM.jpeg', alt: 'Your radiance', focalPoint: 'top center' },
            { src: '/photos/section-8/WhatsApp Image 2026-02-06 at 12.27.23 PM.jpeg', alt: 'Your laughter', focalPoint: 'top center' },
          ],
          layout: 'intimate-duo',
        },
        {
          type: 'text',
          content: 'Is there anything\nI would not do for you?',
          duration: 4000,
        },
        {
          type: 'collage',
          content: '',
          duration: 6000,
          photos: [
            { src: '/photos/section-8/WhatsApp Image 2026-02-06 at 12.27.23 PM (1).jpeg', alt: 'Your happiness', focalPoint: 'top center' },
            { src: '/photos/section-8/WhatsApp Image 2026-02-06 at 12.27.24 PM.jpeg', alt: 'Your glow', focalPoint: 'top center' },
          ],
          layout: 'intimate-duo',
        },
        {
          type: 'text',
          content: 'Words, pictures\nnone of these can ever\ndo you **justice**',
          duration: 5000,
        },
        {
          type: 'collage',
          content: '',
          duration: 6000,
          photos: [
            { src: '/photos/section-8/WhatsApp Image 2026-02-06 at 12.27.24 PM (1).jpeg', alt: 'Your beauty', focalPoint: 'top center' },
            { src: '/photos/section-8/WhatsApp Image 2026-02-06 at 12.27.24 PM (2).jpeg', alt: 'Your grace', focalPoint: 'top center' },
          ],
          layout: 'intimate-duo',
        },
        {
          type: 'text',
          content: 'And I can only spend my time\nmaking sure that you see',
          duration: 5000,
        },
        {
          type: 'photo',
          content: '/photos/section-8/WhatsApp Image 2026-02-06 at 7.31.52 AM.jpeg',
          altText: 'Your essence',
          duration: 5000,
        },
        {
          type: 'text',
          content: 'Just how much of a *home*\nmy heart has become for you',
          duration: 5000,
        },
        {
          type: 'photo',
          content: '/photos/section-8/WhatsApp Image 2026-02-09 at 4.26.48 PM.jpeg',
          altText: 'Your spirit',
          duration: 5000,
        },
        {
          type: 'text',
          content: 'How much I **love** you\nHow much I **adore** you',
          duration: 5000,
        },
        {
          type: 'photo',
          content: '/photos/section-8/WhatsApp Image 2026-02-09 at 4.26.51 PM.jpeg',
          altText: 'You',
          duration: 5000,
        },
        {
          type: 'text',
          content: 'Continue holding my hand my woman\nand watch me conquer the world for you\nwith the other',
          duration: 6000,
        },
        {
          type: 'text',
          content: 'You are a **Queen**\nYou are **Alochukwu**',
          duration: 5000,
        },
        {
          type: 'text',
          content: 'You are **mine**',
          duration: 5000,
          special: 'overlay',
          backgroundPhoto: '/background/WhatsApp Image 2026-02-09 at 4.26.48 PM.jpeg',
        },
        {
          type: 'text',
          content: 'I Love You',
          duration: 999999, // Very long duration so it stays visible
          special: 'valentine',
          backgroundPhoto: '/background/WhatsApp Image 2026-02-09 at 4.26.48 PM.jpeg',
        },
      ],
    },
  ],

  video: {
    path: '/photos/section-3/WhatsApp Video 2026-02-09 at 4.26.41 PM.mp4',
    audioPath: '/photos/section-3/WhatsApp Video 2026-02-09 at 4.26.41 PM.mp4',
    cuePoint: 90,
  },

  finalMessage: 'I Love You',
  
  // Ice cream delivery code - CHANGE THIS TO YOUR 4-DIGIT ORDER NUMBER
  iceCreamCode: '0000',
};

export default contentConfig;
