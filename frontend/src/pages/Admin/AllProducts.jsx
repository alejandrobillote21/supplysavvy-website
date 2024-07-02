import { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

// Import the updated styles
import "./css_style/allproduct.css";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Ensure products is defined before filtering
  const filteredProducts = products ? products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (isLoading) {
    return <div className="text-center mt-5 text-amber-500">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center mt-5 text-red-500">Error loading products</div>;
  }

  return (
    <div className="flex justify-center"> {/* Center horizontally */}
      <div className="container mx-auto px-4 py-8">
      <div className="text-center text-2xl font-bold mb-4 text-white"> {/* Center text */}
              All Products ({filteredProducts.length})
            </div>
        <div className="flex flex-wrap justify-between">
          
          <div className="w-full md:w-5/4">
            
            {/* Search bar */}
            <div className="flex justify-center mb-4"> {/* Center search bar */}
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="filter-input"
                style={{ maxWidth: "90rem" }} // Adjust width as needed
              />
            </div>
            
          </div>
          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="product-container"
                >
                  <Link
                    to={`/admin/product/update/${product._id}`}
                    className="block"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                  </Link>
                  <div className="product-details">
                    <div className="mb-4">
                      <h5 className="product-name">
                        {product.name.length > 25 ? `${product.name.substring(0, 25)}...` : product.name}
                      </h5>
                      <p className="product-date">
                        {moment(product.createdAt).format("MMMM Do, YYYY")}
                      </p>
                    </div>
                    <p className="product-description">
                      {product.description.substring(0, 45)}...
                    </p>
                    <div className="product-actions">
                      <Link
                        to={`/admin/product/update/${product._id}`}
                        className="update-button"
                      >
                        Update Product
                        <svg
                          className="read-more-svg"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </Link>
                      <p className="product-price">
                        ₱ {product.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          <div className="w-full md:w-1/4 mt-6 md:mt-0">
            <AdminMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
