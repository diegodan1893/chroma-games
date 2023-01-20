import { Matrix } from "../math/Matrix";
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
export declare class Chroma {
    private uri?;
    private sessionId?;
    private interval?;
    private keyboard;
    constructor();
    init(initOptions: ChromaInitOptions): Promise<boolean>;
    uninitialize(): Promise<void>;
    drawKeyboard(image: Matrix, offsetX: number, offsetY: number): Promise<void>;
    request(options: RequestOptions): Promise<any>;
}
export {};
