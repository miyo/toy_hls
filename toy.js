"use strict";
exports.__esModule = true;
var file_reader = require("./src/file_reader");
(function () {
    document.getElementById("uploadInput").addEventListener("change", file_reader.updateSize, false);
})();
