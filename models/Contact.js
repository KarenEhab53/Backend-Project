const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phones: {
      type: [String],
      default: [],
    },
    socialMedia: {
      type: Map,
      of: String,
      //to make only 2 choices for user to add one or both of them and put his own email
      validate: {
        validator: function (value) {
          const allowedKeys = ["facebook", "linkedin"];
          const keys =
            value instanceof Map ? [...value.keys()] : Object.keys(value);
          return keys.every((key) => allowedKeys.includes(key));
        },
        message: 'Only "facebook" and "linkedin" are allowed in socialMedia',
      },
      default: {},
    },
  },
  { timestamps: true },
);

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
