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

export class Chroma {
	private uri?: string
	private sessionId?: number
	private interval?: ReturnType<typeof setTimeout>

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
		clearInterval(this.interval!)
	}

	async request(options: RequestOptions) {
		if (!options.url && !this.uri) {
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

		let url = options.url || this.uri!
		if (options.path) {
			url += options.path
		}

		const response = await fetch(url, requestInit)
		return await response.json()
	}
}
