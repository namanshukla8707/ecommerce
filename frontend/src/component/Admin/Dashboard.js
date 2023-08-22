import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./Sidebar.js";
import "./Dashboard.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import { getAdminProducts } from "../../actions/productAction.js";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  ArcElement,
  DoughnutController,
} from "chart.js";
import { getAllOrders } from "../../actions/orderAction.js";
import { getAllUsers } from "../../actions/userAction.js";
ChartJS.register(
  LineElement,
  CategoryScale,
  PointElement,
  LinearScale,
  Legend,
  Tooltip,
  ArcElement,
  DoughnutController
);
const Dashboard = () => {

  const dispatch = useDispatch();
   const { orders } = useSelector((state) => state.allOrders);
  const { products } = useSelector((state) => state.products);
  const { users } = useSelector((state) => state.allUsers);
  let outOfStock = 0;
  products &&
    products.forEach((item) => {
      if (item.stock === 0) {
        outOfStock += 1;
      }
    });
  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);
   let totalAmount = 0;
   orders &&
     orders.forEach((item) => {
       totalAmount += item.totalPrice;
     });

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        data: [0, totalAmount],
        backgroundColor: "#eb4034",
        borderColor: "#00000078",
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
      },
    ],
  };
  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>
        <div className="dashboardSummary">
          <div>
            <p>
              Total Amount <br /> ₹{totalAmount}
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Product</p>
              <p>{products && products.length}</p>
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>
              <p>{orders && orders.length}</p>
            </Link>
            <Link to="/admin/users">
              <p>Users</p>
              <p>{users&&users.length}</p>
            </Link>
          </div>
        </div>
        <div className="lineChart">
          <Line data={lineState}></Line>
        </div>
        {products.length === 0 ? (
          <div></div>
        ) : (
          <div className="doughnutChart">
            <Doughnut data={doughnutState} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
