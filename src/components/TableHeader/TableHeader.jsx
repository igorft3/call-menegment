import React from 'react';
import styles from './style.module.css';

export default function TableHeader() {
  return (
    <div className={styles.tableRow}>
      <div className={styles.tableCell}>Тип</div>
      <div className={styles.tableCell}>Время</div>
      <div className={styles.tableCell}>Сотрудник</div>
      <div className={styles.tableCell}>Звонок</div>
      <div className={styles.tableCell}>Источник</div>
      <div className={styles.tableCell}>Оценка</div>
      <div className={styles.tableCell}>Длительность</div>
    </div>
  );
}
