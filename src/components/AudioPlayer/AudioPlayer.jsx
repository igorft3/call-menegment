import { useState, useRef, useEffect } from 'react';
import Play from '../../assets/icons/icon-play.svg?react';
import Pause from '../../assets/icons/icon-pause.svg?react';
import Download from '../../assets/icons/icon-download.svg?react';
import { getFullTime } from '../../utils/helper';
import { api } from './../utils/api';
import { CALL_STATUS } from './../utils/const';

export default function AudioPlayer({ record, partnership_id, status }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (status !== CALL_STATUS.SUCCESS) return;

    const fetchAudio = async () => {
      try {
        const res = await api.post(
          `/getRecord?record=${record}&partnership_id=${partnership_id}`,
          null,
          {
            responseType: 'blob',
          }
        );
        const blob = res.data;
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } catch (err) {
        console.error('Ошибка загрузки аудиозаписи:', err);
      }
    };

    fetchAudio();
  }, [record, partnership_id, status]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (!isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

    setIsPlaying(prev => !prev);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);

      const progress = (time / duration) * 100;
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${progress}%`;
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = e => {
    if (!audioRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    audioRef.current.currentTime = percentage * duration;
  };

  if (status !== CALL_STATUS.SUCCESS || !audioUrl) return <></>;

  return (
    <div className="audio-controller">
      <p className="time">{getFullTime(currentTime || duration)}</p>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <button className="play" onClick={handlePlayPause}>
        {isPlaying ? <Pause /> : <Play />}
      </button>
      <div className="progress-bar" onClick={handleProgressClick}>
        <div className="progress" ref={progressBarRef} />
      </div>
      <a className="download" href={audioUrl} download="record.mp3">
        <Download />
      </a>
    </div>
  );
}
