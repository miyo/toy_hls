import file_reader = require('./src/file_reader')

(function(){
    document.getElementById("uploadInput").addEventListener("change", file_reader.updateSize, false);
})();
