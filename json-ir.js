
const print_error = function(e){
    $("#convert_error").text(e)
    $("#convert_error").addClass("error");
}

const clear_all = function(){
    $("#convert_error").text("")
    $("#convert_error").removeClass("error");
    $("#result").val();
    $("#scheduler_table").val();
}

const convert = function(){
    clear_all();
    const src_str = $("#given").val();
    let src_json = "";
    try {
	src_json = JSON.parse(src_str);
    } catch (e) {
	if (e instanceof SyntaxError) {
            print_error(e);
	} else {
            print_error(e);
	}
    }
    const info_all = generate_scheduler_info_all(src_json)
    print_scheduler_info_all(info_all);
    $("#result").val(generate_verilog_all(info_all));
};

const init = function(){
    const init_str = `{ "version" : "0.1",
  "classes" : [
     {"name" : "BlinkLED",
      "variables" : [{ "name" : "led", "type" : "bool", "init" : "false" }],
      "methods" : [
        {"name" : "main", "type" : "void",
         "args" : [{ "name" : "num", "type" : "int"}, { "name" : "wait_val", "type" : "int"}],
         "block" : {
           "variables" : [{ "name" : "i", "type" : "int", "init" : "0" },
                          { "name" : "j", "type" : "int", "init" : "0" }],
           "statements" : [
             { "kind" : "while",
               "expr" : { "kind" : "binary", "op" : "<",
                          "args" : [{"kind" : "variable", "name" : "i"}, {"kind" : "variable", "name" : "num"}] },
               "block" : {
                 "statements" : [
                   { "kind" : "while", 
                      "expr" : { "kind" : "binary", "op" : "<",
                                 "args" : [{"kind" : "variable", "name" : "j"}, {"kind" : "variable", "name" : "wait_val"}] },
                      "block" : {
                        "variables" : [],
                        "statements" : [
                          { "kind" : "assign",
                            "dest" : { "kind" : "variable", "name" : "j" },
                            "expr" : { "kind" : "binary", "op" : "+",
                                       "args" : [{"kind" : "variable", "name" : "j"},
                                                 {"kind" : "constant", "type" : "int", "value" : "1"}] }}]}},
                   { "kind" : "assign",
                     "dest" : { "kind" : "variable", "name" : "led" },
                     "expr" : { "kind" : "unary", "op" : "not", "args" : [{"kind" : "variable", "name" : "led"}]}}
                  ]
               }
             },
             { "kind" : "assign",
               "dest" : { "kind" : "variable", "name" : "i" },
               "expr" : { "kind" : "binary", "op" : "+",
                          "args" : [{"kind" : "variable", "name" : "i"}, {"kind" : "constant", "type" : "int", "value" : "1"}]}}
            ]
          }
        }
      ]
    }
  ]
}`;
    $("#given").val(init_str);
    $("#result").val();
    $("#scheduler_table").val();
}

$(function(){

    init();
    convert($("#input").val());
    
    //$("#given").linedtextarea();
    //$("#result").linedtextarea();
    //$("#scheduler_table").linedtextarea();
    $("#convert").click(function(){
	convert($("#input").val());
    });
});

