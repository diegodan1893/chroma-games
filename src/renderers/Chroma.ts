import { CopyParameters, Matrix } from "../math/Matrix"
import { Renderer } from "./Renderer"

const RAZER_CHROMA_URI = "http://localhost:54235/razer/chromasdk"

interface ChromaInitOptions {
	title: string
	description: string
	authorName: string
	authorContact: string
	supportedDevices: string[]
	category: string
}

interface RequestOptions {
	url?: string
	path?: string
	method?: "GET" | "POST" | "PUT" | "DELETE"
	body?: object
}

export class Chroma implements Renderer {
	private uri?: string
	private sessionId?: number
	private interval?: ReturnType<typeof setTimeout>

	private keyboard: Matrix

	constructor() {
		this.keyboard = new Matrix(22, 6)
	}

	async init(initOptions: ChromaInitOptions): Promise<boolean> {
		if (this.uri) {
			// Already initialized
			return true
		}

		try {
			const response = await this.request({
				url: RAZER_CHROMA_URI,
				body: {
					title: initOptions.title,
					description: initOptions.description,
					author: {
						name: initOptions.authorName,
						contact: initOptions.authorContact,
					},
					device_supported: initOptions.supportedDevices,
					category: initOptions.category,
				},
			})

			this.uri = response.uri
			this.sessionId = response.sessionid

			this.interval = setInterval(async () => {
				await this.request({
					method: "PUT",
					path: "/heartbeat",
				})
			}, 1000)

			return true
		} catch (error) {
			console.error(error)
			return false
		}
	}

	async uninitialize() {
		if (!this.uri) {
			return
		}

		await this.request({ method: "DELETE" })

		if (this.interval) {
			clearInterval(this.interval)
		}
	}

	clear() {
		this.keyboard.clear()
	}

	copy(copyParameters: CopyParameters) {
		this.keyboard.copy(copyParameters)
	}

	async present() {
		await this.request({
			path: "/keyboard",
			method: "PUT",
			body: {
				effect: "CHROMA_CUSTOM",
				param: this.keyboard.data,
			},
		})
	}

	async request(options: RequestOptions) {
		let url = options.url || this.uri
		if (!url) {
			return
		}

		const requestInit: RequestInit = {
			method: options.method || "POST",
		}

		if (options.body) {
			requestInit.headers = {
				"content-type": "application/json",
			}

			requestInit.body = JSON.stringify(options.body)
		}

		if (options.path) {
			url += options.path
		}

		const response = await fetch(url, requestInit)
		return await response.json()
	}
}
