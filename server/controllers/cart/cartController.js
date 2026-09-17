import Cart from "../../models/cartModel.js"
import Product from "../../models/productModel.js"

const getCart = async (req, res) => {

    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product")

    if (!cart) {
        cart = await Cart.create({ user: req.user.id, items: [] })
        cart = await Cart.findById(cart._id).populate("items.product")
    }

    res.status(200).json(cart)

}

const addToCart = async (req, res) => {

    const { productId, quantity } = req.body

    if (!productId) {
        res.status(409)
        throw new Error("Product ID Required!")
    }

    const qty = quantity ? Number(quantity) : 1

    if (qty < 1) {
        res.status(409)
        throw new Error("Quantity Must Be At Least 1!")
    }

    const product = await Product.findById(productId)

    if (!product || !product.isActive) {
        res.status(404)
        throw new Error("Product Not Found!")
    }

    let cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
        cart = await Cart.create({ user: req.user.id, items: [] })
    }

    const existing = cart.items.find((item) => item.product.toString() === productId)

    const newQty = existing ? existing.quantity + qty : qty

    if (newQty > product.stock) {
        res.status(409)
        throw new Error(`Only ${product.stock} units available in stock!`)
    }

    if (existing) {
        existing.quantity = newQty
    } else {
        cart.items.push({ product: productId, quantity: qty })
    }

    await cart.save()
    await cart.populate("items.product")

    res.status(200).json(cart)

}

const updateQuantity = async (req, res) => {

    const productId = req.params.productId
    const { quantity } = req.body

    const qty = Number(quantity)

    if (isNaN(qty) || qty < 0) {
        res.status(409)
        throw new Error("Invalid Quantity!")
    }

    const cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
        res.status(404)
        throw new Error("Cart Not Found!")
    }

    const existing = cart.items.find((item) => item.product.toString() === productId)

    if (!existing) {
        res.status(404)
        throw new Error("Item Not In Cart!")
    }

    if (qty === 0) {
        cart.items = cart.items.filter((item) => item.product.toString() !== productId)
    } else {
        const product = await Product.findById(productId)

        if (!product) {
            res.status(404)
            throw new Error("Product Not Found!")
        }

        if (qty > product.stock) {
            res.status(409)
            throw new Error(`Only ${product.stock} units available in stock!`)
        }

        existing.quantity = qty
    }

    await cart.save()
    await cart.populate("items.product")

    res.status(200).json(cart)

}

const removeItem = async (req, res) => {

    const productId = req.params.productId

    const cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
        res.status(404)
        throw new Error("Cart Not Found!")
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId)

    await cart.save()
    await cart.populate("items.product")

    res.status(200).json(cart)

}

const clearCart = async (req, res) => {

    const cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
        res.status(404)
        throw new Error("Cart Not Found!")
    }

    cart.items = []
    await cart.save()

    res.status(200).json(cart)

}

const cartController = {
    getCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart
}

export default cartController
