import { AbstractSyntaxTree } from '../../ast';
import { TokenHelper } from '../../token/token.helper';
import { Token } from '../../token/token';
import { TreeError } from '../tree.error';
import { ParserError } from '../../error';
import { TreeBuilderBase } from '../tree.base';
import { Operand, Tree, Node, ValueObject, Value } from './type'; './type';

export class TreeBuilder extends TreeBuilderBase<Tree> {
    public makeTree(ast: AbstractSyntaxTree): Tree {
        if (!ast)
            throw new ParserError(TreeError.astIsEmpty);

        const tree = this.makeNode(ast);
        if ((tree as Operand).value)
            throw new ParserError(TreeError.invalidParserTree);

        return tree as Tree;
    }

    public makeAst(tree: Tree): AbstractSyntaxTree {
        return this.makeAstNode(tree);
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

    private makeOperandValue(sourceNode: AbstractSyntaxTree): ValueObject {
        const type = TokenHelper.isObject(sourceNode.value)
            ? 'item'
            : 'unit';
        return {
            type,
            [type]: sourceNode.value
        };
    }

    private makeAstNode(node: Node): AbstractSyntaxTree {
        if (!node)
            return;

        if (TreeBuilder.isTree(node)) {
            const tree = node as Tree;
            const ast = new AbstractSyntaxTree(tree.operator);
            ast.leftNode = this.makeAstNode(tree.operand1);
            ast.rightNode = this.makeAstNode(tree.operand2);
            return ast;
        }

        const operand = node as Operand;
        return new AbstractSyntaxTree(TreeBuilder.getValue(operand));
    }

    private static isTree(node: Node): boolean {
        return !!(node as Tree).operator;
    }

    private static getValue(operand: Operand): Value {
        return operand.value.type === 'item'
            ? operand.value.item
            : operand.value.unit;
    }
}
