import { LoggerCode } from './logger.code';

export const LoggerMessage: { [key: number]: string } = {
    [LoggerCode.InvalidToken]: '{0} token is invalid type',
    [LoggerCode.NotSupported]: '\'{0}\' operator is not supported.',
    [LoggerCode.InvalidLeftOperand]: 'Left side operand is not valid.',
    [LoggerCode.InvalidRightOperand]: 'Right side operand is not valid.',
    [LoggerCode.OpenBracket]: 'Bracket must be opened.',
    [LoggerCode.CloseBracket]: 'Bracket must be closed.',
    [LoggerCode.InvalidOperatorKey]: 'Operator\'s key must be in result.',
    [LoggerCode.InvalidLeftOperandKey]: 'Left operand\'s key must be in result.',
    [LoggerCode.InvalidRightOperandKey]: 'Right operand\'s key must be in result.',
    [LoggerCode.InvalidFormulaExpression]: 'Metric expression is null or undefined.'
}
