export default function IconCall({ in_out, status }) {
  const iconConfig = {
    '1-Дозвонился': {
      src: '/icon-incoming.svg',
      alt: 'Входящий звонок (дозвонился)',
    },
    '1-Не дозвонился': {
      src: '/icon-incoming-red.svg',
      alt: 'Входящий звонок (не дозвонился)',
    },
    '0-Дозвонился': {
      src: '/icon-outgoing.svg',
      alt: 'Исходящий звонок (дозвонился)',
    },
    '0-Не дозвонился': {
      src: '/icon-outgoing-red.svg',
      alt: 'Исходящий звонок (не дозвонился)',
    },
  };

  const key = `${in_out}-${status}`;

  const { src, alt } = iconConfig[key] || {
    src: '/icon-default.svg',
    alt: 'Неизвестный звонок',
  };

  return <img src={src} alt={alt} />;
}
