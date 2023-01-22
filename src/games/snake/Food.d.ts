import { Matrix } from "../../math/Matrix";
import { Vector2 } from "../../math/Vector2";
import { Entity } from "./Entity";
import { SnakeBoard } from "./SnakeBoard";
export declare class Food implements Entity {
    private board;
    private position;
    constructor(board: SnakeBoard);
    update(): void;
    draw(screen: Matrix): void;
    testCollision(position: Vector2): boolean;
    handleCollision(entity: Entity): void;
    private regenerate;
}
