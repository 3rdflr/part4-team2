import { z } from 'zod';
import { parse, isValid, isAfter, isBefore } from 'date-fns';

export const MyActivitySchema = z
  .object({
    title: z.string().min(1, { message: '제목을 입력해주세요.' }),
    category: z.enum(['문화 · 예술', '식음료', '스포츠', '투어', '관광', '웰빙'], {
      message: '카테고리를 선택해주세요.',
    }),
    description: z.string().min(1, { message: '설명을 입력해주세요.' }),
    price: z
      .string()
      .nonempty('가격을 입력해 주세요.')
      .regex(/^\d+$/, '숫자만 입력할 수 있습니다.')
      .refine((val) => Number(val) > 0, '가격은 0 이상이어야 합니다.'),
    address: z.string().min(1, { message: '주소를 입력해주세요.' }),
    schedules: z
      .array(
        z.object({
          id: z.union([z.string(), z.number()]).optional(),
          date: z.string(),
          startTime: z.string(),
          endTime: z.string(),
        }),
      )
      .superRefine((schedules, ctx) => {
        const seen = new Set<string>();

        schedules.forEach((s, i) => {
          // 날짜 입력 체크
          if (!s.date) {
            ctx.addIssue({
              code: 'custom',
              path: [i, 'date'],
              message: '날짜를 입력해주세요.',
            });
            return;
          }

          // 날짜 형식 검사
          if (!/^\d{2}\/\d{2}\/\d{2}$/.test(s.date)) {
            ctx.addIssue({
              code: 'custom',
              path: [i, 'date'],
              message: '날짜를 올바른 형식으로 입력해주세요.',
            });
            return;
          }

          // 실제 유효한 날짜인지 체크
          const parsedDate = parse(s.date, 'yy/MM/dd', new Date());
          if (!isValid(parsedDate)) {
            ctx.addIssue({
              code: 'custom',
              path: [i, 'date'],
              message: '날짜를 올바른 형식으로 입력해주세요.',
            });
            return;
          }

          // 시간 입력 체크
          if (!s.startTime || !s.endTime) {
            ctx.addIssue({
              code: 'custom',
              path: [i, 'date'],
              message: '시작 시간과 종료 시간을 모두 입력해주세요.',
            });
            return;
          }

          const now = new Date();

          let [startHour, startMin] = s.startTime.split(':').map(Number);
          let [endHour, endMin] = s.endTime.split(':').map(Number);
          if (startHour === 24 && startMin === 0) {
            startHour = 23;
            startMin = 59;
          }

          if (endHour === 24 && endMin === 0) {
            endHour = 23;
            endMin = 59;
          }

          const startDate = parse(
            `${s.date} ${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`,
            'yy/MM/dd HH:mm',
            new Date(),
          );
          const endDate = parse(
            `${s.date} ${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`,
            'yy/MM/dd HH:mm',
            new Date(),
          );

          // 현재 시각 이후인지 체크
          if (isBefore(startDate, now)) {
            ctx.addIssue({
              code: 'custom',
              path: [i, 'date'],
              message: '현재 시각 이후의 일정만 등록 가능합니다.',
            });
            return;
          }

          // 시작 시간 < 종료 시간 체크
          if (!isAfter(endDate, startDate)) {
            ctx.addIssue({
              code: 'custom',
              path: [i, 'date'],
              message: '시작 시간을 종료 시간보다 이전으로 설정해주세요.',
            });
            return;
          }

          // 예약 시간 중복 체크
          const key = `${s.date}-${s.startTime}-${s.endTime}`;
          if (seen.has(key)) {
            ctx.addIssue({
              code: 'custom',
              path: [i, 'date'],
              message: '예약 시간은 중복될 수 없습니다.',
            });
            return;
          }

          seen.add(key);
        });
      }),
    bannerFiles: z.array(z.instanceof(File)).optional(),
    subFiles: z.array(z.instanceof(File)).optional(),
    bannerImageUrl: z.string(),
    subImageUrls: z.array(z.string()).optional(),
    subImages: z
      .array(
        z.object({
          id: z.number().optional(),
          imageUrl: z.string(),
        }),
      )
      .optional(),
    bannerImages: z
      .array(
        z.object({
          imageUrl: z.string(),
        }),
      )
      .optional(),
    subImageIdsToRemove: z.array(z.number()).optional(),
    subImageUrlsToAdd: z.array(z.string()).optional(),
    scheduleIdsToRemove: z.array(z.union([z.string(), z.number()])).optional(),
    schedulesToAdd: z
      .array(
        z.object({
          date: z.string(),
          startTime: z.string(),
          endTime: z.string(),
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    // 배너 이미지 체크
    if ((!data.bannerFiles || data.bannerFiles.length === 0) && !data.bannerImageUrl) {
      ctx.addIssue({
        code: 'custom',
        path: ['bannerFiles'],
        message: '배너 이미지를 업로드해주세요.',
      });
    }

    // 소개 이미지 체크
    const subFilesCount = data.subFiles?.length ?? 0;
    const subImagesCount = data.subImages?.length ?? 0;
    if (subFilesCount + subImagesCount < 2) {
      ctx.addIssue({
        code: 'custom',
        path: ['subFiles'],
        message: '소개 이미지를 2개 이상 업로드해주세요.',
      });
    }
  });

export type MyActivityFormData = z.infer<typeof MyActivitySchema>;
