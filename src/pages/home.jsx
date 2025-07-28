import { useState, useEffect, useRef } from 'react';
import { api } from '@/utils/api';
import Select from 'react-select';
import { formatPhoneNumber, getRandomGrade } from '@/utils/helper';
import './style.css';
import TableHeader from '@/components/TableHeader/TableHeader';
import IconCall from '@/components/TableHeader/IconCall/IconCall';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowLeft from '@/assets/icons/icon-arrow-left.svg?react';
import ArrowRight from '@/assets/icons/icon-arrow-rigth.svg?react';
import Box from '@mui/material/Box';
import './audio.css';
// import { AudioPlayer } from '../components/AudioPlayer/AudioPlayer';
import { LazyAudioWrapper } from '@/components/LazyAudioWrapper';

export const formatTime = dateString => {
  const date = new Date(dateString.replace(' ', 'T'));
  return date.toTimeString().slice(0, 5);
};

const formatDateForAPI = date => {
  return date.toISOString().split('T')[0];
};

export default function Home() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [callType, setCallType] = useState({ value: '', label: 'Все типы' });
  const [dateRange, setDateRange] = useState({
    value: '3days',
    label: '3 дня',
  });
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

  const callTypeOptions = [
    { value: '', label: 'Все типы' },
    { value: '1', label: 'Входящие' },
    { value: '0', label: 'Исходящие' },
  ];

  const dateRangeOptions = [
    { value: '3days', label: '3 дня' },
    { value: 'week', label: 'Неделя' },
    { value: 'month', label: 'Месяц' },
    { value: 'year', label: 'Год' },
    { value: 'custom', label: 'Указать даты' },
  ];

  const getDateRange = range => {
    const today = new Date();
    const start = new Date(today);
    let end = new Date(today);

    switch (range) {
      case '3days':
        end.setDate(today.getDate() + 2);
        break;
      case 'week':
        end.setDate(today.getDate() + 6);
        break;
      case 'month':
        end.setMonth(today.getMonth() + 1);
        end.setDate(today.getDate() - 1);
        break;
      case 'year':
        end.setFullYear(today.getFullYear() + 1);
        end.setDate(today.getDate() - 1);
        break;
      case 'custom':
        break;
      default:
        break;
    }
    return { start, end };
  };

  const shiftDateRange = direction => {
    const newStart = new Date(dateStart);
    const newEnd = new Date(dateEnd);
    let shiftDays = 0;

    switch (dateRange.value) {
      case '3days':
        shiftDays = 3;
        break;
      case 'week':
        shiftDays = 7;
        break;
      case 'month':
        shiftDays = 30;
        break;
      case 'year':
        shiftDays = 365;
        break;
      case 'custom':
        shiftDays = 1;
        break;
      default:
        break;
    }

    if (direction === 'prev') {
      newStart.setDate(newStart.getDate() - shiftDays);
      newEnd.setDate(newEnd.getDate() - shiftDays);
    } else {
      newStart.setDate(newStart.getDate() + shiftDays);
      newEnd.setDate(newEnd.getDate() + shiftDays);
    }

    setDateStart(newStart);
    setDateEnd(newEnd);
  };

  useEffect(() => {
    if (dateRange.value !== 'custom') {
      const { start, end } = getDateRange(dateRange.value);
      setDateStart(start);
      setDateEnd(end);
    }
  }, [dateRange]);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams({
      date_start: formatDateForAPI(dateStart),
      date_end: formatDateForAPI(dateEnd),
    });
    if (callType.value) {
      params.append('in_out', callType.value);
    }

    api
      .post(`/getList?${params.toString()}`)
      .then(response => {
        console.log('data fetched successfully:', response.data.results);
        setData(response.data.results);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('error fetching data:', error);
        setError('Ошибка загрузки данных');
        setIsLoading(false);
      });
  }, [callType, dateStart, dateEnd]);

  const handleCustomDateChange = (type, value) => {
    if (type === 'start') {
      setDateStart(new Date(value));
    } else {
      setDateEnd(new Date(value));
    }
  };

  return (
    <main className="main">
      <div className="container">
        <div className="outer-interaction">
          <div className="left-inner">
            <Select
              options={callTypeOptions}
              value={callType}
              onChange={setCallType}
              placeholder="Выберите тип звонка"
              className="call-type-select"
              classNamePrefix="react-select"
            />
          </div>
          <div className="right-inner">
            <div className="list-pagination">
              <button
                className="btn-arrow"
                onClick={() => shiftDateRange('prev')}
              >
                <ArrowLeft />
              </button>
              <Select
                options={dateRangeOptions}
                value={dateRange}
                onChange={setDateRange}
                placeholder="Выберите период"
                className="date-range-select"
                classNamePrefix="react-select"
              />

              <button
                className="btn-arrow"
                onClick={() => shiftDateRange('next')}
              >
                <ArrowRight />
              </button>
            </div>
            {dateRange.value === 'custom' && (
              <div className="inner-data">
                <input
                  type="date"
                  value={formatDateForAPI(dateStart)}
                  onChange={e =>
                    handleCustomDateChange('start', e.target.value)
                  }
                />
                <input
                  type="date"
                  value={formatDateForAPI(dateEnd)}
                  onChange={e => handleCustomDateChange('end', e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        <div className="table-container">
          <TableHeader />
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                padding: '50px',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            Array.isArray(data) &&
            data.map((item, index) => (
              <div
                key={index}
                className="table-row"
                onMouseEnter={() => setHoveredRowIndex(index)}
              >
                <div className="table-cell">
                  <IconCall in_out={item.in_out} status={item.status} />
                </div>
                <div className="table-cell">{formatTime(item.date)}</div>
                <div className="table-cell">
                  <img
                    className="avatar"
                    src={item.person_avatar}
                    alt={`Аватар ${item.person_name} ${item.person_surname}`}
                  />
                </div>
                <div className="table-cell">
                  {formatPhoneNumber(item.partner_data?.phone)}
                </div>
                <div className="table-cell">{item.line_name || ''}</div>
                <div className="table-cell grade-inner">
                  {item.errors[0] || getRandomGrade(item.status)}
                </div>
                <div className="table-cell">
                  <LazyAudioWrapper
                    hovered={hoveredRowIndex === index}
                    record={item.record}
                    partnership_id={item.partnership_id}
                    status={item.status}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
