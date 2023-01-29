import { CopyParameters } from "../math/Matrix"

export interface Renderer {
	clear: () => void
	copy: (copyParameters: CopyParameters) => void
	present: () => Promise<void>
}
