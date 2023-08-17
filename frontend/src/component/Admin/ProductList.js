import React, { useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getAdminProducts } from "../../actions/productAction";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from "./Sidebar";

const ProductList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { products, error } = useSelector((state) => state.products);
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getAdminProducts());
  },[dispatch,alert,error]);
  const columns = [
    {
      field: "id",
      headerName: "Product ID",
      minwidth: 200,
      flex: 0.5,
    },

    {
      field: "name",
      headerName: "Name",
      minwidth: 350,
      flex: 1,
    },
    {
      field: "stock",
      headerName: "Stock",
      minwidth: 200,
      type: "number",
      flex: 0.5,
    },
    {
      field: "price",
      headerName: "Price",
      minwidth: 270,
      type: "number",
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      minwidth: 150,
      sortable: false,
      type: "number",
      flex: 0.3,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>
            <Button>
              <DeleteIcon />
            </Button>
          </>
        );
      },
    },
  ];
  const rows = [];
  products &&
    products.forEach((item) => {
      rows.push({
        id: item._id,
        stock: item.stock,
        price: item.price,
        name: item.name,
      });
    });
  return (
    <>
      <MetaData title={`ALL PRODUCTS - Admin`} />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL PRODUCTS</h1>
          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </>
  );
};

export default ProductList;
