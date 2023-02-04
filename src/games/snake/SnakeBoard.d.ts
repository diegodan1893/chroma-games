import { Renderer } from "../../renderers/Renderer";
import { Vector2 } from "../../math/Vector2";
import { Entity } from "./Entity";
import { Game } from "../common/Game";
export declare class SnakeBoard implements Game {
    private renderer;
    private _width;
    private _height;
    private boardPosition;
    private state;
    private entities;
    private screen;
    private interval?;
    private inputAbortController?;
    constructor(renderer: Renderer, _width?: number, _height?: number, boardPosition?: Vector2);
    get width(): number;
    get height(): number;
    query(position: Vector2): Entity | undefined;
    startGame(): void;
    stopGame(): void;
    loseGame(): void;
    private update;
    private draw;
}
