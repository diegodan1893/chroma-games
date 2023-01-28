import { Vector2 } from "../../math/Vector2"

// Data from https://harddrop.com/wiki/SRS

export interface WallKickData {
	clockwise: Vector2[][]
	counterClockwise: Vector2[][]
}

export const JLSTZ_WALL_KICK_DATA: WallKickData = {
	clockwise: [
		[
			{ x: 0, y: 0 },
			{ x: 0, y: -1 },
			{ x: -1, y: -1 },
			{ x: 2, y: 0 },
			{ x: 2, y: -1 },
		],
		[
			{ x: 0, y: 0 },
			{ x: 0, y: -1 },
			{ x: 1, y: -1 },
			{ x: -2, y: 0 },
			{ x: -2, y: -1 },
		],
		[
			{ x: 0, y: 0 },
			{ x: 0, y: 1 },
			{ x: -1, y: 1 },
			{ x: 2, y: 0 },
			{ x: 2, y: 1 },
		],
		[
			{ x: 0, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: -2, y: 0 },
			{ x: -2, y: 1 },
		],
	],
	counterClockwise: [
		[
			{ x: 0, y: 0 },
			{ x: 0, y: 1 },
			{ x: -1, y: 1 },
			{ x: 2, y: 0 },
			{ x: 2, y: 1 },
		],
		[
			{ x: 0, y: 0 },
			{ x: 0, y: -1 },
			{ x: 1, y: -1 },
			{ x: -2, y: 0 },
			{ x: -2, y: -1 },
		],
		[
			{ x: 0, y: 0 },
			{ x: 0, y: -1 },
			{ x: -1, y: -1 },
			{ x: 2, y: 0 },
			{ x: 2, y: -1 },
		],
		[
			{ x: 0, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: -2, y: 0 },
			{ x: -2, y: 1 },
		],
	],
}

export const I_WALL_KICK_DATA: WallKickData = {
	clockwise: [
		[
			{ x: 0, y: 0 },
			{ x: 0, y: 1 },
			{ x: 0, y: -2 },
			{ x: -2, y: 1 },
			{ x: 1, y: -2 },
		],
		[
			{ x: 0, y: 0 },
			{ x: 0, y: -2 },
			{ x: 0, y: 1 },
			{ x: -1, y: -2 },
			{ x: 2, y: 1 },
		],
		[
			{ x: 0, y: 0 },
			{ x: 0, y: -1 },
			{ x: 0, y: 2 },
			{ x: 2, y: -1 },
			{ x: -1, y: 2 },
		],
		[
			{ x: 0, y: 0 },
			{ x: 0, y: 2 },
			{ x: 0, y: -1 },
			{ x: 1, y: 2 },
			{ x: -2, y: -1 },
		],
	],
	counterClockwise: [
		[
			{ x: 0, y: 0 },
			{ x: 0, y: 2 },
			{ x: 0, y: -1 },
			{ x: 1, y: 2 },
			{ x: -2, y: -1 },
		],
		[
			{ x: 0, y: 0 },
			{ x: 0, y: 1 },
			{ x: 0, y: -2 },
			{ x: -2, y: 1 },
			{ x: 1, y: -2 },
		],
		[
			{ x: 0, y: 0 },
			{ x: 0, y: -2 },
			{ x: 0, y: 1 },
			{ x: -1, y: -2 },
			{ x: 2, y: 1 },
		],
		[
			{ x: 0, y: 0 },
			{ x: 0, y: -1 },
			{ x: 0, y: 2 },
			{ x: 2, y: -1 },
			{ x: -1, y: 2 },
		],
	],
}

export const O_WALL_KICK_DATA: WallKickData = {
	clockwise: [
		[{ x: 0, y: 0 }],
		[{ x: 0, y: 0 }],
		[{ x: 0, y: 0 }],
		[{ x: 0, y: 0 }],
	],
	counterClockwise: [
		[{ x: 0, y: 0 }],
		[{ x: 0, y: 0 }],
		[{ x: 0, y: 0 }],
		[{ x: 0, y: 0 }],
	],
}
