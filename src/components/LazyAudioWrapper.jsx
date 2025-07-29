import { CALL_STATUS } from '../utils/const';
import AudioPlayer from '../components/AudioPlayer/AudioPlayer.jsx';

export function LazyAudioWrapper({ hovered, record, partnership_id, status }) {
  if (status !== CALL_STATUS.SUCCESS || !hovered) return null;

  return (
    <div className="lazy-audio">
      <AudioPlayer
        record={record}
        partnership_id={partnership_id}
        status={status}
      />
    </div>
  );
}
