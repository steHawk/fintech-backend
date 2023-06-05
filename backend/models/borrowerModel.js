import mongoose from "mongoose";
const Schema = mongoose.Schema;

const borrowerSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    itemImage: [{ type: Schema.Types.Mixed }],
    itemName: {
      type: String,
      unique: false,
    },
    description: {
      type: String,
    },
    expectedLoanAmount: {
      type: Number,
    },
    category: {
      type: String,
    },
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [],
    },
    city: {
      type: String,
    },
    officePhone: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { versionKey: "v1" }
);

borrowerSchema.index({
  address: "2dsphere",
});

const Borrower = mongoose.model("Borrower", borrowerSchema);

export default Borrower;
