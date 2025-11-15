// models/Product.js
import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: {
        type: String,
        required: true
    },
    productId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    category: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'Category' },
    link: {
        type: String,
        required: true
    },
    images: [String],
    videos: [String]
}, { timestamps: true });
export default mongoose.model('Product', productSchema);
