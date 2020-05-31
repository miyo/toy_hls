interface ToyItem{
    dump() : void;
}

class Module implements ToyItem{
    name : string;
    inputs : Variable[];
    outputs : Variable[];
    variables : Variable[];
    functions : Function[];
    body : Statement;
    constructor(
        name : string,
        inputs : Variable[],
        outputs : Variable[],
        variables : Variable[],
        functions : Function[],
        body : Statement
    ){
        this.name = name;
        this.inputs = inputs;
        this.outputs = outputs;
        this.variables = variables;
        this.functions = functions;
        this.body = body;
    }
    dump() : void{
        console.log("Module : " + this.name);
        this.inputs.forEach( (i : Variable) => { i.dump(); });
        this.outputs.forEach( (o : Variable) => { o.dump(); });
        this.variables.forEach( (v : Variable) => { v.dump(); });
        this.functions.forEach( (f : Function) => { f.dump(); });
        this.body.dump();
    }
}

class Variable implements ToyItem{
    name : string;
    type : TypeInfo;
    constructor(
        name : string,
        type : TypeInfo
    ){
        this.name = name;
        this.type = type;
    }
    dump() : void{
        console.log("Variable : " + this.name);
        this.type.dump();
    }
}

interface TypeInfo extends ToyItem{
}

interface Function extends ToyItem{
}

abstract class Statement implements ToyItem{
    label : string;
    constructor(label? : string){
        this.label = label == null ? "none" : label;
    }
    abstract dump() : void;
}

abstract class Expression implements ToyItem{
    abstract dump() : void;
}

abstract class Value extends Expression{
    abstract dump() : void;
}

class BitType implements TypeInfo{
    constructor(){}
    dump() : void{
        console.log("BitType");
    }
}

class VectorType implements TypeInfo{
    size : number;
    constructor(
        size : number
    ){
        this.size = size;
    }
    dump() : void{
        console.log("VectorType : " + this.size);
    }
}

class Loop extends Statement{
    label : string;
    body : Statement;
    constructor(body: Statement, label?: string){
        super(label);
        this.body = body;
    }
    dump() : void{
        console.log("Loop : " + "(" + this.label + ")");
        this.body.dump();
    }
}

class IfStmt extends Statement{
    then_stmt : Statement;
    else_stmt : Statement;
    cond : Expression;
    constructor(
        then_stmt : Statement,
        else_stmt : Statement,
        cond : Expression,
        label? : string
    ){
        super(label);
        this.then_stmt = then_stmt;
        this.else_stmt = else_stmt;
        this.cond = cond;
    }
    dump() : void{
        console.log("If : " + "(" + this.label + ")");
        this.cond.dump();
        this.then_stmt.dump();
        this.else_stmt.dump();
    }
}

class Block extends Statement{
    stmts : Statement[];
    constructor(
        stmts : Statement[],
        label? : string
    ){
        super(label);
        this.stmts = stmts;
    }
    dump() : void{
        console.log("Block : " + "(" + this.label + ")");
        this.stmts.forEach((s) => s.dump());
    }
}

class Assign extends Statement{
    dst : Expression;
    src : Expression;
    constructor(
        dst : Expression,
        src : Expression,
        label? : string
    ){
        super(label);
        this.dst = dst;
        this.src = src;
    }
    dump() : void {
        console.log("Assign : " + "(" + this.label + ")");
        this.dst.dump();
        this.src.dump();
    }
}

class BinaryExpression extends Expression{
    op : string;
    args : Value[];
    constructor(
        op : string,
        args : Expression[]
    ){
        super();
        this.op = op;
        this.args = args;
    }
    dump() : void {
        console.log("BinaryExpr : " + "(" + this.op + ")");
        this.args.forEach((a) => { a.dump() });
    }
}

class UnaryExpression extends Expression{
    op : string;
    arg : Value;
    constructor(
        op : string,
        arg : Expression
    ){
        super();
        this.op = op;
        this.arg = arg;
    }
    dump() : void {
        console.log("UnaryExpr : " + "(" + this.op + ")");
        this.arg.dump();
    }
}

class VariableRef extends Value{
    name : string;
    constructor(
        name : string
    ){
        super();
        this.name = name;
    }
    dump() : void {
        console.log("VariableRef : " + this.name);
    }
}

class IntImm extends Value{
    value : number;
    constructor(
        value : number
    ){
        super();
        this.value = value;
    }
    dump() : void {
        console.log("IntImm : " + this.value);
    }
}

function parse_ports(ports : {}[]) : Variable[]{
    let v : Variable[] = new Array(ports.length);
    console.log("ports.length=" + ports.length);
    for(var i = 0; i < ports.length; i++){
        let n = ports[i]["name"];
        let t = ports[i]["type"]["kind"] == "bit" ? new BitType() : new VectorType(ports[i]["type"]["size"]);
        v[i] = new Variable(n, t);
    }
    return v;
}

function parse_functions(functions : {}[]) : Function[]{
    console.log("functions.length=" + functions.length);
    var f : Function[] = new Array(functions.length);
    return f;
}

function parse_statement(s: {}) : Statement{
    let label = s["label"];
    switch (s["kind"]){
        case "loop": {
            let body = parse_statement(s["body"]);
            return new Loop(body, label);
        }
        case "block": {
            let block : {}[] = s["block"];
            let stmts : Statement[] = new Array(block.length);
            for(let i = 0; i < block.length; i++){
                stmts[i] = parse_statement(block[i]);
            }
            return new Block(stmts);
        }
        case "if": {
            let cond = parse_expression(s["cond"]);
            let then_part = parse_statement(s["then_part"]);
            let else_part = parse_statement(s["then_part"]);
            return new IfStmt(then_part, else_part, cond);
        }
        case "assign": {
            let dst = parse_expression(s["dst"]);
            let src = parse_expression(s["dst"]);
            return new Assign(dst, src);
        }
    }
}

function parse_expression(e: {}) : Expression {
    switch (e["kind"]){
        case "variable": {
            let name = e["name"];
            return new VariableRef(name);
        }
        case "int": {
            let num = e["num"];
            return new IntImm(num);
        }
        case "binary_expr": {
            let op = e["op"];
            let args : Expression[] = new Array(e["args"].length);
            for(var i = 0; i < args.length; i++){
                args[i] = parse_expression(e["args"][i]);
            }
            return new BinaryExpression(op, args);
        }
        case "unary_expr": {
            let op = e["op"];
            let arg = parse_expression(e["arg"]);
            return new UnaryExpression(op, arg);
        }
    }
}

export function parse_module(data : {}){
    console.log(data);
    let name = data["name"];
    let inputs = parse_ports(data["inputs"]);
    let outputs = parse_ports(data["outputs"]);
    let variables = parse_ports(data["variables"]);
    let functions = parse_functions(data["functions"]);
    let body = parse_statement(data["body"]);

    return new Module(name, inputs, outputs, variables, functions, body);
}
