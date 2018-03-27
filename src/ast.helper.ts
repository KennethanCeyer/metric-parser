import { AbstractSyntaxTree } from './ast';

export type subNodeSide = 'left' | 'right';

export class AbstractSyntaxTreeHelper {
    public static getNodeDisplay(node: AbstractSyntaxTree, depth: number = 0): string {
        const leftNode = node.leftNode;
        const rightNode = node.rightNode;

        const tabString = this.getTab(depth);

        let display = '';
        display += `${tabString}* NODE\n`;
        display += `${tabString}- value: ${node.value}\n`;

        if (leftNode)
            display += this.getSubNodeDisplay('left', tabString, leftNode, depth);

        if (rightNode)
            display += this.getSubNodeDisplay('right', tabString, rightNode, depth);

        return display;
    }

    private static getSubNodeDisplay(side: subNodeSide, tabString: string, node: AbstractSyntaxTree, depth: number) {
        return [
            `${tabString}- ${side}:\n`,
            `${tabString}${this.getNodeDisplay(node, depth + 1)}\n`
        ].join('');
    }

    private static getTab(depth: number): string {
        const tab = [];
        const tabSize = 4;
        const tabCharacter = ' ';
        for (let index = 0; index < depth * tabSize; index += 1)
            tab.push(tabCharacter);
        return tab.join('');
    }
}
