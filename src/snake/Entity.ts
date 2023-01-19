export interface Entity {
	update: () => void
	handleCollision: (entity: Entity) => void
}
