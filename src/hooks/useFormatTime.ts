export default function formatTime(date: string) {
  const now = new Date();
  const target = new Date(date);

  if (isNaN(target.getTime())) {
    return '날짜 없음';
  }

  const diffInMilliseconds = now.getTime() - target.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    if (diffInHours === 0) {
      if (Math.abs(diffInMinutes) < 1) {
        return diffInMinutes < 0 ? '곧' : '방금 전';
      }
      return diffInMinutes < 0
        ? `${Math.abs(diffInMinutes)}분 후`
        : `${Math.abs(diffInMinutes)}분 전`;
    }
    return diffInHours < 0 ? `${Math.abs(diffInHours)}시간 후` : `${Math.abs(diffInHours)}시간 전`;
  }

  // 오늘, 내일, 어제, 모레, 그저께 등 특정 날짜 처리
  switch (diffInDays) {
    case 0:
      return '오늘'; // 이 분기는 사실상 위에서 처리됩니다.
    case 1:
      return '어제';
    case 2:
      return '그저께';
    case -1:
      return '내일';
    case -2:
      return '모레';
    default:
      return diffInDays < 0 ? `${Math.abs(diffInDays)}일 후` : `${Math.abs(diffInDays)}일 전`;
  }
}
