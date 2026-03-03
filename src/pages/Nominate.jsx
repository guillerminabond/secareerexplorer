import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NominateModal from "@/components/NominateModal";

export default function Nominate() {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setShowModal(false);
    navigate("/all-orgs");
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Nominate an organization
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Suggest an organization for the HBS SE Career Explorer. Our team will review it.
      </p>

      {showModal && <NominateModal onClose={handleClose} />}
    </div>
  );
}
