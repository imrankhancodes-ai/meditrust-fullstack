import Product from "../../models/productModel.js"

const getProducts = async (req, res) => {

    const { search, category, minPrice, maxPrice, sort } = req.query

    let filter = { isActive: true }

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { genericName: { $regex: search, $options: "i" } },
            { company: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ]
    }

    if (category) {
        filter.category = category
    }

    if (minPrice || maxPrice) {
        filter.price = {}
        if (minPrice) filter.price.$gte = Number(minPrice)
        if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    let query = Product.find(filter)

    if (sort === "price_asc") query = query.sort({ price: 1 })
    else if (sort === "price_desc") query = query.sort({ price: -1 })
    else if (sort === "name") query = query.sort({ name: 1 })

    const products = await query

    res.status(200).json(products)

}

const getProduct = async (req, res) => {

    let pid = req.params.pid

    const product = await Product.findById(pid)

    if (!product) {
        res.status(404)
        throw new Error("Product Not Found!")
    }


    res.status(200).json(product)

}

const getAlternatives = async (req, res) => {

    const pid = req.params.pid

    const product = await Product.findById(pid)

    if (!product) {
        res.status(404)
        throw new Error("Product Not Found!")
    }

    if (!product.genericName) {
        return res.status(200).json([])
    }

    const alternatives = await Product.find({
        _id: { $ne: product._id },
        genericName: product.genericName,
        company: { $ne: product.company },
        isActive: true,
        stock: { $gt: 0 },
    })

    res.status(200).json(alternatives)

}



const productController = {
    getProducts,
    getProduct,
    getAlternatives
}


export default productController
