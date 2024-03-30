import { Document, Schema, Types, model } from "mongoose";
import { ICompany } from "./Company";
import { IUser } from "./User";

export interface IBooking extends Document {
  bookingDate: Date;
  user: IUser;
  company: ICompany;
  createdAt: Date;
}

const BookingSchema: Schema<IBooking> = new Schema<IBooking>({
  bookingDate: {
    type: Date,
    required: true,
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  company: {
    type: Types.ObjectId,
    ref: "Company",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<IBooking>("Booking", BookingSchema);
