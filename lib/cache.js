var assert = require('better-assert');
var Code = require('./code-class.js');
var workers = {
    input:
        require('./workers/input.js'),
    location:
        require('./workers/location.js'),
};


module.exports = cache;

var cache_map = {}
function cache(code){
    var temp_code = new Code(code._input, true);

    workers.input.validate_input(temp_code);
    workers.input.assign_input(temp_code);

    workers.location.set_internet_location(temp_code);
    workers.location.set_disk_location(temp_code);
    workers.location.validate_location(temp_code);

    workers.input.set_id(temp_code);

    if( ! temp_code.id ) {
        workers.input.set_source_code(temp_code);
        workers.input.set_id(temp_code);
    }

    assert( temp_code.id );

    if( ! temp_code.id ) return code;
    cache_map[temp_code.id] = cache_map[temp_code.id] || code;

    // hacky for now. Only one includer is supported but there can be several includers
    cache_map[temp_code.id]._input.includer = code._input.includer;
    cache_map[temp_code.id].includer = code.includer;

    return cache_map[temp_code.id];
}

cache.get_all_entries = function(){
    var ret = [];
    for(var id in cache_map){
        ret.push(cache_map[id]);
    }
    return ret;
};