const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const verifyToken = require("../Middleware/authMiddleware");
const {createUserValidator,loginValidator,createContactValidator,createPaymentValidator,deleteValidator,validate} = require("../Validators/userValidator");
const fs = require("fs");
const path = require("path");
const multer = require('multer');
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });


router.post("/create",createUserValidator,validate,userController.userCreate);
router.post("/login",loginValidator,validate,userController.userLogin);
router.post("/logout",verifyToken,userController.logOut);
router.post("/contact",verifyToken,upload.single("image"),createContactValidator,validate,userController.contact);
router.post("/forget-password", userController.forgetPassword);
router.get("/reset-password/:token", (req, res) => {
   res.sendFile(path.join(__dirname, "../../public/reset-password.html"));
});
router.post("/update-password/:token", userController.resetPassword);
router.get("/verify-token", verifyToken, (req, res) => {
  res.json({status: true,message: "Token valid", user: req.user});});
router.post("/payment",verifyToken,createPaymentValidator,validate,userController.payment);
router.post("/index",verifyToken,userController.index);
router.post("/cart",verifyToken,userController.cart);
router.post("/product-list",verifyToken,userController.productlist);
router.post("/delete", verifyToken,deleteValidator,validate,userController.delete);
module.exports = router;