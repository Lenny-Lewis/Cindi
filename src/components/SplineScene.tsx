import { useState } from 'react';
import Spline from '@splinetool/react-spline';

const SCENE_URL = 'https://prod.spline.design/cEtzkozXgfiGBVYH/scene.splinecode';

export default function SplineScene() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="spline-scene" aria-busy={!loaded}>
      {!loaded && <span className="spline-loading" role="status">Loading 3D scene…</span>}
      <Spline
        className="spline-canvas"
        scene={SCENE_URL}
        onLoad={() => {
          setLoaded(true);
        }}
        aria-label="Interactive Mainframe 3D scene"
      />
    </div>
  );
}
