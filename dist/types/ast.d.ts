import { AbstractSyntaxTreeBase } from './ast.base';
export declare class AbstractSyntaxTree extends AbstractSyntaxTreeBase {
    readonly expression: string[];
    private getParentOperator();
    private findOperator();
    private makeExpression();
    private makeOperatorExpression();
    private makeValueExpression();
}
