const { User, Contact, Payment, Home, Cart, Wishlist, Order } = require("../Models");
const { Op, Sequelize } = require('sequelize');

class userRepository {

    async userCreate(data) {
        return await User.create(data);
    }

    async userLogin(email) {
        return await User.findOne({ where: { email } });
    }

    async findUserById(id) {
        return await User.findByPk(id);
    }

    async contact(data) {
        return await Contact.create(data);
    }

    async findUserByResetToken(hashedToken) {
        return await User.findOne({ where: { resetToken: hashedToken } });
    }

    async updatePassword(user, hashedPassword) {
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        return await user.save();
    }

    async payment(data) {
        return await Payment.create(data);
    }

    async index(data) {
        const search = (data.search || '').toLowerCase();
        return await Home.findAll({
            where: search ? {
                [Op.or]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('product')), { [Op.like]: `%${search}%` }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('cost')),    { [Op.like]: `%${search}%` }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Quantity')),{ [Op.like]: `%${search}%` }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('price')),   { [Op.like]: `%${search}%` }),
                ]
            } : {},
            order: [['id', 'DESC']]
        });
    }

    async cart(data) {
        return await Cart.create(data);
    }

    async productlist(data) {
        const search = (data.search || '').toLowerCase();
        return await Cart.findAll({
            where: search ? {
                [Op.or]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('product')), { [Op.like]: `%${search}%` }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('cost')),    { [Op.like]: `%${search}%` }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Quantity')),{ [Op.like]: `%${search}%` }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('total')),   { [Op.like]: `%${search}%` }),
                ]
            } : {},
            order: [['id', 'DESC']]
        });
    }

    async delete(id) {
        return await Cart.destroy({ where: { id } });
    }

    async getUserCart(userId) {
        return await Cart.findAll({ where: { userId } });
    }

    async clearCart(userId) {
        return await Cart.destroy({ where: { userId } });
    }

    // ─── Wishlist ────────────────────────────────────────────────────────────

    async addToWishlist(data) {
        // Prevent duplicates
        const existing = await Wishlist.findOne({ where: { userId: data.userId, product: data.product } });
        if (existing) return existing;
        return await Wishlist.create(data);
    }

    async getWishlist(userId) {
        return await Wishlist.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
    }

    async removeFromWishlist(id, userId) {
        return await Wishlist.destroy({ where: { id, userId } });
    }

    async isInWishlist(userId, product) {
        return await Wishlist.findOne({ where: { userId, product } });
    }

    // ─── Orders ──────────────────────────────────────────────────────────────

    async createOrder(data) {
        return await Order.create(data);
    }

    async getOrdersByUser(userId) {
        return await Order.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });
    }

    async getOrderById(id, userId) {
        return await Order.findOne({ where: { id, userId } });
    }

    async updateOrderStatus(id, status) {
        return await Order.update({ status }, { where: { id } });
    }
}

module.exports = new userRepository();
