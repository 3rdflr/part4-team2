import { type Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './styles/**/*.{css,scss}'],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },
      fontSize: {
        '32-bold': ['32px', { lineHeight: '46px', fontWeight: '700' }],
        '32-semibold': ['32px', { lineHeight: '42px', fontWeight: '600' }],
        '32-medium': ['32px', { lineHeight: '42px', fontWeight: '500' }],
        '32-regular': ['32px', { lineHeight: '42px', fontWeight: '400' }],

        '24-bold': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        '24-semibold': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        '24-medium': ['24px', { lineHeight: '32px', fontWeight: '500' }],
        '24-regular': ['24px', { lineHeight: '32px', fontWeight: '400' }],

        '20-bold': ['20px', { lineHeight: '32px', fontWeight: '700' }],
        '20-semibold': ['20px', { lineHeight: '32px', fontWeight: '600' }],
        '20-medium': ['20px', { lineHeight: '32px', fontWeight: '500' }],
        '20-regular': ['20px', { lineHeight: '32px', fontWeight: '400' }],

        '18-bold': ['18px', { lineHeight: '26px', fontWeight: '700' }],
        '18-semibold': ['18px', { lineHeight: '26px', fontWeight: '600' }],
        '18-medium': ['18px', { lineHeight: '26px', fontWeight: '500' }],
        '18-regular': ['18px', { lineHeight: '26px', fontWeight: '400' }],

        '16-bold': ['16px', { lineHeight: '26px', fontWeight: '700' }],
        '16-semibold': ['16px', { lineHeight: '26px', fontWeight: '600' }],
        '16-medium': ['16px', { lineHeight: '26px', fontWeight: '500' }],
        '16-regular': ['16px', { lineHeight: '26px', fontWeight: '400' }],

        '14-bold': ['14px', { lineHeight: '24px', fontWeight: '700' }],
        '14-semibold': ['14px', { lineHeight: '24px', fontWeight: '600' }],
        '14-medium': ['14px', { lineHeight: '24px', fontWeight: '500' }],
        '14-regular': ['14px', { lineHeight: '24px', fontWeight: '400' }],

        '13-bold': ['13px', { lineHeight: '22px', fontWeight: '700' }],
        '13-semibold': ['13px', { lineHeight: '22px', fontWeight: '600' }],
        '13-medium': ['13px', { lineHeight: '22px', fontWeight: '500' }],
        '13-regular': ['13px', { lineHeight: '22px', fontWeight: '400' }],

        '12-bold': ['12px', { lineHeight: '20px', fontWeight: '700' }],
        '12-semibold': ['12px', { lineHeight: '20px', fontWeight: '600' }],
        '12-medium': ['12px', { lineHeight: '20px', fontWeight: '500' }],
        '12-regular': ['12px', { lineHeight: '20px', fontWeight: '400' }],
      },
      boxShadow: {
        card: '0px 4px 24px rgba(0, 0, 0, 0.12)',
      },
      colors: {
        grayscale: {
          950: 'var(--grayscale-950)',
        },
      },
    },
  },
  plugins: [],
};

export default config;
