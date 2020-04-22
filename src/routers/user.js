const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");
const router = express.Router();

//! Хэрэглэгч Бүртгүүлэх (Sign up)
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken(); //* Token үүсгэх
    //* 201 хэрэглэгч бүртэлтэй
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

//! Хэрэглэгч хайх (Log in)
router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password); //* find user
    const token = await user.generateAuthToken(); //* Token үүсгэх
    await user.save();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send("Нэвтрэх боломжгүй");
  }
});

//! Хэрэглэгч (Log out - single session)
router.post("/users/logout", auth, async (req, res) => {
  try {
    const { user } = req;
    user.tokens = user.tokens.filter((token) => token.token !== req.token);
    await user.save();
    res.send("Амжилттай гарлаа");
  } catch (error) {
    res.status(500).send();
  }
});

//! Хэрэглэгч (Log out - All sessions)
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    const { user } = req;
    user.tokens = [];
    await user.save();
    res.status(200).send("Амжилттай бүх хэрэгсэлээс гарлаа");
  } catch (error) {
    res.status(500).send();
  }
});

//! Хэрэглэгчийн намтар
router.get("/users/me", auth, async (req, res) => {
  const { user } = req;
  res.send(user);
});

//! Хэрэглэгч татах
router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      //* user not exists
      return res.status(404).send("Хэрэглэгч байхгүй байна");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//! Хэрэглэгч шинэчлэх
router.patch("/users/me", auth, async (req, res) => {
  //* if user updates a property that doesn't exist
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send("АЛДАА: буруу ажиллагаа байна");
  }
  //*

  try {
    const { user } = req;
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    //*
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

//! Хэрэглэгч устгах
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (error) {
    req.status(404).send();
  }
});

//! Зураг оруулах
const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Зураг байршуулна уу"));
    }
    cb(undefined, true);
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("Хөрөг"),
  async (req, res) => {

    if (!req.file) {
      return res.status(404).send("Зургийг өгнө үү");
    }
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send("Таны зураг амжилттай байршуулагдлаа");
  },
  (error, req, res, next) => {
    //* Error гаргах
    res.status(400).send({ error: error.message });
  }
);

//! Зураг устгах
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send("Зураг амжилттай устгагдсан");
});

//! get user image
router.get("/users/:id/avatar", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png"); 
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send("Хэрэглэгч эсвэл зураг олдсонгүй");
  }
});

module.exports = router;
