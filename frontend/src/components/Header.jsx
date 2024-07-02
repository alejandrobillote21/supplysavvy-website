import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <div className="flex justify-around">
      <div className="xl:block lg:hidden md:hidden sm:hidden">
      <br></br>
      <br></br>
      <br></br>
        <div className="flex justify-center">
          <ProductCarousel />
        </div>

        <div className="lg:col-span-1">
          <br></br>
          <br></br>
          <br></br>
          <div className="flex flex-wrap justify-start -mx-4">
            {data.map((product) => (
              <div>
                <div key={product._id} className="px-4 mb-4 w-1/5">
                  {/* Adjust width for 5 products */}
                  <SmallProduct product={product} />
                </div>
              </div>
              
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Header;
