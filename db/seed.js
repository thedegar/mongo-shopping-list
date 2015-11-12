var Item = require('../models/item');

exports.run = function(callback) {
    Item.create([{name: 'Broad beans'},
                {name: 'Tomatoes'},
                {name: 'Peppers'}], callback);
};

if (require.main === module) {
    require('./connect');
    exports.run(function() {
        var mongoose = require('mongoose');
        mongoose.disconnect();
    }, function(err) {
        console.error(err);
    });
}
