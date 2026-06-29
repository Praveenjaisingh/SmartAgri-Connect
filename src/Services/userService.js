const userRepository = require("../Repositories/userRepository");
const AppError = require("../Helpers/AppError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const forgetMail = require("../Helpers/forgetMail");
const sendMail = require("../Helpers/sendMail");
const sendContactMail = require("../Helpers/sendContactMail");

class userService {

    async userCreate(data) {
        const { name, email, password, confirmPassword } = data;
        const existingUser = await userRepository.userLogin(email);
        if (existingUser) throw new AppError(["Email already exists"]);

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userRepository.userCreate({
            name, email,
            password: hashedPassword,
            confirmPassword: hashedPassword
        });

        const loginUrl = `${process.env.APP_URL}`;
        await sendMail({ to: email, subject: "Welcome! Your Account Details", replacements: { name, email, password, loginUrl } });
        return user;
    }

    async userLogin(data) {
        const { email, password } = data;
        const user = await userRepository.userLogin(email);
        if (!user) throw new AppError("User not found");

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new AppError("Invalid password");

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        return { user, token };
    }

    async logOut(token) {
        if (!token) throw new AppError("Token missing");
        return { message: "Logout successful" };
    }

    async contact(data) {
        if (!data) throw new AppError("Contact data is required");
        const { name, email, product, cost, quantity, message, image_path } = data;
        const saved = await userRepository.contact({ name, email, product, cost, quantity, message, image_path });
        await sendContactMail({
            to: process.env.ADMIN_EMAIL,
            subject: "🌾 New Contact Form Submission",
            replacements: { name, email, product: product || "-", cost: cost || "-", quantity: quantity || "-", message }
        });
        return saved;
    }

    async forgetPassword(data) {
        const { email } = data;
        const user = await userRepository.userLogin(email);
        if (!user) throw new AppError("User not found");

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetToken = hashedToken;
        user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        const resetURL = `${process.env.APP_URL}/api/users/reset-password/${resetToken}`;
        await forgetMail({ to: user.email, subject: "Reset Your Password - Smart Agri-Connect", replacements: { name: user.name, RESET_LINK: resetURL } });
        return true;
    }

    async resetPassword(token, data) {
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await userRepository.findUserByResetToken(hashedToken);
        if (!user) throw new AppError("Invalid or expired token");
        if (user.resetTokenExpiry < Date.now()) throw new AppError("Token expired");

        const hashedPassword = await bcrypt.hash(data.password, 10);
        await userRepository.updatePassword(user, hashedPassword);
        return true;
    }

    async payment(data) {
        if (!data) throw new AppError("Payment details is required");
        const { name, email, amount, cardNumber, expirationDate, cvv } = data;
        return await userRepository.payment({ name, email, amount, cardNumber, expirationDate, cvv });
    }

    async index(data) {
        const userList = await userRepository.index(data);
        if (!userList) throw new AppError("No Data found");
        return userList;
    }

    async cart(data) {
        const { product, cost, Quantity, total, userId } = data;
        const userList = await userRepository.cart({ userId, product, cost, Quantity, total });
        if (!userList) throw new AppError("No products to add");
        return userList;
    }

    async productlist(data) {
        const userList = await userRepository.productlist(data);
        if (!userList) throw new AppError("No Data found");
        return userList;
    }

    async delete(id) {
        const deleted = await userRepository.delete(id);
        if (!deleted) throw new AppError("No Data found");
        return deleted;
    }

    async createUPIPayment(userId) {
        const user = await userRepository.findUserById(userId);
        if (!user) throw new AppError("User not found");

        const cartItems = await userRepository.getUserCart(userId);
        if (!cartItems.length) throw new AppError("Cart is empty");

        const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.total), 0);
        const upiId = process.env.UPI_ID || "dpp469926@okaxis";
        const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(user.name)}&am=${totalAmount}&cu=INR`;

        return { customerName: user.name, amount: totalAmount, upiUrl };
    }

    // ─── Wishlist ────────────────────────────────────────────────────────────

    async addToWishlist(userId, productData) {
        const { product, cost, image_path } = productData;
        if (!product) throw new AppError("Product name is required");
        return await userRepository.addToWishlist({ userId, product, cost, image_path });
    }

    async getWishlist(userId) {
        return await userRepository.getWishlist(userId);
    }

    async removeFromWishlist(id, userId) {
        const deleted = await userRepository.removeFromWishlist(id, userId);
        if (!deleted) throw new AppError("Wishlist item not found");
        return deleted;
    }

    // ─── Orders ──────────────────────────────────────────────────────────────

    async placeOrder(userId, paymentMethod) {
        const user = await userRepository.findUserById(userId);
        if (!user) throw new AppError("User not found");

        const cartItems = await userRepository.getUserCart(userId);
        if (!cartItems.length) throw new AppError("Cart is empty");

        const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.total), 0);
        const transactionId = `TXN-${Date.now()}-${userId}`;

        const order = await userRepository.createOrder({
            userId,
            items: JSON.stringify(cartItems.map(i => ({ product: i.product, cost: i.cost, Quantity: i.Quantity, total: i.total }))),
            totalAmount,
            paymentMethod: paymentMethod || 'card',
            status: 'paid',
            transactionId
        });

        // Clear the cart after placing order
        await userRepository.clearCart(userId);

        return { order, transactionId, totalAmount };
    }

    async getOrderHistory(userId) {
        const orders = await userRepository.getOrdersByUser(userId);
        return orders.map(o => ({
            id: o.id,
            transactionId: o.transactionId,
            status: o.status,
            totalAmount: o.totalAmount,
            paymentMethod: o.paymentMethod,
            items: JSON.parse(o.items || '[]'),
            createdAt: o.createdAt
        }));
    }

    async getOrderDetail(id, userId) {
        const order = await userRepository.getOrderById(id, userId);
        if (!order) throw new AppError("Order not found");
        return {
            ...order.dataValues,
            items: JSON.parse(order.items || '[]')
        };
    }

    // ─── Profile ─────────────────────────────────────────────────────────────

    async getProfile(userId) {
        const user = await userRepository.findUserById(userId);
        if (!user) throw new AppError("User not found");
        return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
    }

    async updateProfile(userId, data) {
        const user = await userRepository.findUserById(userId);
        if (!user) throw new AppError("User not found");

        if (data.name) user.name = data.name;

        if (data.currentPassword && data.newPassword) {
            const match = await bcrypt.compare(data.currentPassword, user.password);
            if (!match) throw new AppError("Current password is incorrect");
            user.password = await bcrypt.hash(data.newPassword, 10);
            user.confirmPassword = user.password;
        }

        await user.save();
        return { id: user.id, name: user.name, email: user.email };
    }
}

module.exports = new userService();
