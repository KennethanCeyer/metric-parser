import { Tree } from '../tree/simple.tree/type';
import { TokenHelper } from './token.helper';
import { Token } from './token';
import { AbstractSyntaxTree } from '../ast';
import { TokenEnumerable } from './token.enumerable';
import { ParserError } from '../error';
import { TokenError } from './token.error';
import { TreeBuilder } from '../tree/simple.tree/builder';
import { TokenValidator } from './token.validator';

export class TokenAnalyzer extends TokenEnumerable {
    private ast: AbstractSyntaxTree;
    private currentTree: AbstractSyntaxTree;

    constructor(token: Token.Token[]) {
        super(token);
    }

    public parse(): Tree {
        this.initialize();
        this.makeAst();
        return this.try(() => this.makeTree());
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

        if (this.ast.hasOpenBracket())
            this.handleError(new ParserError(TokenError.missingCloseBracket));
    }

    private try<T>(tryFunction: Function): T {
        try {
            return tryFunction();
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: ParserError) {
        throw error.withStack(this.stack);
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

    private analyzeBracketToken(token: Token.Token) {
        const lastToken = this.popStack();
        if (TokenHelper.isBracketOpen(token)) {
            if (lastToken && !TokenHelper.isSymbol(lastToken))
                this.insertImplicitMultiplication();

            this.currentTree = this.currentTree.insertNode(token);
            return;
        }

        if (TokenHelper.isBracketClose(token)) {
            this.currentTree = this.currentTree.removeClosestBracket();
            this.ast = this.currentTree.findRoot();
            return;
        }
    }

    private analyzeOperatorToken(token: Token.Token) {
        const lastToken = this.popStack();

        if (TokenHelper.isOperator(lastToken))
            throw new ParserError(TokenError.invalidTwoOperator, lastToken, token);

        if (!this.currentTree.value)
            this.currentTree.value = token;
        else {
            if (!TokenHelper.isBracket(this.currentTree.value) && !this.currentTree.rightNode)
                throw new ParserError(TokenError.invalidTwoOperator, lastToken, token);

            this.currentTree = this.currentTree.insertNode(token);
            this.ast = this.ast.findRoot();
        }
    }

    private insertImplicitMultiplication() {
        this.analyzeToken(Token.literal.Multiplication);
        this.addStack(Token.literal.Multiplication);
    }

    private makeTree(): Tree {
        const treeParser = new TreeBuilder();
        return treeParser.makeTree(this.ast);
    }
}
