import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

import "./AdminDashboard.css"; // Import your custom CSS file
import { FaMoneyBillAlt, FaUsers, FaClipboardList } from 'react-icons/fa';

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
        height: "100%", // Adjusted height for the chart
        toolbar: {
          show: true, // Removed toolbar for a cleaner look
        },
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#FFC107", "#2196F3", "#4CAF50", "#FF5722"], // Amber, Blue, Green, Deep Orange
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "#fafafa",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },

        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="admin-dashboard-container flex flex-col items-center justify-center xl:ml-[4rem] md:ml-[0rem]">
        <div className="admin-dashboard-stats flex flex-wrap justify-center items-center">
          <div className="admin-dashboard-stat rounded-lg bg-black p-8 mx-4 my-4 flex flex-col items-center text-center">
            <div className="admin-dashboard-icon bg-amber-500 rounded-full flex items-center justify-center h-16 w-16">
              <FaMoneyBillAlt className="text-white text-4xl" />
            </div>

            <p className="admin-dashboard-label mt-4 text-white text-lg">Total Sales</p>
            <h1 className="admin-dashboard-value text-3xl font-bold text-white">
              ₱ {isLoading ? <Loader /> : sales.totalSales.toFixed(2)}
            </h1>
          </div>

          <div className="admin-dashboard-stat rounded-lg bg-black p-8 mx-4 my-4 flex flex-col items-center text-center">
            <div className="admin-dashboard-icon bg-amber-500 rounded-full flex items-center justify-center h-16 w-16">
              <FaUsers className="text-white text-4xl" />
            </div>

            <p className="admin-dashboard-label mt-4 text-white text-lg">Total Customers</p>
            <h1 className="admin-dashboard-value text-3xl font-bold text-white">
              {isLoading ? <Loader /> : customers?.length}
            </h1>
          </div>

          <div className="admin-dashboard-stat rounded-lg bg-black p-8 mx-4 my-4 flex flex-col items-center text-center">
            <div className="admin-dashboard-icon bg-amber-500 rounded-full flex items-center justify-center h-16 w-16">
              <FaClipboardList className="text-white text-4xl" />
            </div>

            <p className="admin-dashboard-label mt-4 text-white text-lg">Total Orders</p>
            <h1 className="admin-dashboard-value text-3xl font-bold text-white">
              {isLoading ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>
        </div>

        <div className="admin-dashboard-chart mt-8 w-full max-w-screen-xl flex justify-center">
          <Chart
            options={state.options}
            series={state.series}
            type="line" // Changed to line chart for better representation of sales trend
            width="300%" // Adjusted width to take 70% of the container
          />
        </div>

        <div className="admin-dashboard-orderlist mt-8 w-full max-w-100xl mx-auto">
          <OrderList />
        </div>

      </section>
    </>
  );
};

export default AdminDashboard;