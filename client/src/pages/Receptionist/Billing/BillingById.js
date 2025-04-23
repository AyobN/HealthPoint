import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../../api";

const BillingById = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    API.get(`/bills/${id}`).then((res) => setBill(res.data));
  }, [id]);

  if (!bill) return <p>Loading bill...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Bill #{bill.bill_id}</h2>
      <p>
        <strong>Patient ID:</strong> {bill.patient_id}
      </p>
      <p>
        <strong>Description:</strong> {bill.description}
      </p>
      <p>
        <strong>Amount:</strong> ${bill.amount.toFixed(2)}
      </p>
      <p>
        <strong>Status:</strong> {bill.status}
      </p>
      <p>
        <strong>Issued:</strong> {new Date(bill.issued_date).toLocaleString()}
      </p>
      <Link to={`/receptionist/billing/edit/${bill.bill_id}`}>
        <button>Manage</button>
      </Link>
    </div>
  );
};

export default BillingById;
