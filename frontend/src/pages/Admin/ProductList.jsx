import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product creation failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black-900">
      
      <div className="md:w-3/4 p-6 bg-gray-800 rounded-lg">
      <AdminMenu />
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Product</h2>

        {imageUrl && (
          <div className="text-center mb-6">
            <img
              src={imageUrl}
              alt="product"
              className="block mx-auto max-h-48 rounded-lg"
            />
          </div>
        )}

        <div className="mb-6">
          <label className="block w-full text-center border border-dashed border-gray-600 rounded-lg cursor-pointer py-4 text-white">
            {image ? image.name : "Upload Image"}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={uploadFileHandler}
              className="hidden"
            />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap space-x-4">
            <div className="flex-1">
              <label className="block text-gray-400">Name</label>
              <input
                type="text"
                className="w-full p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-400">Price</label>
              <input
                type="number"
                className="w-full p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap space-x-4">
            <div className="flex-1">
              <label className="block text-gray-400">Quantity</label>
              <input
                type="number"
                className="w-full p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-400">Brand</label>
              <input
                type="text"
                className="w-full p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap space-x-4">
            <div className="flex-1">
              <label className="block text-gray-400">Description</label>
              <textarea
                className="w-full p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="flex flex-wrap space-x-4">
            <div className="flex-1">
              <label className="block text-gray-400">Count In Stock</label>
              <input
                type="number"
                className="w-full p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label className="block text-gray-400">Category</label>
              <select
                className="w-full p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-amber-600 text-black rounded-lg font-bold text-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductList;
