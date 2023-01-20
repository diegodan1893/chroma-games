import { Vector2 } from "../math/Vector2"

export interface Entity {
	update: () => void
	draw: (screen: number[][]) => void
	testCollision: (position: Vector2) => boolean
	handleCollision: (entity: Entity) => void
	handleInput?: (key: string) => void
}
