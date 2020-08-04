(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.updateSize = void 0;
var module = require("./module");
function updateSize() {
    var reader = new FileReader();
    reader.onload = function () {
        var dst = document.getElementById("log");
        var str = reader.result.toString();
        var d = JSON.parse(str);
        dst.innerHTML += d['name'] + "<br>";
        var m = module.parse_module(d);
        m.dump();
    };
    for (var i = 0; i < this.files.length; i++) {
        reader.readAsText(this.files[i]);
    }
}
exports.updateSize = updateSize;

},{"./module":2}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.parse_module = void 0;
var Module = /** @class */ (function () {
    function Module(name, inputs, outputs, variables, functions, body) {
        this.name = name;
        this.inputs = inputs;
        this.outputs = outputs;
        this.variables = variables;
        this.functions = functions;
        this.body = body;
    }
    Module.prototype.dump = function () {
        console.log("Module : " + this.name);
        this.inputs.forEach(function (i) { i.dump(); });
        this.outputs.forEach(function (o) { o.dump(); });
        this.variables.forEach(function (v) { v.dump(); });
        this.functions.forEach(function (f) { f.dump(); });
        this.body.dump();
    };
    return Module;
}());
var Variable = /** @class */ (function () {
    function Variable(name, type) {
        this.name = name;
        this.type = type;
    }
    Variable.prototype.dump = function () {
        console.log("Variable : " + this.name);
        this.type.dump();
    };
    return Variable;
}());
var Statement = /** @class */ (function () {
    function Statement(label) {
        this.label = label == null ? "none" : label;
    }
    return Statement;
}());
var Expression = /** @class */ (function () {
    function Expression() {
    }
    return Expression;
}());
var Value = /** @class */ (function (_super) {
    __extends(Value, _super);
    function Value() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Value;
}(Expression));
var BitType = /** @class */ (function () {
    function BitType() {
    }
    BitType.prototype.dump = function () {
        console.log("BitType");
    };
    return BitType;
}());
var VectorType = /** @class */ (function () {
    function VectorType(size) {
        this.size = size;
    }
    VectorType.prototype.dump = function () {
        console.log("VectorType : " + this.size);
    };
    return VectorType;
}());
var Loop = /** @class */ (function (_super) {
    __extends(Loop, _super);
    function Loop(body, label) {
        var _this = _super.call(this, label) || this;
        _this.body = body;
        return _this;
    }
    Loop.prototype.dump = function () {
        console.log("Loop : " + "(" + this.label + ")");
        this.body.dump();
    };
    return Loop;
}(Statement));
var IfStmt = /** @class */ (function (_super) {
    __extends(IfStmt, _super);
    function IfStmt(then_stmt, else_stmt, cond, label) {
        var _this = _super.call(this, label) || this;
        _this.then_stmt = then_stmt;
        _this.else_stmt = else_stmt;
        _this.cond = cond;
        return _this;
    }
    IfStmt.prototype.dump = function () {
        console.log("If : " + "(" + this.label + ")");
        this.cond.dump();
        this.then_stmt.dump();
        this.else_stmt.dump();
    };
    return IfStmt;
}(Statement));
var Block = /** @class */ (function (_super) {
    __extends(Block, _super);
    function Block(stmts, label) {
        var _this = _super.call(this, label) || this;
        _this.stmts = stmts;
        return _this;
    }
    Block.prototype.dump = function () {
        console.log("Block : " + "(" + this.label + ")");
        this.stmts.forEach(function (s) { return s.dump(); });
    };
    return Block;
}(Statement));
var Assign = /** @class */ (function (_super) {
    __extends(Assign, _super);
    function Assign(dst, src, label) {
        var _this = _super.call(this, label) || this;
        _this.dst = dst;
        _this.src = src;
        return _this;
    }
    Assign.prototype.dump = function () {
        console.log("Assign : " + "(" + this.label + ")");
        this.dst.dump();
        this.src.dump();
    };
    return Assign;
}(Statement));
var BinaryExpression = /** @class */ (function (_super) {
    __extends(BinaryExpression, _super);
    function BinaryExpression(op, args) {
        var _this = _super.call(this) || this;
        _this.op = op;
        _this.args = args;
        return _this;
    }
    BinaryExpression.prototype.dump = function () {
        console.log("BinaryExpr : " + "(" + this.op + ")");
        this.args.forEach(function (a) { a.dump(); });
    };
    return BinaryExpression;
}(Expression));
var UnaryExpression = /** @class */ (function (_super) {
    __extends(UnaryExpression, _super);
    function UnaryExpression(op, arg) {
        var _this = _super.call(this) || this;
        _this.op = op;
        _this.arg = arg;
        return _this;
    }
    UnaryExpression.prototype.dump = function () {
        console.log("UnaryExpr : " + "(" + this.op + ")");
        this.arg.dump();
    };
    return UnaryExpression;
}(Expression));
var VariableRef = /** @class */ (function (_super) {
    __extends(VariableRef, _super);
    function VariableRef(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        return _this;
    }
    VariableRef.prototype.dump = function () {
        console.log("VariableRef : " + this.name);
    };
    return VariableRef;
}(Value));
var IntImm = /** @class */ (function (_super) {
    __extends(IntImm, _super);
    function IntImm(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    IntImm.prototype.dump = function () {
        console.log("IntImm : " + this.value);
    };
    return IntImm;
}(Value));
function parse_ports(ports) {
    var v = new Array(ports.length);
    console.log("ports.length=" + ports.length);
    for (var i = 0; i < ports.length; i++) {
        var n = ports[i]["name"];
        var t = ports[i]["type"]["kind"] == "bit" ? new BitType() : new VectorType(ports[i]["type"]["size"]);
        v[i] = new Variable(n, t);
    }
    return v;
}
function parse_functions(functions) {
    console.log("functions.length=" + functions.length);
    var f = new Array(functions.length);
    return f;
}
function parse_statement(s) {
    var label = s["label"];
    switch (s["kind"]) {
        case "loop": {
            var body = parse_statement(s["body"]);
            return new Loop(body, label);
        }
        case "block": {
            var block = s["block"];
            var stmts = new Array(block.length);
            for (var i = 0; i < block.length; i++) {
                stmts[i] = parse_statement(block[i]);
            }
            return new Block(stmts);
        }
        case "if": {
            var cond = parse_expression(s["cond"]);
            var then_part = parse_statement(s["then_part"]);
            var else_part = parse_statement(s["then_part"]);
            return new IfStmt(then_part, else_part, cond);
        }
        case "assign": {
            var dst = parse_expression(s["dst"]);
            var src = parse_expression(s["dst"]);
            return new Assign(dst, src);
        }
    }
}
function parse_expression(e) {
    switch (e["kind"]) {
        case "variable": {
            var name_1 = e["name"];
            return new VariableRef(name_1);
        }
        case "int": {
            var num = e["num"];
            return new IntImm(num);
        }
        case "binary_expr": {
            var op = e["op"];
            var args = new Array(e["args"].length);
            for (var i = 0; i < args.length; i++) {
                args[i] = parse_expression(e["args"][i]);
            }
            return new BinaryExpression(op, args);
        }
        case "unary_expr": {
            var op = e["op"];
            var arg = parse_expression(e["arg"]);
            return new UnaryExpression(op, arg);
        }
    }
}
function parse_module(data) {
    console.log(data);
    var name = data["name"];
    var inputs = parse_ports(data["inputs"]);
    var outputs = parse_ports(data["outputs"]);
    var variables = parse_ports(data["variables"]);
    var functions = parse_functions(data["functions"]);
    var body = parse_statement(data["body"]);
    return new Module(name, inputs, outputs, variables, functions, body);
}
exports.parse_module = parse_module;

},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var file_reader = require("./src/file_reader");
(function () {
    document.getElementById("uploadInput").addEventListener("change", file_reader.updateSize, false);
})();

},{"./src/file_reader":1}]},{},[3]);
