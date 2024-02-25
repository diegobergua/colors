import { useEffect } from "react";

export const Tile = (props: { size: { x: number; y: number; }; color: string; onTileClick: (color: string, id: number) => void; id:number; selected: boolean }) => {


    const handleClick = () => {
        if(!props.selected){
            props.onTileClick(props.color, props.id);
        }
    };


    return (
        <div onClick={handleClick} style={{
            outline: "2px solid black",
            width: props.size.x,
            height: props.size.y,
            backgroundColor: props.selected?"black":props.color,
        }}>


        </div>
    );

}

