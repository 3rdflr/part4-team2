import { ActivityDetail } from '@/types/activities.type';

export const mockActivityDetail: ActivityDetail = {
  id: 7,
  userId: 21,
  title: '함께 배우면 즐거운 스트릿댄스',
  description: `함께 배우면 즐거운 스트릿댄스는 리듬에 몸을 맡기는 순간, 에너지가 터지고 자신감이 스며드는 경험입니다. 음악의 비트와 함께 움직이며 심장을 뛰게 하고, 전신을 사용하는 유산소 운동으로 몸도 튼튼해져요. 동시에 즉흥 동작과 표현력을 통해 나만의 스타일을 발견하고, 동료와 함께 호흡하며 웃음과 우정까지 피어납니다. 자유로운 표현 속에서 몸과 마음이 하나 되고, 문화와 공동체를 함께 즐기는 그 시간이야말로 진정한 ‘춤의 즐거움’입니다.`,
  category: '투어',
  price: 10000,
  address: '서울특별시 강남구 테헤란로 427',
  bannerImageUrl: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80',
  rating: 4.74,
  reviewCount: 1300,
  createdAt: '2023-12-31T21:28:50.589Z',
  updatedAt: '2023-12-31T21:28:50.589Z',
  subImages: [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=600&q=80',
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&q=80',
    },
    {
      id: 4,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    },
    {
      id: 5,
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
    },
    {
      id: 6,
      imageUrl: 'https://images.unsplash.com/photo-1567729715436-b6773a832e9c?w=600&q=80',
    },
  ],
  schedules: [
    {
      id: 1,
      date: '2023-12-01',
      startTime: '12:00',
      endTime: '13:00',
    },
    {
      id: 2,
      date: '2023-12-05',
      startTime: '12:00',
      endTime: '13:00',
    },
    {
      id: 3,
      date: '2023-12-05',
      startTime: '13:00',
      endTime: '14:00',
    },
    {
      id: 4,
      date: '2023-12-05',
      startTime: '14:00',
      endTime: '15:00',
    },
    {
      id: 5,
      date: '2023-12-10',
      startTime: '10:00',
      endTime: '11:00',
    },
    {
      id: 6,
      date: '2023-12-15',
      startTime: '15:00',
      endTime: '16:00',
    },
  ],
};

// 추가 목업 데이터들
export const mockActivitiesList: ActivityDetail[] = [
  mockActivityDetail,
  {
    id: 8,
    userId: 22,
    title: '서울 한옥마을 전통문화 체험',
    description:
      '북촌 한옥마을에서 전통 한복을 입고 다도 체험과 전통 공예를 배워보는 특별한 시간입니다. 한국의 아름다운 전통문화를 직접 체험하며 소중한 추억을 만들어보세요.',
    category: '문화 · 예술',
    price: 35000,
    address: '서울특별시 종로구 계동길 37',
    bannerImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3',
    rating: 4.6,
    reviewCount: 89,
    createdAt: '2023-12-30T15:20:30.123Z',
    updatedAt: '2023-12-30T15:20:30.123Z',
    subImages: [
      {
        id: 5,
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3',
      },
      {
        id: 6,
        imageUrl: 'https://images.unsplash.com/photo-1567729715436-b6773a832e9c?ixlib=rb-4.0.3',
      },
    ],
    schedules: [
      {
        id: 7,
        date: '2023-12-02',
        startTime: '14:00',
        endTime: '16:00',
      },
      {
        id: 8,
        date: '2023-12-07',
        startTime: '10:00',
        endTime: '12:00',
      },
    ],
  },
  {
    id: 9,
    userId: 23,
    title: '제주도 해녀 문화 체험',
    description:
      '제주도의 대표적인 문화인 해녀 문화를 직접 체험해보세요. 물질 체험과 함께 해녀 할머니들의 이야기를 들으며 제주의 바다와 문화를 깊이 있게 이해할 수 있습니다.',
    category: '관광',
    price: 50000,
    address: '제주특별자치도 제주시 구좌읍 해녀로 15',
    bannerImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3',
    rating: 4.8,
    reviewCount: 156,
    createdAt: '2023-12-28T09:15:45.789Z',
    updatedAt: '2023-12-28T09:15:45.789Z',
    subImages: [
      {
        id: 7,
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3',
      },
    ],
    schedules: [
      {
        id: 9,
        date: '2023-12-03',
        startTime: '09:00',
        endTime: '12:00',
      },
    ],
  },
];

// ID별로 활동 상세 정보를 가져오는 목업 함수
export const getMockActivityDetail = (id: number): ActivityDetail => {
  const activity = mockActivitiesList.find((activity) => activity.id === id);
  if (!activity) {
    throw new Error('존재하지 않는 체험입니다.');
  }
  return activity;
};
