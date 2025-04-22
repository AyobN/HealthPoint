import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BillingById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/receptionist/billing/edit/${id}`);
  }, [id, navigate]);

  return null;
};

export default BillingById;
