import Cart from "../../models/cartModel.js"
import Order from "../../models/orderModel.js"
import Product from "../../models/productModel.js"

const placeOrder = async (req, res) => {

    const { shippingAddress, sourcePrescription } = req.body

    if (!shippingAddress) {
        res.status(409)
        throw new Error("Shipping Address Required!")
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product")

    if (!cart || cart.items.length === 0) {
        res.status(409)
        throw new Error("Cart Is Empty!")
    }

    // Validate stock + snapshot price/name
    let totalAmount = 0
    const orderItems = []

    for (const item of cart.items) {
        const product = item.product

        if (!product || !product.isActive) {
            res.status(409)
            throw new Error(`Product ${product ? product.name : item.product} is no longer available!`)
        }

        if (item.quantity > product.stock) {
            res.status(409)
            throw new Error(`Only ${product.stock} units of ${product.name} available!`)
        }

        orderItems.push({
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: item.quantity
        })

        totalAmount += product.price * item.quantity
    }

    // Decrement stock
    for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } })
    }

    const order = await Order.create({
        user: req.user.id,
        items: orderItems,
        totalAmount,
        shippingAddress,
        sourcePrescription: sourcePrescription || null
    })

    // Clear cart
    cart.items = []
    await cart.save()

    const populated = await Order.findById(order._id).populate("items.product")

    res.status(201).json(populated)

}

const getMyOrders = async (req, res) => {

    const orders = await Order.find({ user: req.user.id }).populate("items.product").sort({ createdAt: -1 })

    res.status(200).json(orders)

}

const getOrder = async (req, res) => {

    const oid = req.params.oid

    const order = await Order.findById(oid).populate("items.product").populate("user", "name email phone")

    if (!order) {
        res.status(404)
        throw new Error("Order Not Found!")
    }

    if (order.user._id.toString() !== req.user.id.toString() && req.user.userType !== "ADMIN") {
        res.status(401)
        throw new Error("Not Authorized!")
    }

    res.status(200).json(order)

}

const cancelOrder = async (req, res) => {

    const oid = req.params.oid

    const order = await Order.findById(oid)

    if (!order) {
        res.status(404)
        throw new Error("Order Not Found!")
    }

    if (order.user.toString() !== req.user.id.toString()) {
        res.status(401)
        throw new Error("Not Authorized!")
    }

    if (order.status !== "placed") {
        res.status(409)
        throw new Error("Only orders with status 'placed' can be cancelled!")
    }

    // Restore stock
    for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
    }

    order.status = "cancelled"
    await order.save()

    res.status(200).json(order)

}

const orderController = {
    placeOrder,
    getMyOrders,
    getOrder,
    cancelOrder
}

export default orderController
