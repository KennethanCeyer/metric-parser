import { TokenHelper } from './token.helper';
import { Token } from './token';
import { AbstractSyntaxTree } from '../ast/ast';
import { TokenEnumerable } from './token.enumerable';
import { ParserError } from '../error';
import { TokenError } from './token.error';
import { TokenValidator } from './token.validator';
import { GeneralError } from '../error.value';
import { AbstractSyntaxTreeValidator } from '../ast/ast.validator';

export class TokenAnalyzer extends TokenEnumerable {
    private ast: AbstractSyntaxTree;
    private currentTree: AbstractSyntaxTree;

    constructor(token: Token.Token[]) {
        super(token);
    }

    public parse(): AbstractSyntaxTree {
        this.try(() => this.preValidate());
        this.initialize();
        this.try(() => this.makeAst());
        this.try(() => this.postValidate());
        return this.ast;
    }

    private initialize() {
        this.ast = new AbstractSyntaxTree(Token.literal.BracketOpen);
        this.ast.leftNode = new AbstractSyntaxTree();
        this.currentTree = this.ast.leftNode;
        this.rewind();
    }

    public getAst(): AbstractSyntaxTree {
        return this.ast;
    }

    private makeAst() {
        let token: Token.Token;

        while (token = this.next()) {
            this.try(() => this.doAnalyzeToken(token));
        }
        this.finalizeStack();
        this.ast = this.ast.removeRootBracket().findRoot();
    }

    private try<T>(tryFunction: Function): T {
        try {
            return tryFunction();
        } catch (error) {
            this.handleError(error);
        }
    }

    private preValidate() {
        if (!this.token || !this.token.length)
            throw new ParserError(TokenError.emptyToken);
    }

    private postValidate() {
        const error = AbstractSyntaxTreeValidator.validate(this.ast);

        if (error)
            throw error;
    }

    private handleError(error: ParserError) {
        if (error instanceof  ParserError)
            throw error.withStack(this.stack);

        throw new ParserError(GeneralError.unknownError).withStack(this.stack);
    }

    private doAnalyzeToken(token: Token.Token) {
        this.analyzeToken(token);
        this.addStack(token);
    }

    private analyzeToken(token: Token.Token) {
        const lastToken = this.popStack();
        if (TokenHelper.isBracket(token)) {
            this.analyzeBracketToken(token);
            return;
        }

        if (TokenHelper.isOperator(token)) {
            this.analyzeOperatorToken(token);
            return;
        }

        const error = TokenValidator.validateValueToken(token, lastToken);
        if (error)
            throw error;

        this.currentTree.insertNode(token);
    }

    private analyzeBracketToken(token: Token.Token): void {
        if (TokenHelper.isBracketOpen(token)) {
            this.analyzeImplicitToken();
            this.currentTree = this.currentTree.insertNode(token);
            return;
        }

        if (TokenHelper.isBracketClose(token)) {
            this.currentTree = this.currentTree.removeClosestBracket();
            this.ast = this.currentTree.findRoot();
            return;
        }
    }

    private analyzeOperatorToken(token: Token.Token): void {
        const lastToken = this.popStack();

        if (TokenHelper.isOperator(lastToken))
            throw new ParserError(TokenError.invalidTwoOperator, lastToken, token);

        if (!this.currentTree.value) {
            this.currentTree.value = token;
            return;
        }

        const error = AbstractSyntaxTreeValidator.validateInvalidTwoOperator(this.currentTree, token, lastToken);
        if (error)
            throw error;

        this.currentTree = this.currentTree.insertNode(token);
        this.ast = this.ast.findRoot();
    }

    private analyzeImplicitToken() {
        const lastToken = this.popStack();
        if (lastToken && !TokenHelper.isSymbol(lastToken) || TokenHelper.isBracketClose(lastToken))
            this.insertImplicitMultiplication();
    }

    private insertImplicitMultiplication() {
        this.analyzeToken(Token.literal.Multiplication);
        this.addStack(Token.literal.Multiplication);
    }
}
