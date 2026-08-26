const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const userController = require("../Controllers/userController");
const verifyToken = require("../Middleware/authMiddleware");
const rateLimiter = require("../Middleware/rateLimiter");
const {createUserValidator, loginValidator,createContactValidator, createPaymentValidator,deleteValidator, validate
} = require("../Validators/userValidator");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); 
const authLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many auth attempts, please try again later.' });

router.post("/create",          authLimiter, createUserValidator, validate, userController.userCreate);
router.post("/login",           authLimiter, loginValidator, validate, userController.userLogin);
router.post("/logout",          verifyToken, userController.logOut);
router.post("/forget-password", authLimiter, userController.forgetPassword);
router.get("/reset-password/:token", (req, res) => res.sendFile(path.join(__dirname, "../../public/reset-password.html")));
router.post("/update-password/:token", userController.resetPassword);
router.get("/verify-token", verifyToken, (req, res) => res.json({ status: true, message: "Token valid", user: req.user }));

router.post("/index",        verifyToken, userController.index);
router.post("/cart",         verifyToken, userController.cart);
router.post("/product-list", verifyToken, userController.productlist);
router.post("/delete",       verifyToken, deleteValidator, validate, userController.delete);

router.post("/payment",      verifyToken, createPaymentValidator, validate, userController.payment);
router.post("/upi-payment",  verifyToken, userController.createUPIPayment);

router.post("/contact", verifyToken, upload.single("image"), createContactValidator, validate, userController.contact);

router.post("/wishlist",          verifyToken, userController.addToWishlist);
router.get("/wishlist",           verifyToken, userController.getWishlist);
router.delete("/wishlist/:id",    verifyToken, userController.removeFromWishlist);

router.post("/orders",            verifyToken, userController.placeOrder);
router.get("/orders",             verifyToken, userController.getOrderHistory);
router.get("/orders/:id",         verifyToken, userController.getOrderDetail);

router.get("/profile",            verifyToken, userController.getProfile);
router.put("/profile",            verifyToken, userController.updateProfile);

module.exports = router;
