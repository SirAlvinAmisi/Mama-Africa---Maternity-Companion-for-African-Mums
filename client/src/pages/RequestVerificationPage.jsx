import { useEffect, useState } from "react";
import axios from "axios";

const RequestVerificationPage = () => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    axios.post("http://localhost:5000/healthpro/request-verification", {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setStatus("success");
    })
    .catch((err) => {
      if (err.response?.status === 400) {
        setStatus("already");
      } else {
        setStatus("error");
      }
    });
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-cyan-200 rounded shadow">
      {status === "loading text-black" && <p>Requesting verification...</p>}
      {/* {status === "success" && <p className="text-green-600 font-semibold">Verification requested successfully.</p>}
      {status === "already" && <p className="text-yellow-600 font-semibold">You have already requested verification.</p>}
      {status === "error" && <p className="text-red-600 font-semibold">Something went wrong. Please try again later.</p>} */}
    </div>
  );
};

export default RequestVerificationPage;
