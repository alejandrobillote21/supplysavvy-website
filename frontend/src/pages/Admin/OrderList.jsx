import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import * as XLSX from 'xlsx';
import "../Admin/css_style/OrderList.css";
import { ResizableBox } from 'react-resizable';

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [orderNoFilter, setOrderNoFilter] = useState("");
  const [idNumberFilter, setIdNumberFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [totalFilter, setTotalFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [shippingOptionFilter, setShippingOptionFilter] = useState("");
  const [paidFilter, setPaidFilter] = useState("");
  const [deliveredFilter, setDeliveredFilter] = useState("");

  const filteredOrders = orders
    ? orders.filter((order) => {
        const idNumber = order.user?.id_number?.toLowerCase() || "";
        const firstName = order.user?.firstname?.toLowerCase() || "";
        const lastName = order.user?.lastname?.toLowerCase() || "";
        const createdAt = order.createdAt || "";
        const paymentMethod = order.paymentMethod?.toLowerCase() || "";
        const shippingOption = order.shippingOption?.toLowerCase() || "";
        const totalPrice = order.totalPrice.toString();

        return (
          order._id.toLowerCase().includes(orderNoFilter.toLowerCase()) &&
          idNumber.includes(idNumberFilter.toLowerCase()) &&
          (firstName.includes(userFilter.toLowerCase()) ||
            lastName.includes(userFilter.toLowerCase())) &&
          createdAt.includes(dateFilter) &&
          totalPrice.includes(totalFilter) &&
          paymentMethod.includes(paymentMethodFilter.toLowerCase()) &&
          shippingOption.includes(shippingOptionFilter.toLowerCase()) &&
          (paidFilter === "" ||
            (paidFilter === "paid" && order.isPaid) ||
            (paidFilter === "pending" && !order.isPaid)) &&
          (deliveredFilter === "" ||
            (deliveredFilter === "delivered" && order.isDelivered) ||
            (deliveredFilter === "pending" && !order.isDelivered))
        );
      })
    : [];

  const resetFilters = () => {
    setOrderNoFilter("");
    setIdNumberFilter("");
    setUserFilter("");
    setDateFilter("");
    setTotalFilter("");
    setPaymentMethodFilter("");
    setShippingOptionFilter("");
    setPaidFilter("");
    setDeliveredFilter("");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredOrders.map((order) => ({
        "Order No": order._id,
        "ID Number": order.user.id_number,
        "Name": `${order.user.firstname} ${order.user.lastname}`,
        "Date": order.createdAt ? order.createdAt.substring(0, 10) : "N/A",
        "Total": order.totalPrice,
        "Payment Method": order.paymentMethod,
        "Shipping Option": order.shippingOption,
        "Paid": order.isPaid ? "Paid" : "Pending",
        "Delivered": order.isDelivered ? "Delivered" : "Pending",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
  };

  const [columnWidths, setColumnWidths] = useState({
    items: 100,
    orderNo: 100,
    idNo: 100,
    name: 150,
    date: 120,
    total: 100,
    payment: 150,
    shipping: 150,
    paid: 100,
    status: 100,
    action: 100,
  });

  const handleResize = (index, e, { size }) => {
    const newWidths = { ...columnWidths };
    newWidths[index] = size.width;
    setColumnWidths(newWidths);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="content-center">
            <h1 className="section-header">ORDER LIST</h1>
            <AdminMenu className="admin-menu" />
            {/* Filter section */}
            <div className="filter-section">
              <div className="filter-inputs">
                <input
                  type="text"
                  placeholder="Order No."
                  value={orderNoFilter}
                  onChange={(e) => setOrderNoFilter(e.target.value)}
                  className="input-filter"
                />
                <input
                  type="text"
                  placeholder="ID Number"
                  value={idNumberFilter}
                  onChange={(e) => setIdNumberFilter(e.target.value)}
                  className="input-filter"
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="input-filter"
                />
                <input
                  type="text"
                  placeholder="Date (YYYY-MM-DD)"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="input-filter"
                />
                <input
                  type="text"
                  placeholder="Total"
                  value={totalFilter}
                  onChange={(e) => setTotalFilter(e.target.value)}
                  className="input-filter"
                />
                <input
                  type="text"
                  placeholder="Payment Method"
                  value={paymentMethodFilter}
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                  className="input-filter"
                />
                <input
                  type="text"
                  placeholder="Shipping Option"
                  value={shippingOptionFilter}
                  onChange={(e) => setShippingOptionFilter(e.target.value)}
                  className="input-filter"
                />
                <select
                  value={paidFilter}
                  onChange={(e) => setPaidFilter(e.target.value)}
                  className="select-filter"
                >
                  <option value="">Paid Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
                <select
                  value={deliveredFilter}
                  onChange={(e) => setDeliveredFilter(e.target.value)}
                  className="select-filter"
                >
                  <option value="">Delivered Status</option>
                  <option value="delivered">Delivered</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="filter-button">
                <button className="reset-button" onClick={resetFilters}>
                  Reset Filters
                </button>
                <button className="download-button" onClick={downloadExcel}>
                  Download Excel
                </button>
              </div>
            </div>

            {/* Table of orders */}
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <ResizableBox
                      width={columnWidths.items}
                      height={20}
                      axis="x"
                      resizeHandles={["e"]}
                      onResizeStop={(e, data) =>
                        handleResize("items", e, data)
                      }
                    >
                      <div style={{ width: columnWidths.items }}>Items</div>
                    </ResizableBox>
                  </th>
                  <th>
                    <ResizableBox
                      width={columnWidths.orderNo}
                      height={20}
                      axis="x"
                      resizeHandles={["e"]}
                      onResizeStop={(e, data) =>
                        handleResize("orderNo", e, data)
                      }
                    >
                      <div style={{ width: columnWidths.orderNo }}>OR No.</div>
                    </ResizableBox>
                  </th>
                  <th>
                    <ResizableBox
                      width={columnWidths.idNo}
                      height={20}
                      axis="x"
                      resizeHandles={["e"]}
                      onResizeStop={(e, data) => handleResize("idNo", e, data)}
                    >
                      <div style={{ width: columnWidths.idNo }}>ID No.</div>
                    </ResizableBox>
                  </th>
                  <th>
                    <ResizableBox
                      width={columnWidths.name}
                      height={20}
                      axis="x"
                      resizeHandles={["e"]}
                      onResizeStop={(e, data) => handleResize("name", e, data)}
                    >
                      <div style={{ width: columnWidths.name }}>Name</div>
                    </ResizableBox>
                  </th>
                  <th>
                    <ResizableBox
                      width={columnWidths.date}
                      height={20}
                      axis="x"
                      resizeHandles={["e"]}
                      onResizeStop={(e, data) => handleResize("date", e, data)}
                    >
                      <div style={{ width: columnWidths.date }}>Date</div>
                    </ResizableBox>
                  </th>
                  <th>
                    <ResizableBox
                      width={columnWidths.total}
                      height={20}
                      axis="x"
                      resizeHandles={["e"]}
                      onResizeStop={(e, data) => handleResize("total", e, data)}
                    >
                      <div style={{ width: columnWidths.total }}>Total</div>
                    </ResizableBox>
                  </th>
                  <th>
                    <ResizableBox
                      width={columnWidths.payment}
                      height={20}
                      axis="x"
                      resizeHandles={["e"]}
                      onResizeStop={(e, data) =>
                        handleResize("payment", e, data)
                      }
                    >
                      <div style={{ width: columnWidths.payment }}>
                        Payment
                      </div>
                    </ResizableBox>
                  </th>
                  <th>
                    <ResizableBox
                      width={columnWidths.shipping}
                      height={20}
                      axis="x"
                      resizeHandles={["e"]}
                      onResizeStop={(e, data) =>
                        handleResize("shipping", e, data)
                      }
                    >
                      <div style={{ width: columnWidths.shipping }}>
                        Shipping
                      </div>
                    </ResizableBox>
                  </th>
                  <th>
                    <ResizableBox
                      width={columnWidths.paid}
                      height={20}
                      axis="x"
                      resizeHandles={["e"]}
                      onResizeStop={(e, data) => handleResize("paid", e, data)}
                    >
                      <div style={{ width: columnWidths.paid }}>Paid</div>
                    </ResizableBox>
                  </th>
                  <th>
                    <ResizableBox
                      width={columnWidths.status}
                      height={20}
                      axis="x"
                      resizeHandles={["e"]}
                      onResizeStop={(e, data) => handleResize("status", e, data)}
                    >
                      <div style={{ width: columnWidths.status }}>Status</div>
                    </ResizableBox>
                  </th>
                  <th>
                    <ResizableBox
                      width={columnWidths.action}
                      height={20}
                      axis="x"
                      resizeHandles={["e"]}
                      onResizeStop={(e, data) => handleResize("action", e, data)}
                    >
                      <div style={{ width: columnWidths.action }}></div>
                    </ResizableBox>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <img
                        src={order.orderItems[0].image}
                        alt={order._id}
                        className="order-item-image"
                      />
                    </td>
                    <td>{order._id}</td>
                    <td>{order.user.id_number}</td>
                    <td>
                      {order.user
                        ? `${order.user.firstname} ${order.user.lastname}`
                        : "N/A"}
                    </td>
                    <td>
                      {order.createdAt
                        ? order.createdAt.substring(0, 10)
                        : "N/A"}
                    </td>
                    <td>₱ {order.totalPrice}</td>
                    <td>{order.paymentMethod}</td>
                    <td>{order.shippingOption}</td>
                    <td>
                      {order.isPaid ? (
                        <span className="status-badge status-paid">Paid</span>
                      ) : (
                        <span className="status-badge status-pending">
                          Pending
                        </span>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        <span className="status-badge status-paid">
                          Delivered
                        </span>
                      ) : (
                        <span className="status-badge status-pending">
                          Pending
                        </span>
                      )}
                    </td>
                    <td>
                      <Link to={`/order/${order._id}`} className="more-link">
                        More
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderList;
