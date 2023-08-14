import React, { useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./myOrder.css";
import { useSelector, useDispatch } from "react-redux/";
import { clearErrors, myOrders } from "../../actions/orderAction";
import { Link } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import Typography from "@material-ui/core/Typography";
import MetaData from "../layout/MetaData";
import LaunchIcon from "@material-ui/icons/Launch";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { loading, error, orders } = useSelector((state) => state.myOrders);
  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minwidth: 300,
      flex: 1,
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      minwidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, "paymentStatus") === "Paid"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "orderStatus",
      headerName: "Order Status",
      minwidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, "orderStatus") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minwidth: 150,
      flex: 0.4,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minwidth: 270,
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      minwidth: 150,
      flex: 0.3,
      sortable: false,

      renderCell: (params) => {
        return (
          <Link to={`/order/${params.getValue(params.id, "id")}`}>
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];
  const rows = [];
  orders &&
    orders.forEach((item, index) => {
      rows.push({
        itemsQty: item.orderItems.length,
        id: item._id,
        orderStatus: item.orderStatus,
        amount: item.totalPrice,
        paymentStatus: item.paymentInfo.status,
      });
    });
  const alert = useAlert();
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(myOrders());
  }, [dispatch, alert, error]);
  return (
    <>
      <MetaData title={`${user.name} - Orders`} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="myOrdersPage">
            <DataGrid
              columns={columns}
              rows={rows}
              pageSize={10}
              disableSelectionOnClick
              className="myOrdersTable"
              autoHeight
            />
            <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
          </div>
        </>
      )}
    </>
  );
};

export default MyOrders;
