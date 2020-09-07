import React from "react";
import ReactLoading from "react-loading";

const Button = (props) => {
  const { className, loading = false } = props;
  return (
    <button {...props} className={`btn ${className}`}>
      {loading ? (
        <div className="loader center" style={{ paddingBottom: 4 }}>
          <ReactLoading height={18} width={18} color="#fff" type="spin" />
        </div>
      ) : (
        props.children
      )}
    </button>
  );
};

export default Button;
