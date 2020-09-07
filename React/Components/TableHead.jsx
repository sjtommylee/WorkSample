import React from "react";
import PropType from "prop-types";
import "./table.css";

export default function TableHead({ data }) {
  const columns = data[0] && Object.keys(data[0]);
  return (
    <thead className="table-title-container">
      <tr className="table-row-row">
        {data[0] &&
          columns.map((heading) => (
            <th className="tb-header-th" key={data.id}>
              {heading}
            </th>
          ))}
      </tr>
    </thead>
  );
}

TableHead.propTypes = {
  data: PropType.arrayOf(
    PropType.shape({
      id: PropType.string.required,
    })
  ),
};