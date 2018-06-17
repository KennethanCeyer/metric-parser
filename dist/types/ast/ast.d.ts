import { AbstractSyntaxTreeBase } from './ast.base';
export declare class AbstractSyntaxTree extends AbstractSyntaxTreeBase {
    readonly expression: string[];
    private getParentOperator;
    private isNeededBracket;
    private findOperator;
    private makeExpression;
    private makeOperatorClause;
    private makeOperatorExpression;
    private makeValueExpression;
    private wrapBracket;
}
