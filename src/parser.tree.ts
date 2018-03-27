import { AbstractSyntaxTree } from './parser.ast';
import { Operand, OperandValue, ParserTreeModel } from './parser.tree.type';
import { TokenHelper } from './token.helper';
import { Token } from './token';

export class ParserTree {
    public constructor(private ast: AbstractSyntaxTree) {
    }

    public makeTree(): ParserTreeModel {
        if (!this.ast)
            return undefined;

        const tree = this.makeNode(this.ast);
        if ((tree as Operand).value)
            throw new Error('error: invalid parser tree');

        return tree as ParserTreeModel;
    }

    private makeNode(sourceNode: AbstractSyntaxTree): ParserTreeModel | Operand {
        return sourceNode.getType() === Token.Type.Operator
            ? this.makeOperatorNode(sourceNode)
            : this.makeValueNode(sourceNode);
    }

    private makeOperatorNode(sourceNode: AbstractSyntaxTree): ParserTreeModel {
        return {
            operator: sourceNode.getValue(),
            operand1: this.makeNode(sourceNode.getLeftNode()),
            operand2: this.makeNode(sourceNode.getRightNode())
        };
    }

    private makeValueNode(sourceNode: AbstractSyntaxTree): Operand {
        return {
            value: this.makeOperandValue(sourceNode)
        };
    }

    private makeOperandValue(sourceNode: AbstractSyntaxTree): OperandValue {
        const type = TokenHelper.isObject(sourceNode.getValue())
            ? 'item'
            : 'unit';
        return {
            type,
            [type]: sourceNode.getValue()
        };
    }
}
