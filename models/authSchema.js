const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;
const { PERMISSION_IDS } = require("../config.js/accessConfig");

const authSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["superadmin", "admin", "editor"],
    default: "admin"
  },

  /** When non-empty, user may only use these admin modules (see accessConfig). */
  permissions: {
    type: [String],
    default: [],
    validate: {
      validator(arr) {
        return arr.every((p) => PERMISSION_IDS.includes(p));
      },
      message: "Invalid permission id",
    },
  },

}, { timestamps: true });


authSchema.plugin(passportLocalMongoose, {
  usernameField: "username"  
});

module.exports = mongoose.model("User", authSchema);
