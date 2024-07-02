import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-4 xl:block lg:block md:block">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="xl:w-[50rem]  lg:w-[50rem] md:w-[56rem] sm:w-[40rem] sm:block"
        >
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id}>
                <img
                  src={image}
                  alt={name}
                  className="w-full rounded-lg object-cover h-[30rem]"
                />

              <div className="bg-black p-4">
                <h1 className="text-2xl font-bold text-white mb-2">{name}</h1>
                <p className="text-amber-500 text-base font-bold mb-2">₱ {price}</p>
                <p className="text-white-600 mb-4">{description.substring(0, 170)}...</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="flex items-center mb-2">
                      <FaStore className="mr-2 text-amber-500" /> <span className="text-white-800">Brand:</span> &nbsp; {brand}
                    </h3>
                    <h3 className="flex items-center mb-2">
                      <FaClock className="mr-2 text-amber-500" /> <span className="text-white-800">Added:</span> &nbsp; {moment(createdAt).fromNow()}
                    </h3>
                    <h3 className="flex items-center mb-2">
                      <FaStar className="mr-2 text-amber-500" /> <span className="text-white-800">Reviews:</span> &nbsp; {numReviews}
                    </h3>
                  </div>
                  <div>
                    <h3 className="flex items-center mb-2">
                      <FaStar className="mr-2 text-amber-500" /> <span className="text-white-800">Ratings:</span> &nbsp; {Math.round(rating)}
                    </h3>
                    <h3 className="flex items-center mb-2">
                      <FaShoppingCart className="mr-2 text-amber-500" /> <span className="text-white-800">Quantity:</span> &nbsp; {quantity}
                    </h3>
                    <h3 className="flex items-center mb-2">
                      <FaBox className="mr-2 text-amber-500" /> <span className="text-white-800">In Stock:</span> &nbsp; {countInStock}
                    </h3>
                    <div className="text-center"> {/* Center align content */}
                      <div className="text-right"> {/* Right align content */}
                        <Link to="/shop" className="bg-amber-500 text-black font-bold rounded-full py-2 px-6 inline-block hover:bg-amber-600 transition-colors">
                          Shop Now
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
