'use client'

import './page.css';
import { useWindowSize } from 'react-use';
import Pairs from './views/pairs/Pairs';


function Home() {
  const { width, height } = useWindowSize();

  return (
    <div className="Home">
      <Pairs width={width} height={height} />
    </div>
  );
}


export default Home;
