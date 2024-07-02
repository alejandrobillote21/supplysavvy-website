import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import "./css_style/productupdate.css";

const AdminProductUpdate = () => {
  const params = useParams();

  const { data: productData } = useGetProductByIdQuery(params._id);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(productData?.description || "");
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);

  const navigate = useNavigate();

  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Item added successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      setImage(res.image);
    } catch (err) {
      toast.error("Failed to upload image", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleDeleteImage = () => {
    setImage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const data = await updateProduct({ productId: params._id, formData });

      if (data?.error) {
        toast.error(data.error, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.success(`Product successfully updated`, {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.log(err);
      toast.error("Product update failed. Try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm("Are you sure you want to delete this product?");
      if (!answer) return;

      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" is deleted`, {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed. Try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="container">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="p-6 bg-black-800 rounded-lg">
          <div className="section-header">Update / Delete Product</div>

          {image && (
            <div className="relative mb-6 text-center">
              <img
                src={image}
                alt="product"
                className="block mx-auto rounded-lg"
                style={{ width: 500, height: 500 }}
              />
              <button
                onClick={handleDeleteImage}
                className="absolute top-5 right-10 text-white bg-amber-600 rounded-full p-2 hover:bg-red-700"
              >
                <FaTimes />
              </button>
            </div>
          )}

          <div className="mb-6">
            <label className="block w-full text-center border border-dashed border-gray-600 rounded-lg cursor-pointer py-4 text-white font-bold">
              {image ? image.name : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="text-white"
              />
            </label>
          </div>

          <div className="p-3">
            <div className="flex flex-wrap mb-4">
              <div className="w-full md:w-1/2 px-3 mb-3">
                <label htmlFor="name" className="block text-gray-400">Name</label>
                <input
                  type="text"
                  className="input-filter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/2 px-3 mb-3">
                <label htmlFor="price" className="block text-gray-400">Price</label>
                <input
                  type="number"
                  className="input-filter"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap mb-4">
              <div className="w-full md:w-1/2 px-3 mb-3">
                <label htmlFor="quantity" className="block text-gray-400">Quantity</label>
                <input
                  type="number"
                  min="1"
                  className="input-filter"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/2 px-3 mb-3">
                <label htmlFor="brand" className="block text-gray-400">Brand</label>
                <input
                  type="text"
                  className="input-filter"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full px-3 mb-4">
              <label htmlFor="description" className="block text-gray-400">Description</label>
              <textarea
                className="input-filter"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap mb-4">
              <div className="w-full md:w-1/2 px-3 mb-3">
                <label htmlFor="stock" className="block text-gray-400">Count In Stock</label>
                <input
                  type="number"
                  className="input-filter"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/2 px-3 mb-3">
                <label htmlFor="category" className="block text-gray-400">Category</label>
                <select
                  className="input-filter"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-amber-600 text-black rounded-lg font-bold text-lg mr-4 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Update
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-amber-600 text-black rounded-lg font-bold text-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
              
export default AdminProductUpdate;
               
