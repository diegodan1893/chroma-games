import { ReactNode } from "react";
interface BasePageProps {
    titleComponent: ReactNode;
    bodyComponent: ReactNode;
}
export declare const BasePage: ({ titleComponent, bodyComponent }: BasePageProps) => JSX.Element;
export {};
