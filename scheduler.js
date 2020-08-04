const print_scheduler_info_all = function(table){
    $("#scheduler_table").val(JSON.stringify(table));
};

const get_new_slot = function(table){
    const slot = {'id': table['slot_id'], 'items': []};
    table['slot_id'] += 1;
    return slot;
};

const get_type = function(args){
    type = 'int';
    return type;
};

const get_new_variable = function(table, type){
    let new_var = {'kind' : 'variable'}
    new_var['name'] = 'expr_sig_' + table['uniq_id'];
    new_var['type'] = type;
    table['variables'].push(new_var)
    table['uniq_id'] += 1;
    return new_var;
};

const generate_scheduler_expr_slot = function(table, block, expr){
    switch(expr['kind']){
    case 'variable':
	expr['value'] = expr['name'];
    case 'constant':
	expr['value'] = expr['value'];
    default:
	expr['args'] = expr['args'].map(function(a){
	    let slot = generate_scheduler_expr_slot(table, block, a);
	    return slot['value'];
	});
	let slot = get_new_slot(table);
	slot['src'] = expr;
	slot['dest'] = get_new_variable(table, get_type(expr['args']))
    }
    return slot;
};

const generate_scheduler_slots = function(table, block){
    table['variables'] = block['variables'];

    block['statements'].forEach(function(stmt){
	if(stmt['kind'] == 'while'){
	    
	}else if(stmt['kind'] == 'assign'){
	    slot = generate_scheduler_expr_slot(table, block, stmt['expr'])
	    table['slots'].push(slot)
	    slot = generate_scheduler_assign_slot(table, block, stmt['expr'])
	}
    });
};

const generate_scheduler_table = function(method){
    const table = {};
    table['name'] = method['name'];
    table['return_type'] = method['type'];
    table['args'] = method['args'];
    table['slots'] = [];
    table['slot_id'] = 2;
    table['uniq_id'] = 0;
    generate_scheduler_slots(table, method['block'])
    return table;
};

const generate_scheduler_info = function(src){
    const info = {};
    info['name'] = src['name'];
    info['variables'] = src['variables'];
    info['tables'] = [];
    src['methods'].forEach(function(m){
	info['tables'].push(generate_scheduler_table(m));
    });
    return info;
};

const generate_scheduler_info_all = function(src){
    const ret = [];
    src['classes'].forEach(function(c){
	ret.push(generate_scheduler_info(c));
    });
    return ret;
};
