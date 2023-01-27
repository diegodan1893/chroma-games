import { Vector2 } from "../math/Vector2"
import { Rect } from "../math/Rect"
import { Matrix } from "../math/Matrix"

export interface Renderer {
	clear: () => void
	copy: (image: Matrix, offset?: Vector2, dstRect?: Rect) => void
	present: () => void
}
