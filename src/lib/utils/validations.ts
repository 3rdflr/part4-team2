/**
 * 유효성 검사
 */

export const validations = {
  /**
   * - 닉네임 유효성 검사
   * @description
   * - 필수 입력
   * - 열 자 이상 작성X
   */
  nickname: {
    required: '닉네임을 입력해주세요.',
    maxLength: {
      value: 10,
      message: '열 자 이하로 작성해주세요.',
    },
  },

  /**
   * - 이메일 유효성 검사
   * @description
   * - 필수 입력
   * - 이메일 형식으로 작성
   */
  email: {
    required: '이메일은 필수 입력입니다.',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: '이메일 형식으로 작성해 주세요.',
    },
  },

  /**
   * - 비밀번호 유효성 검사
   * @description
   * - 필수 입력
   * - 최소 8자
   */
  password: {
    required: '비밀번호 필수 입력입니다.',
    minLength: {
      value: 8,
      message: '8자 이상 입력해주세요.',
    },
  },

  /**
   * - 비밀번호 확인 유효성 검사
   * @param passwordValue - 비교할 원본 비밀번호
   * @description
   * - 필수 입력
   * - passwordValue와 일치해야 함
   */
  confirmPassword: (passwordValue: string) => ({
    required: '비밀번호 확인은 필수 입력입니다.',
    validate: (value: string) => value === passwordValue || '비밀번호가 일치하지 않습니다.',
  }),
};
