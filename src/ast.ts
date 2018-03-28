import { Token } from './token/token';
import { TokenHelper } from './token/token.helper';
import { TokenValidator } from './token/token.validator';
import { ParserError } from './error';
import { TokenError } from './token/token.error';

export class AbstractSyntaxTree {
    private _value: Token.Token;
    private _leftNode: AbstractSyntaxTree;
    private _rightNode: AbstractSyntaxTree;
    private _parent: AbstractSyntaxTree;
    private _type: Token.Type;
    private _subType: Token.SubType;

    get value(): Token.Token {
        return this._value;
    }

    set value(value: Token.Token) {
        this._value = TokenHelper.isNumeric(value)
            ? Number(value)
            : value;
        this._type = TokenHelper.induceType(this.value);
    }

    get type(): Token.Type {
        return this._type;
    }

    get subType(): Token.SubType {
        return this._subType;
    }

    set subType(value: Token.SubType) {
        this._subType = value;
    }

    get parent(): AbstractSyntaxTree {
        return this._parent;
    }

    set parent(value: AbstractSyntaxTree) {
        this._parent = value;
    }

    get leftNode(): AbstractSyntaxTree {
        return this._leftNode;
    }

    set leftNode(node: AbstractSyntaxTree) {
        if (!node) return;

        this._leftNode = node;
        node.parent = this;
    }

    get rightNode(): AbstractSyntaxTree {
        return this._rightNode;
    }

    set rightNode(node: AbstractSyntaxTree) {
        if (!node) return;

        this._rightNode = node;
        node.parent = this;
    }

    public constructor(value?: Token.Token) {
        if (value)
            this.value = value;
    }

    public findRoot(): AbstractSyntaxTree {
        if (this.isRoot())
            return this;

        return this._parent.findRoot();
    }

    public isRoot(): boolean {
        return !this._parent;
    }

    public hasOpenBracket(): boolean {
        if (TokenHelper.isBracketOpen(this.value))
            return true;

        const leftNodeHasOpenBracket = this.leftNode ? this.leftNode.hasOpenBracket() : false;
        const rightNodeHasOpenBracket = this.rightNode ? this.rightNode.hasOpenBracket() : false;

        return leftNodeHasOpenBracket || rightNodeHasOpenBracket;
    }

    private findOpenedBracket(): AbstractSyntaxTree {
        if (this.isRoot())
            return undefined;

        if (TokenHelper.isBracketOpen(this._value))
            return this;

        return this._parent.findOpenedBracket();
    }

    public removeRootBracket(): AbstractSyntaxTree {
        const rootNode = this.findRoot();


        if (TokenHelper.isBracketOpen(rootNode.value))
            rootNode.leftNode.removeParent();

        return this === rootNode
            ? rootNode.leftNode
            : this;
    }

    public removeClosestBracket(): AbstractSyntaxTree {
        const node = this.findOpenedBracket();

        if (!node)
            throw new ParserError(TokenError.missingOpenBracket);

        const targetNode = node.leftNode;
        targetNode.subType = Token.SubType.Group;

        if (!node.parent) {
            targetNode.removeParent();
            return targetNode;
        }

        if (node.parent.leftNode === node)
            node.parent.leftNode = targetNode;
        else
            node.parent.rightNode = targetNode;

        return node.parent;
    }

    private climbUp(token: Token.Token): AbstractSyntaxTree {
        return this.isClimbTop(token)
            ? this
            : this._parent.climbUp(token);
    }

    private isClimbTop(token: Token.Token) {
        return this.isTokenHighest(token) ||
            !this.parent ||
            TokenHelper.isBracketOpen(this.value);
    }

    private isTokenHighest(token: Token.Token) {
        return TokenHelper.isHigher(token, this.value) && this.subType !== Token.SubType.Group;
    }

    private createChildNode(value?: Token.Token): AbstractSyntaxTree {
        const node = new AbstractSyntaxTree(value);
        node.parent = this;
        return node;
    }

    private createParentNode(value?: Token.Token): AbstractSyntaxTree {
        const node = new AbstractSyntaxTree(value);
        this.parent = node;
        return node;
    }

    private insertOperatorNode(value: Token.Token) {
        const rootNode = this.climbUp(value);

        if (TokenHelper.isBracketOpen(rootNode.value))
            return rootNode.insertJointNodeToLeft(value);

        if (this.needJointRight(rootNode, value))
            return rootNode.insertJointNodeToRight(value);

        const newNode = rootNode.createParentNode(value);
        newNode.leftNode = rootNode;
        return newNode;
    }

    private needJointRight(rootNode: AbstractSyntaxTree, value: Token.Token) {
        return rootNode.isTokenHighest(value) && rootNode.parent || this === rootNode;
    }

    public insertNode(value: Token.Token): AbstractSyntaxTree {
        if (TokenHelper.isSymbol(value))
            if (!this.value) {
                this.value = value;
                return this;
            }

        if (TokenHelper.isOperator(value))
            return this.insertOperatorNode(value);

        const valueNode = this.createChildNode(value);
        if (!this.leftNode)
            this.leftNode = valueNode;
        else
            this.rightNode = valueNode;

        return valueNode;
    }

    private insertJointNodeToLeft(value: Token.Token) {
        const jointNode = this.createChildNode(value);
        jointNode.leftNode = this.leftNode;
        jointNode.rightNode = this.rightNode;
        this.leftNode = jointNode;
        return jointNode;
    }

    public insertJointNodeToRight(value: Token.Token) {
        const jointNode = this.createChildNode(value);
        jointNode.leftNode = this.rightNode;
        this.rightNode = jointNode;
        return jointNode;
    }

    public removeLeftNode() {
        this._leftNode.removeParent();
        this._leftNode = undefined;
    }

    public removeRightNode() {
        this._rightNode.removeParent();
        this._rightNode = undefined;
    }

    public removeParent() {
        this._parent = undefined;
    }
}
