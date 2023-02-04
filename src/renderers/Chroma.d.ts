import { CopyParameters } from "../math/Matrix";
import { Renderer } from "./Renderer";
interface ChromaInitOptions {
    title: string;
    description: string;
    authorName: string;
    authorContact: string;
    supportedDevices: string[];
    category: string;
}
interface RequestOptions {
    url?: string;
    path?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: object;
}
export declare class Chroma implements Renderer {
    private uri?;
    private sessionId?;
    private interval?;
    private keyboard;
    constructor();
    init(initOptions: ChromaInitOptions): Promise<boolean>;
    uninitialize(): Promise<void>;
    clear(): void;
    copy(copyParameters: CopyParameters): void;
    present(): Promise<void>;
    request(options: RequestOptions): Promise<any>;
}
export {};
