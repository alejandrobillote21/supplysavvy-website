import React, { useState } from 'react';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../../redux/api/orderApiSlice';
import './css_style/userorder.css';

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = orders?.filter((order) =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="section-header">
        <h2>My Orders</h2>
      </div>

      <div className="filter-section">
        <div className="filter-inputs">
          <input
            type="text"
            placeholder="Search Order by Order ID"
            value={searchTerm}
            onChange={handleSearchChange}
            className="input-filter"
          />
        </div>
      </div>

      <div className="table-container">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.error || error.error}</Message>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <img
                      src={order.orderItems[0].image}
                      alt={order.user}
                      className="order-item-image"
                    />
                  </td>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>₱ {order.totalPrice}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        order.isPaid ? 'status-paid' : 'status-pending'
                      }`}
                    >
                      {order.isPaid ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        order.isDelivered ? 'status-paid' : 'status-pending'
                      }`}
                    >
                      {order.isDelivered ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <Link to={`/order/${order._id}`} className="more-link">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserOrder;
