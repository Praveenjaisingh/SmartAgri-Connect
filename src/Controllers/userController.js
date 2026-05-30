const userService = require("../Services/userService")


exports.userCreate = async (req, res, next) => {

    try {
        const data = await userService.userCreate(req.body);
        return res.status(201).json({
            status: true,
            message: "user sign in success"

        });

    } catch (error) {
        next(error);
    }

};

exports.userLogin = async (req, res, next) => {

    try {
        const data = await userService.userLogin(req.body);
        return res.status(200).json({
            status: true,
            message: "Login successful",
            token: data.token,
            user: data.user
        });

    } catch (error) {
        next(error);
    }

};

exports.logOut = async (req, res, next) => {

    try {
        const token = req.headers.authorization?.split(" ")[1];
        const data = await userService.logOut(token);
        return res.status(200).json({
            status: true,
            message: "Logout successful"
        });

    } catch (error) {
        next(error);
    }

};

exports.contact = async (req, res, next) => {
    try {
        const body = req.body;
        if (req.file) {
            body.image_path = req.file.path;
        }
        const data = await userService.contact(body);
        return res.status(201).json({
            status: true,
            message: "contact data stored successfully",
            data: data

        });
    } catch (error) {
        next(error);
    }
};

exports.forgetPassword = async (req, res, next) => {
    try {
        const data = await userService.forgetPassword(req.body);
        return res.status(201).json({
            status: true,
            message: "verfication mail sended successfully"
        });
    } catch (error) {
        next(error);
    }

}

exports.resetPassword = async (req, res, next) => {
    try {
        const data = await userService.resetPassword(
            req.params.token,
            req.body
        );

        return res.status(200).json({
            status: true,
            message: "Password reset successful"
        });

    } catch (error) {
        next(error);
    }
};

exports.payment = async (req, res, next) => {
    try {
        const data = await userService.payment(req.body);
        return res.status(200).json({
            status: true,
            message: "Payment successful"
        });

    } catch (error) {
        next(error);
    }
};

exports.index = async (req, res, next) => {
    try {
        const data = await userService.index(req.body);
        return res.status(200).json({
            status: true,
            message: "Data fetched successfully",
            data: data
        });

    } catch (error) {
        next(error);
    }
};

exports.cart = async (req, res, next) => {
    try {
        const data = await userService.cart(req.body);
        return res.status(200).json({
            status: true,
            message: "products added to the cart successfully",
            data: data
        });

    } catch (error) {
        next(error);
    }
};

exports.productlist = async (req, res, next) => {
    try {
        const data = await userService.productlist(req.body);
        return res.status(200).json({
            status: true,
            message: "products Fetched successfully",
            data: data
        });

    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const { id } = req.body;
        const data = await userService.delete(id);
        return res.status(200).json({
            status: true,
            message: "product deleted successfully",
            data: data
        });

    } catch (error) {
        next(error);
    }
};

exports.createUPIPayment = async (req, res, next) => {
    try {
        const data = await userService.createUPIPayment(req.body);

        return res.status(200).json({
            status: true,
            message: "UPI link generated successfully",
            data
        });

    } catch (error) {
        next(error);
    }
};