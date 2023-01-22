import { Game } from "../../games/common/Game";
import { Chroma } from "../../chroma/Chroma";
type GameFactory = (chroma: Chroma) => Game;
export declare const useGameLoader: (title: string, description: string, createGame: GameFactory) => {
    loading: boolean;
    error: boolean;
};
export {};
