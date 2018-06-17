import { AbstractSyntaxTree } from './ast';
export declare type subNodeSide = 'left' | 'right';
export declare class AbstractSyntaxTreeHelper {
    static getNodeDisplay(node: AbstractSyntaxTree, depth?: number): string;
    private static getSubNodeDisplay;
    private static getTab;
}
