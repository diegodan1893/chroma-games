export declare class Matrix {
    private width;
    private height;
    private fillValue;
    private _data;
    constructor(width: number, height: number, fillValue?: number);
    get data(): number[][];
    clear(): void;
    set(x: number, y: number, value: number): void;
    copy(matrix: Matrix, offsetX?: number, offsetY?: number): void;
}
