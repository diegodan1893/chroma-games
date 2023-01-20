import { Chroma } from "../chroma/Chroma";
import { Vector2 } from "../math/Vector2";
import { Entity } from "./Entity";
export declare class SnakeBoard {
    private chroma;
    private _width;
    private _height;
    private offsetX;
    private offsetY;
    private state;
    private entities;
    private screen;
    private interval?;
    private inputAbortController?;
    constructor(chroma: Chroma, _width: number, _height: number, offsetX: number, offsetY: number);
    get width(): number;
    get height(): number;
    update(): void;
    draw(): void;
    query(position: Vector2): Entity | undefined;
    startGame(): void;
    stopGame(): void;
    loseGame(): void;
}
