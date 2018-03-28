import { AbstractSyntaxTreeBase } from './ast.base';
import { TokenHelper } from './token/token.helper';
import { Token } from './token/token';

export class AbstractSyntaxTree extends AbstractSyntaxTreeBase {
    get expression(): string[] {
        return this.makeExpression();
    }

    private getParentOperator(): AbstractSyntaxTree {
        if (this.isRoot())
            return undefined;

        return this.parent.findOperator();
    }

    private findOperator(): AbstractSyntaxTree {
        if (this.type === Token.Type.Operator)
            return this;

        return this.parent.findOperator();
    }

    private makeExpression(): string[] {
        return this.type === Token.Type.Operator
            ? this.makeOperatorExpression()
            : this.makeValueExpression();
    }

    private makeOperatorExpression(): string[] {
        const expression = [
            ...this.leftNode ? this.leftNode.expression : [],
            this.value,
            ...this.rightNode ? this.rightNode.expression : []
        ];

        const parentOperator = this.getParentOperator();
        return parentOperator && TokenHelper.isHigher(parentOperator.value, this.value)
            ? [Token.literal.BracketOpen, ...expression, Token.literal.BracketClose]
            : expression;

    }

    private makeValueExpression(): string[] {
        return [this.value];
    }
}
