import { Vector2 } from "../math/Vector2"
import { Matrix } from "../math/Matrix"

export interface Renderer {
	clear: () => void
	copy: (image: Matrix, offset?: Vector2) => void
	present: () => void
}
