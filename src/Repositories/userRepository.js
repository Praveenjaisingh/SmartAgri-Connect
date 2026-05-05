const { User, Contact, Payment, Home, Cart } = require("../Models");
const { Op,Sequelize } = require('sequelize');


class userRepository {

    async userCreate(data) {

        const user = await User.create(data);
        return user;
    }
    async userLogin(email) {
        return await User.findOne({ where: { email } })
    }
    async logOut(token) {

        if (!token) {
            throw new Error("Token required");
        }
        return {
            message: "Logout successful"
        };
    }
    async contact(data) {

        return await Contact.create(data);

    }
    async findUserByResetToken(hashedToken) {
        return await User.findOne({
            where: {
                resetToken: hashedToken
            }
        });
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
            where: search
                ? {
                    [Op.or]: [
                        Sequelize.where(
                            Sequelize.fn('LOWER', Sequelize.col('product')),
                            {
                                [Op.like]: `%${search}%`
                            }
                        ),
                        Sequelize.where(
                            Sequelize.fn('LOWER', Sequelize.col('cost')),
                            {
                                [Op.like]: `%${search}%`
                            }
                        ),
                        Sequelize.where(
                            Sequelize.fn('LOWER', Sequelize.col('Quantity')),
                            {
                                [Op.like]: `%${search}%`
                            }
                        ),
                        Sequelize.where(
                            Sequelize.fn('LOWER', Sequelize.col('price')),
                            {
                                [Op.like]: `%${search}%`
                            }
                        )
                    ]
                }
                : {},
            order: [['id', 'DESC']]
        });
    }

    async cart(data) {
        return await Cart.create(data);
    }

    async productlist(data) {
        const search = (data.search || '').toLowerCase();

        return await Cart.findAll({
            where: search
                ? {
                    [Op.or]: [
                        Sequelize.where(
                            Sequelize.fn('LOWER', Sequelize.col('product')),
                            {
                                [Op.like]: `%${search}%`
                            }
                        ),
                        Sequelize.where(
                            Sequelize.fn('LOWER', Sequelize.col('cost')),
                            {
                                [Op.like]: `%${search}%`
                            }
                        ),
                        Sequelize.where(
                            Sequelize.fn('LOWER', Sequelize.col('Quantity')),
                            {
                                [Op.like]: `%${search}%`
                            }
                        ),
                        Sequelize.where(
                            Sequelize.fn('LOWER', Sequelize.col('total')),
                            {
                                [Op.like]: `%${search}%`
                            }
                        ),
                    ]
                }
                : {},
            order: [['id', 'DESC']]
        });
    }

    async delete(id) {
        return await Cart.destroy({
            where: { id: id }
        });
    }

}
module.exports = new userRepository();