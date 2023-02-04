import { Rect } from "./Rect";
import { Vector2 } from "./Vector2";
export interface CopyParameters {
    matrix: Matrix;
    offset?: Vector2;
    dstRect?: Rect;
    tint?: number;
}
export declare class Matrix {
    private _width;
    private _height;
    private fillValue;
    mask: number | undefined;
    private _data;
    constructor(_width: number, _height: number, fillValue?: number);
    static from2dArray(data: number[][], fillValue?: number): Matrix;
    get width(): number;
    get height(): number;
    get data(): number[][];
    clear(): void;
    get(x: number, y: number): number;
    set(x: number, y: number, value: number): void;
    copy({ matrix, offset, dstRect, tint, }: CopyParameters): void;
    rotateClockwise(): Matrix;
    rotateCounterClockwise(): Matrix;
    private rotate;
}
