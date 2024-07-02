import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import "./shop.css"; // Import the CSS file

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );
  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) =>
            product.price.toString().includes(priceFilter) ||
            product.price === parseInt(priceFilter, 10)
        );
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  useEffect(() => {
    if (searchQuery) {
      const filteredProducts = filteredProductsQuery.data.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      dispatch(setProducts(filteredProducts));
    } else {
      dispatch(setProducts(filteredProductsQuery.data));
    }
  }, [searchQuery, filteredProductsQuery.data, dispatch]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...new Set(
      filteredProductsQuery.data
        ?.map((product) => product.brand)
        .filter((brand) => brand !== undefined)
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 mb-8 md:mb-0">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Filter By:</h3>
            <div className="mb-2">
              <h4 className="text-gray-400 mb-1">Categories:</h4>
              {categories?.map((c) => (
                <div key={c._id} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={c._id}
                    onChange={(e) => handleCheck(e.target.checked, c._id)}
                    className="filter-checkbox"
                  />
                  <label htmlFor={c._id} className="filter-label">{c.name}</label>
                </div>
              ))}
            </div>
            <div className="mb-2">
              <h4 className="text-gray-400 mb-1">Price Range:</h4>
              <input
                type="text"
                placeholder="Enter price filter..."
                value={priceFilter}
                onChange={handlePriceChange}
                className="filter-input"
              />
            </div>
            <div className="mb-2">
              <h4 className="text-gray-400 mb-1">Filter by Brands:</h4>
              {uniqueBrands?.map((brand) => (
                <div key={brand} className="flex items-center mb-1">
                  <input
                    type="radio"
                    id={brand}
                    name="brand"
                    onChange={() => handleBrandClick(brand)}
                    className="filter-checkbox"
                  />
                  <label htmlFor={brand} className="filter-label">{brand}</label>
                </div>
              ))}
            </div>
            <div>
              <button onClick={() => window.location.reload()} className="reset-button">
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="filter-input"
            />
          </div>
          <div>
            <div className="text-2xl font-bold mb-4 text-white">
              All Products ({products?.length || 0})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {products && products.length > 0 ? (
                products.map((p) => (
                  <div key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              ) : (
                <Loader />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
