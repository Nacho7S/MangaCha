import React, { useState } from 'react';
import { ReactInternetSpeedMeter } from 'react-internet-meter';
import { MangaRead } from '../pages/MangaRead/MangaRead';
// import 'react-internet-speed-meter/dist/index.css';

export const TrackSpeedInternet = () => {
  const [quality, setQuality] = useState(''); 

  const handleSpeedTest = (speed) => {
    if (speed >= 6) { //mbps cuy
      setQuality('highQuality');
    } else if (speed <= 5) {
      setQuality('lowQuality');
    }
  };

  return (
    <>
    <ReactInternetSpeedMeter
      txtSubHeading=""
      outputType="alert"
      customClassName={null}
      txtMainHeading=""
      pingInterval={60000} // milliseconds
      thresholdUnit="megabyte" // "byte", "kilobyte", "megabyte"
      threshold={100}
      imageUrl="https://i.pinimg.com/564x/0e/63/85/0e6385d2189bae35b2e84ddfc0a80d3c.jpg"
      downloadSize="178128" // bytes
      callbackFunctionOnNetworkDown={(speed) => console.log(`Internet speed is down ${speed}`)}
      callbackFunctionOnNetworkTest={(speed) => handleSpeedTest(speed)}
      />
      <MangaRead qualitySpeed={quality} />
      </>
  );
};
