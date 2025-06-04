const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const success = new Schema(
  {
    date: {
      type: Date,
      required: [true, "Success must have date!"],
    },
    header: {
      type: String,
      required: [true, "Success must have a header!"],
    },
    detail: {
      type: String,
      required: [true, "Success must have detail!"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Success must belong to a User!"],
    },
  },
  { timestamps: true },
);

export default mongoose.models.Success || mongoose.model("Success", success);
