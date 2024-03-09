'use-client'

import { useEffect, useMemo, useState } from "react";
import { Tile } from "../../components/Tile";
import Popup from "../../components/Popup/Popup";
import { Slide } from "react-awesome-reveal";


function generateRandomColors(length: number): string[] {
    const baseColor = [
        Math.floor(Math.random() * 256), // Red component
        Math.floor(Math.random() * 256), // Green component
        Math.floor(Math.random() * 256)  // Blue component
    ];

    return Array.from({ length }, () => {
        const variation = 150; // Adjust this value to control the color variation
        const color = baseColor.map(component => (
            Math.min(255, Math.max(0, component + Math.floor(Math.random() * variation - variation / 2)))
        ));
        return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    });
}

const Pairs = ({ width, height }) => {

    const [tiles, setTiles] = useState({ x: 0, y: 0 });
    const size = { x: width / tiles.x, y: height / tiles.y };
    const [selecteds, setSelecteds] = useState<boolean[]>([]);
    const [prevColor, setPrevColor] = useState<string>('');
    const [prevId, setPrevId] = useState<number>(9999);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [retry, setRetry] = useState<boolean>(false);
    const [forceUpdate, setForceUpdate] = useState(false);


    useEffect(() => {
        if (retry) {
            setStartTime(null);
            setEndTime(null);
            setSelecteds([]);
            setPrevColor('');
            setPrevId(9999);
            setRetry(false);
            generateNewTiles();
        }
    }, [retry]);

    useEffect(() => {
        generateNewTiles();
    }, [width, height]);

    const generateNewTiles = () => {

        let xTiles, yTiles;
        if (width > height) {
            yTiles = 4;
            xTiles = Math.floor(yTiles * (width / height));
        } else {
            xTiles = 4;
            yTiles = Math.floor(xTiles * (height / width));
        }
        setTiles({ x: xTiles, y: yTiles });
        setForceUpdate((prev) => !prev);
    };


    const colorPairs = useMemo(() => {
        const randomColors = generateRandomColors((tiles.x * tiles.y) / 2);
        return [...randomColors, ...randomColors].sort(() => Math.random() - 0.5);
    }, [tiles.x, tiles.y, forceUpdate]);

    const colors = useMemo(() => {
        return Array.from({ length: tiles.y }, (_, i) =>
            Array.from({ length: tiles.x }, (_, j) => colorPairs[i * tiles.x + j])
        );
    }, [colorPairs, tiles.x, tiles.y]);

    const handleTileClick = (color: string, id: number) => {
        if (retry) return;

        if (startTime === null) {
            setStartTime(Date.now());
        }

        let newSelecteds = [...selecteds];

        if (prevId === 9999) {
            setPrevId(id);
            setPrevColor(color);
            newSelecteds[id] = true;
            setSelecteds(newSelecteds);
        } else {
            setPrevId(9999);
            setPrevColor('');
            if (color !== prevColor) {
                newSelecteds = [];
                setSelecteds(newSelecteds);
            } else {
                newSelecteds[id] = true;
                setSelecteds(newSelecteds);
            }
        }

        if (newSelecteds.filter((selected) => selected).length === tiles.x * tiles.y) {
            setEndTime(Date.now());
        }
    };

    const handleRetryClick = () => {
        setRetry(true);
    };

    const handleShareClick = () => {
        console.log('Compartir en redes sociales');
    };

    const timeResult = useMemo(() => {
        if (startTime !== null && endTime !== null) {
            const elapsedTimeInSeconds = (endTime - startTime) / 1000;
            return elapsedTimeInSeconds.toFixed(2);
        }
        return null;
    }, [startTime, endTime]);

    return (
        <>
          {endTime !== null && (
            <Slide>
              <div style={{ height: '100vh', backgroundColor: '#000'}}>
                <Popup
                  timeResult={timeResult}
                  onRetryClick={handleRetryClick}
                  onShareClick={handleShareClick}
                />
              </div>
            </Slide>
          )}
          {endTime === null && (<div>
            {colors.map((rowColors, i) => (
              <div style={{ display: 'flex' }} key={i}>
                {rowColors.map((color, j) => (
                  <Tile
                    size={size}
                    color={color}
                    onTileClick={handleTileClick}
                    id={Number(i + '' + j)}
                    selected={selecteds[Number(i + '' + j)]}
                    key={Number(i + '' + j)}
                  />
                ))}
              </div>
            ))}
          </div>)}
        </>
      );
}

export default Pairs;