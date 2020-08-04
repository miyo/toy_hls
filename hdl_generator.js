const indent = function(level){
    return " ".repeat(level);
}

const generate_vreg = function(name, type){
    let width = 1;
    if(type == 'int'){
	width = 32;
    }
    return "reg [" + (width-1) + ":" + "0] " + name;
}
const generate_vwire = function(name, type){
    let width = 1;
    if(type == 'int'){
	width = 32;
    }
    return "wire [" + (width-1) + ":" + "0] " + name;
}
const generate_wire = function(name, width){
    return "wire " + name;
}

const generate_verilog_ioport = function(variables, tables){
    let str = "";
    str += indent(2) + "input wire clk";
    str += ",\n" + indent(2) + "input wire reset";
    variables.forEach(function(v){
	str += ",\n" + indent(2) + "input " + generate_wire(v['name'] + "_we");
	str += ",\n" + indent(2) + "ouput " + generate_vwire(v['name'] + "_o", v['type']);
	str += ",\n" + indent(2) + "input " + generate_vwire(v['name'] + "_i", v['type']);
    });
    tables.forEach(function(t){
	str += ",\n" + indent(2) + "input " + generate_wire(t['name'] + "_req");
	str += ",\n" + indent(2) + "output " + generate_wire(t['name'] + "_busy");
	if(t['return_type'] != 'void'){
	    str += ",\n" + indent(2) + "output " + generate_vwire(t['name'] + "_return", t['return_type']);
	}
	t['args'].forEach(function(a){
	    str += ",\n" + indent(2) + "input " + generate_vwire(t['name'] + "_" + a['name'] + "_in", a['type']);
	});
    });
    return str + "\n";
}


const generate_expr = function(expr){
    console.log(expr);
    switch(expr['kind']){
    case 'variable': return expr['name'];
    case 'constant': return expr['value'];
    case 'binary': return generate_expr(expr['args'][0]) + " " + expr['op'] + " " + generate_expr(expr['args'][1]);
    default: return 'undefined'
    }
}


const generate_verilog = function(str, info){
    str += indent(0) + "module " + info['name'] + "(" + "\n";
    str += generate_verilog_ioport(info['variables'], info['tables']);
    str += indent(0) + ");" + "\n";

    str += "\n";

    info['tables'].forEach(function(table){
	table['variables'].forEach(function(v){
	    str += indent(2) + generate_vreg(table['name'] + "_" + v['name'], v['type']) + ";\n";
	});
    });
    
    str += "\n";

    info['tables'].forEach(function(table){
	table['slots'].forEach(function(slot){
	    str += indent(2) + "always @(posedge clk) begin\n";
	    str += indent(4) + "if(" + "state_"+table['name'] + " == " + slot['id'] + ") begin\n";
	    str += indent(6) + generate_expr(slot['dest']) + " <= " + generate_expr(slot['src']) + ";\n";
	    str += indent(4) + "end\n";
	    str += indent(2) + "end\n";
	});
    });
    
    str += indent(0) + "endmodule" + "\n";
    return str;
}

const generate_verilog_all = function(info_all){
    let str = "";
    info_all.forEach(function(info){
	str += generate_verilog(str, info);
    });
    return str;
}
