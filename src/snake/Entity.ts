export interface Entity {
	update: () => void
	draw: (screen: number[][]) => void
	handleCollision: (entity: Entity) => void
}
