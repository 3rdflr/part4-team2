// 카카오 간단 회원가입 랜덤 닉네임 유틸

const adjectives = [
  '모험적인',
  '설레는',
  '신나는',
  '자유로운',
  '여유로운',
  '행복한',
  '경쾌한',
  '환상적인',
  '즐거운',
  '빛나는',
  '낭만적인',
  '따뜻한',
  '활기찬',
  '청량한',
  '자연스러운',
  '시원한',
  '꿈꾸는',
  '탐험하는',
  '여행하는',
  '체험하는',
  '상쾌한',
  '유쾌한',
  '반짝이는',
  '싱그러운',
  '신비로운',
  '황홀한',
  '자연친화적인',
  '열정적인',
  '호기심 많은',
  '매력적인',
];
const nouns = [
  '사자',
  '호랑이',
  '토끼',
  '고양이',
  '강아지',
  '여우',
  '펭귄',
  '코알라',
  '나비',
  '독수리',
  '곰',
  '다람쥐',
  '치타',
  '부엉이',
  '코끼리',
  '원숭이',
  '사슴',
  '물개',
  '토끼',
  '기린',
  '하마',
  '판다',
  '앵무새',
  '너구리',
  '돌고래',
  '해마',
  '바다표범',
  '늑대',
  '올빼미',
  '북극곰',
];

const getRandomElement = (arr: string[]): string => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const getRandomNumber = (max: number) => {
  return Math.floor(Math.random() * (max + 1));
};

const getRandomNickname = (): string => {
  return `${getRandomElement(adjectives)}${getRandomElement(nouns)}${getRandomNumber(99)}`;
};

export default getRandomNickname;
