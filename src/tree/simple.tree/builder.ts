import { AbstractSyntaxTree } from '../../ast';
import { TokenHelper } from '../../token/token.helper';
import { Token } from '../../token/token';
import { TreeError } from '../tree.error';
import { ParserError } from '../../error';
import { TreeBuilderBase } from '../tree.base';
import { Operand, Tree, Node, Value } from './type'; './type';

export class TreeBuilder extends TreeBuilderBase<Tree> {
    public makeTree(): Tree {
        if (!this.ast)
            throw new ParserError(TreeError.astIsEmpty);

        const tree = this.makeNode(this.ast);
        if ((tree as Operand).value)
            throw new ParserError(TreeError.invalidParserTree);

        return tree as Tree;
    }

    private makeNode(sourceNode: AbstractSyntaxTree): Node {
        return sourceNode.type === Token.Type.Operator
            ? this.makeOperatorNode(sourceNode)
            : this.makeValueNode(sourceNode);
    }

    private makeOperatorNode(sourceNode: AbstractSyntaxTree): Tree {
        return {
            operator: sourceNode.value,
            operand1: this.makeNode(sourceNode.leftNode),
            operand2: this.makeNode(sourceNode.rightNode)
        };
    }

    private makeValueNode(sourceNode: AbstractSyntaxTree): Operand {
        return {
            value: this.makeOperandValue(sourceNode)
        };
    }

    private makeOperandValue(sourceNode: AbstractSyntaxTree): Value {
        const type = TokenHelper.isObject(sourceNode.value)
            ? 'item'
            : 'unit';
        return {
            type,
            [type]: sourceNode.value
        };
    }
}
