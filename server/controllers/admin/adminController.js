import fs from "node:fs"
import uploadToCloudinary from "../../middleware/cloudinaryMiddleware.js"
import Product from "../../models/productModel.js"
import User from "../../models/userModel.js"
import Pathologist from "../../models/pathologistModel.js"
import Doctor from "../../models/doctorModel.js"

const getAllUsers = async (req, res) => {
    const users = await User.find()

    if (!users) {
        res.status(404)
        throw new Error("Users Not Found!")
    }

    res.status(200).json(users)

}


const getAllProducts = async (req, res) => {
    const products = await Product.find()

    if (!products) {
        res.status(404)
        throw new Error("Products Not Found!")
    }

    res.status(200).json(products)

}


const addProduct = async (req, res) => {

    const { name, description, price, stock, expiresOn, genericName, company, category, requiresPrescription } = req.body

    if (!name || !description || !price || !stock || !expiresOn || !genericName || !company || !category) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }

    // Upload Image To Cloudinary
    let imageURL = await uploadToCloudinary(req.file.path)
    fs.unlinkSync(req.file.path)

    console.log(imageURL)

    const product = await Product.create({
        name,
        description,
        price,
        stock,
        expiresOn,
        genericName,
        company,
        category,
        requiresPrescription: requiresPrescription === true || requiresPrescription === "true",
        image: imageURL.secure_url
    })


    if (!product) {
        res.status(409)
        throw new Error("Product Not Created!")
    }



    res.status(201).json(product)


}


const updateProduct = async (req, res) => {

    const productId = req.params.pid

    const product = await Product.findById(productId)

    if (!product) {
        res.status(404)
        throw new Error("Product Not Found!")
    }


    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true })

    if (!updatedProduct) {
        res.status(409)
        throw new Error("Product Not Updated")
    }


    res.status(200).json(updatedProduct)

}


const deleteProduct = async (req, res) => {

    const productId = req.params.pid

    const product = await Product.findById(productId)

    if (!product) {
        res.status(404)
        throw new Error("Product Not Found!")
    }

    product.isActive = false
    await product.save()

    res.status(200).json({ message: "Product Deactivated!", product })

}


const getAllDoctors = async (req, res) => {

    const doctors = await Doctor.find().populate('user')

    if (!doctors) {
        res.status(404)
        throw new Error("Doctors Not Found!")
    }

    res.status(200).json(doctors)

}


const getAllOrders = async (req, res) => {

    const Order = (await import("../../models/orderModel.js")).default
    const orders = await Order.find().populate("user", "name email phone").sort({ createdAt: -1 })

    res.status(200).json(orders)

}


const updateOrderStatus = async (req, res) => {

    const { status } = req.body
    const oid = req.params.oid

    const allowed = ["placed", "processing", "shipped", "delivered", "cancelled"]

    if (!status || !allowed.includes(status)) {
        res.status(409)
        throw new Error("Invalid Status! Use one of: " + allowed.join(", "))
    }

    const Order = (await import("../../models/orderModel.js")).default
    const order = await Order.findByIdAndUpdate(oid, { status }, { new: true })

    if (!order) {
        res.status(404)
        throw new Error("Order Not Found!")
    }

    res.status(200).json(order)

}


const getAllPathologists = async (req, res) => {

    const pathologists = await Pathologist.find().populate('user')

    if (!pathologists) {
        res.status(404)
        throw new Error("Pathologists Not Found!")
    }

    res.status(200).json(pathologists)



}

const updatePathologist = async (req, res) => {

    const { isVerified } = req.body

    const pid = req.params.pid

    const pathologist = await Pathologist.findByIdAndUpdate(pid, { isVerified }, { new: true }).populate('user')

    if (isVerified) {
        await User.findByIdAndUpdate(pathologist.user, { userType: "PATHOLOGIST" }, { new: true })
    }


    if (!pathologist) {
        res.status(409)
        throw new Error("Pathologists Not Updated!")
    }

    res.status(200).json(pathologist)

}



const updateDoctor = async (req, res) => {

    const { isVerified } = req.body

    const did = req.params.did

    const doctor = await Doctor.findByIdAndUpdate(did, { isVerified }, { new: true }).populate('user')

    if (isVerified) {
        await User.findByIdAndUpdate(doctor.user, { userType: "DOCTOR" }, { new: true })
    }


    if (!doctor) {
        res.status(409)
        throw new Error("DOCTOR Not Updated!")
    }

    res.status(200).json(doctor)

}



const adminService = {
    getAllUsers,
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getAllPathologists,
    getAllDoctors,
    updatePathologist,
    updateDoctor,
    getAllOrders,
    updateOrderStatus
}

export default adminService