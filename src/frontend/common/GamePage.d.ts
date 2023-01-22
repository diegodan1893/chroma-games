import { ReactNode } from "react";
interface GamePageProps {
    titleComponent: ReactNode;
    bodyComponent: ReactNode;
    loading?: boolean;
    error?: boolean;
}
export declare const GamePage: ({ titleComponent, bodyComponent, loading, error, }: GamePageProps) => JSX.Element;
export {};
