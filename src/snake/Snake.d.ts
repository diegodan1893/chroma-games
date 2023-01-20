import { Matrix } from "../math/Matrix";
import { Vector2 } from "../math/Vector2";
import { Entity } from "./Entity";
import { SnakeBoard } from "./SnakeBoard";
export declare class Snake implements Entity {
    private board;
    private head;
    private _alive;
    constructor(board: SnakeBoard, position: Vector2, length: number);
    get alive(): boolean;
    update(): void;
    draw(screen: Matrix): void;
    testCollision(position: Vector2): boolean;
    handleCollision(entity: Entity): void;
    handleInput(key: string): void;
    grow(length?: number): void;
    kill(): void;
}
