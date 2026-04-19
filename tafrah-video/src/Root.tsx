import { Composition } from 'remotion';
import { TafrahVideo } from './TafrahVideo';
import './style.css';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TafrahPromo"
        component={TafrahVideo}
        durationInFrames={1800} // 60 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

