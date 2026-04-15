import { AdminUser } from "../models/AdminUser.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createToken } from "../utils/token.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  const user = await AdminUser.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  res.json({
    token: createToken(user),
    user: {
      id: user._id,
      email: user.email,
      name: user.name
    }
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
