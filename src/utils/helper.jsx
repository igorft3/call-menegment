import './style.css';
export const formatDate = dateString => {
  const date = new Date(dateString.replace(' ', 'T'));
  return date.toTimeString().slice(0, 5);
};

export const formatPhoneNumber = phone => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) return phone;
  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(
    7,
    9
  )}-${digits.slice(9, 11)}`;
};

export const getRandomGrade = status => {
  if (status === 'Не дозвонился') return '';

  const grades = [
    { text: 'Отлично', className: 'grade green' },
    { text: 'Хорошо', className: 'grade blue' },
    { text: 'Плохо', className: 'grade red' },
  ];
  const randomGrade = grades[Math.floor(Math.random() * grades.length)];

  return <span className={randomGrade.className}>{randomGrade.text}</span>;
};

export const getFullTime = minuteString => {
  if (minuteString === 0) return '';

  let minutes = Math.floor(minuteString / 60);
  let seconds = minuteString % 60;
  return `${minutes}:${seconds.toFixed(0)}`;
};
