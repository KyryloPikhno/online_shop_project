const {model, Schema} = require("mongoose");

const brandSchema = new Schema({
        name: {type: String, trim: true, require: true, maxlength: 32, unique:true}
    },
    { timestamps: true }
);

module.exports = model("Brand", brandSchema);