import React from "react";
import PropType from "prop-types";
import debug from "../checkout/Code/node_modules/airpals-debug";
import "./table.css";
import "rc-pagination/assets/index.css";
const logger = debug.extend("TableForm");
const columnMap = require("./paymentconfig.json");


Table.tbHeader = function tbHeader(props) {
  return <th {...props} />;
};

Table.tbRow = function tbRow(props) {
  return <tr {...props} />;
};

Table.tbData = function tbData(props) {
  return <td {...props} />;
};

export default function Table({ deleteHandler, children, ...props }) {
  const handleDelete = (e) => {
    deleteHandler(e.target.id);
  };
  const rows = props.data.map((item, index) => (
    <Table.tbRow className="table-row-row" key={index}>
      {Object.values(item).map((item, index) => (
        <Table.tbData key={index}>{item}</Table.tbData>
      ))}
      <td className="btn-container">
        <button className="table-delete-btn">
          <i
            className="fa fa-ban"
            aria-hidden="true"
            id={props.data[index].id}
            key={index}
            onClick={handleDelete}
          ></i>
        </button>
      </td>
    </Table.tbRow>
  ));
  return (
    <table {...props}>
      <thead>
        <Table.tbRow>
          {Object.keys(props.data[0]).map((item, index) => {
            logger(columnMap[item], "1111111111111111", item);
            return (
              <Table.tbHeader key={index}>
                <label>{columnMap[item]}</label>
              </Table.tbHeader>
            );
          })}
        </Table.tbRow>
      </thead>
      <tbody>
        {rows}
        {children}
      </tbody>
    </table>
  );
}

Table.propTypes = {
  children: PropType.node,
  data: PropType.arrayOf(PropType.Object),
  deleteHandler: PropType.func.required,
};
