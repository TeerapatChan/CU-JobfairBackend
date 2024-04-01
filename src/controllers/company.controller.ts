import { Request, Response } from "express";
import Company from "../models/Company";

export const getCompanies = async (
  req: Request,
  res: Response
): Promise<void> => {
  const reqQuery = { ...req.query };
  const removeFields: string[] = ["select", "sort", "page", "limit"];
  removeFields.forEach((param: string) => delete reqQuery[param]);
  let queryStr: string = JSON.stringify(reqQuery).replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match: string) => `$${match}`
  );
  // Finding resource
  let query = Company.find(JSON.parse(queryStr));

  // Select
  if (req.query.select) {
    query = query.select((req.query.select as string).split(",").join(" "));
  }

  // Sort
  query = req.query.sort
    ? query.sort((req.query.sort as string).split(",").join(" "))
    : query.sort("-createdAt");

  // Pagination
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 25;
  const startIdx = (page - 1) * limit;
  const endIdx = page * limit;
  const total = await Company.countDocuments();
  query = query.skip(startIdx).limit(limit);
  try {
    // Executing query
    const companies = await query;
    // Pagination result
    const pagination: any = {};
    if (endIdx < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIdx > 0) {
      pagination.prev = { page: page - 1, limit };
    }
    res.status(200).json({
      success: true,
      count: companies.length,
      pagination,
      data: companies,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

export const getCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

export const createCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, data: company });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

export const updateCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!company) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

export const deleteCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
