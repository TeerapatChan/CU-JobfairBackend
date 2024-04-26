import { Request, Response } from "express";
import Booking from "../models/Booking";
import Company from "../models/Company";

export const getBookings = async (req: Request, res: Response) => {
  const isAdmin = req.user?.role === "admin";
  const query = Booking.find(isAdmin ? {} : { user: req.user?.id }).populate({
    path: "company",
    select: "name address tel website description",
  });

  try {
    const bookings = await query;
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Booking" });
  }
};

export const getBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "company",
      select: "name address tel website description",
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    if (
      booking.user.toString() !== req.user?.id &&
      req.user?.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user?.id} is not authorized to view this booking`,
      });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Booking" });
  }
};

export const addBooking = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const companyId = req.body.company;
    console.log(req.body);
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: `No company with the id of ${companyId}`,
      });
    }
    req.body.user = req.user?.id;

    const existedBookings = await Booking.find({ user: req.user?.id });
    console.log(existedBookings.length);
    if (existedBookings.length >= 3) {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user?.id} has already made 3 bookings`,
      });
    }
    const bookingDate = new Date(req.body.bookingDate);
    const first = new Date("2022-05-10");
    const last = new Date("2022-05-13");

    if (bookingDate < first || bookingDate > last) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking date",
      });
    }

    const booking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot create Booking",
    });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    if (
      booking.user.toString() !== req.user?.id &&
      req.user?.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user?.id} is not authorized to update this booking`,
      });
    }

    const bookingDate = new Date(req.body.bookingDate);
    const first = new Date("2022-05-10");
    const last = new Date("2022-05-13");

    if (bookingDate < first || bookingDate > last) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking date",
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot update Booking",
    });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    if (
      booking.user.toString() !== req.user?.id &&
      req.user?.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user?.id} is not authorized to delete this booking`,
      });
    }

    await booking.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot delete Booking",
    });
  }
};
