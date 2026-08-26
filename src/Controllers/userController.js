const userService = require("../Services/userService");


exports.userCreate = async (req, res, next) => {
    try {
        await userService.userCreate(req.body);
        return res.status(201).json({ status: true, message: "User registered successfully" });
    } catch (error) { next(error); }
};

exports.userLogin = async (req, res, next) => {
    try {
        const data = await userService.userLogin(req.body);
        return res.status(200).json({ status: true, message: "Login successful", token: data.token, user: data.user });
    } catch (error) { next(error); }
};

exports.logOut = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        await userService.logOut(token);
        return res.status(200).json({ status: true, message: "Logout successful" });
    } catch (error) { next(error); }
};

exports.contact = async (req, res, next) => {
    try {
        const body = req.body;
        if (req.file) body.image_path = req.file.path;
        const data = await userService.contact(body);
        return res.status(201).json({ status: true, message: "Contact submitted successfully", data });
    } catch (error) { next(error); }
};

exports.forgetPassword = async (req, res, next) => {
    try {
        await userService.forgetPassword(req.body);
        return res.status(201).json({ status: true, message: "Verification email sent successfully" });
    } catch (error) { next(error); }
};

exports.resetPassword = async (req, res, next) => {
    try {
        await userService.resetPassword(req.params.token, req.body);
        return res.status(200).json({ status: true, message: "Password reset successful" });
    } catch (error) { next(error); }
};

exports.payment = async (req, res, next) => {
    try {
        await userService.payment(req.body);
        return res.status(200).json({ status: true, message: "Payment successful" });
    } catch (error) { next(error); }
};

exports.index = async (req, res, next) => {
    try {
        const data = await userService.index(req.body);
        return res.status(200).json({ status: true, message: "Data fetched successfully", data });
    } catch (error) { next(error); }
};

exports.cart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await userService.cart({ userId, ...req.body });
        return res.status(200).json({ status: true, message: "Product added to cart", data });
    } catch (error) { next(error); }
};

exports.productlist = async (req, res, next) => {
    try {
        const data = await userService.productlist(req.body);
        return res.status(200).json({ status: true, message: "Products fetched successfully", data });
    } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
    try {
        const { id } = req.body;
        const data = await userService.delete(id);
        return res.status(200).json({ status: true, message: "Product deleted from cart", data });
    } catch (error) { next(error); }
};

exports.createUPIPayment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await userService.createUPIPayment(userId);
        return res.status(200).json({ status: true, message: "UPI link generated successfully", data });
    } catch (error) { next(error); }
};

exports.addToWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await userService.addToWishlist(userId, req.body);
        return res.status(201).json({ status: true, message: "Added to wishlist", data });
    } catch (error) { next(error); }
};

exports.getWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await userService.getWishlist(userId);
        return res.status(200).json({ status: true, message: "Wishlist fetched", data });
    } catch (error) { next(error); }
};

exports.removeFromWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await userService.removeFromWishlist(id, userId);
        return res.status(200).json({ status: true, message: "Removed from wishlist" });
    } catch (error) { next(error); }
};

exports.placeOrder = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { paymentMethod } = req.body;
        const data = await userService.placeOrder(userId, paymentMethod);
        return res.status(201).json({ status: true, message: "Order placed successfully", data });
    } catch (error) { next(error); }
};

exports.getOrderHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await userService.getOrderHistory(userId);
        return res.status(200).json({ status: true, message: "Order history fetched", data });
    } catch (error) { next(error); }
};

exports.getOrderDetail = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const data = await userService.getOrderDetail(id, userId);
        return res.status(200).json({ status: true, message: "Order detail fetched", data });
    } catch (error) { next(error); }
};

exports.getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await userService.getProfile(userId);
        return res.status(200).json({ status: true, message: "Profile fetched", data });
    } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await userService.updateProfile(userId, req.body);
        return res.status(200).json({ status: true, message: "Profile updated successfully", data });
    } catch (error) { next(error); }
};
