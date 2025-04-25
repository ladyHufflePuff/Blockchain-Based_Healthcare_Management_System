import React, { useState, useEffect} from "react";
import Modal from "react-modal";
import { FaPlus, FaFilePdf, FaTrash } from "react-icons/fa";
import { jsPDF } from "jspdf";
import { handleUploadbill, handleViewDocument } from "../client";

const BillingSection = ({ patientData, patient, user, setPatientData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [pastInvoices, setPastInvoices] = useState([]);
  const [serviceGroups, setServiceGroups] = useState({});
  const [fixedPrices, setFixedPrices] = useState({});
  const today = new Date().toISOString().split("T")[0];

  // Extract service groups and prices when patientData changes
  useEffect(() => {
    const catalog = user?.record?.serviceCatalog;

    const flatPrices = {};
    for (const group in catalog) {
      catalog[group].forEach((item) => {
        flatPrices[item.name] = item.price;
      });
    }

    if (patientData && patientData.billing && Array.isArray(patientData.billing)) {
      setPastInvoices(patientData.billing);
    }

    setServiceGroups(catalog);
    setFixedPrices(flatPrices);
  }, [patientData]);

  // Add new empty service row
  const addServiceRow = () => {
    setServices([
      ...services,
      { serviceGroup: "", serviceItem: "", quantity: 1, unitPrice: 0, totalPrice: 0 },
    ]);
  };

  // Handle updates to service fields (group, item, quantity)
  const updateService = (index, key, value) => {
    const updated = [...services];
    updated[index][key] = value;

    if (key === "serviceGroup") {
      updated[index].serviceItem = "";
      updated[index].unitPrice = 0;
      updated[index].totalPrice = 0;
    }

    if (key === "serviceItem") {
      updated[index].unitPrice = fixedPrices[value] || 0;
      updated[index].totalPrice = updated[index].unitPrice * updated[index].quantity;
    }

    if (key === "quantity") {
      updated[index].totalPrice = updated[index].unitPrice * value;
    }

    setServices(updated);
  };

  // Calculate total of all selected services
  const calculateTotalBill = () => {
    return services.reduce((sum, s) => sum + s.totalPrice, 0);
  };

  // Filter out invalid/incomplete services before generating invoice
  const validInvoice = services.filter(
    (s) => s.serviceGroup.trim() !== "" || s.serviceItem.trim() !== ""
  );

  // Generate invoice PDF with insurance calculation
  const generateInvoicePDF = async () => {
    const doc = new jsPDF();

    // Header section
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(" Medical Invoice", 70, 24);

    let yPosition = 35;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Full Name: ", 20, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(`${patientData.name}`, 43, yPosition);
    yPosition += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Insurance Provider :", 20, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(`${patientData.insuranceDetails.providerName}`, 63, yPosition);
    yPosition += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Insurance Number :", 20, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(`${patientData.insuranceDetails.policyNumber}`, 62, yPosition);
    yPosition += 20;

    // Invoice number and date
    doc.text(`Invoice #: ${invoiceNumber}`, 20, yPosition);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, yPosition);
    yPosition += 10;
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 8;

    // Table headers
    doc.setFontSize(12);
    doc.text("Service Group", 20, yPosition);
    doc.text("Service Item", 60, yPosition);
    doc.text("Qty", 110, yPosition);
    doc.text("Unit Price ($)", 130, yPosition);
    doc.text("Total Price ($)", 160, yPosition);
    doc.line(20, yPosition + 2, 190, yPosition + 2);
    yPosition += 10;

    // Table rows with invoice services
    validInvoice.forEach((s) => {
      doc.text(s.serviceGroup, 20, yPosition);
      doc.text(s.serviceItem, 60, yPosition);
      doc.text(s.quantity.toString(), 110, yPosition);
      doc.text(`$${s.unitPrice}`, 130, yPosition);
      doc.text(`$${s.totalPrice}`, 160, yPosition);
      yPosition += 8;
    });

    doc.line(20, yPosition, 190, yPosition);
    yPosition += 8;

    // Calculate insurance coverage and patient dues
    let totalBill = calculateTotalBill();
    let coverageBalance = patientData.insuranceDetails.coverageBalance || 0;
    const coverageDetails = patientData.insuranceDetails.coverageDetails || [];

    let insuranceCoveredAmount = 0;

    validInvoice.forEach((service) => {
      if (coverageDetails.includes(service.serviceGroup) && coverageBalance > 0) {
        const coveredAmount = Math.min(service.totalPrice, coverageBalance);
        insuranceCoveredAmount += coveredAmount;
        coverageBalance -= coveredAmount;
      }
    });

    const patientOwes = totalBill - insuranceCoveredAmount;
    const paymentStatus = patientOwes <= 0 ? "Paid" : "Pending";

    // Summary section in invoice
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Total Bill: $${totalBill.toFixed(2)}`, 130, yPosition);
    yPosition += 8;
    doc.text(`Insurance Covered: $${insuranceCoveredAmount.toFixed(2)}`, 130, yPosition);
    yPosition += 8;
    doc.text(`Amount Due: $${patientOwes.toFixed(2)}`, 130, yPosition);

    // Convert PDF blob to base64 for upload
    const convertBlobToBase64 = (blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };

    const filename = `Invoice_${invoiceNumber} [${today}]`;
    const pdfBlob = doc.output('blob');
    const file = await convertBlobToBase64(pdfBlob);
    const status = paymentStatus;
    return { filename, file, status, coverageBalance };
  };

  return (
    <div>
      {/* Button to open modal */}
      <div className="dashboard-card">
        <div className="card-header">
          <button className="edit-toggle back-btn" onClick={() => setIsModalOpen(true)}>
            <FaPlus /> Add New Bill
          </button>
        </div>
      </div>

      {/* Past billing records */}
      {pastInvoices.length > 0 ? (
        <div className="billing-list">
          {[...pastInvoices].reverse().map((bill, index) => (
            <div key={index} className="dashboard-card">
              <div className="card-header">
                <span>{bill.filename}</span>
                <span className={`status-label ${bill.status.toLowerCase()}`}>{bill.status}</span>
                <button className="edit-toggle back-btn" onClick={() => handleViewDocument(patient, bill.file)}>
                  <FaFilePdf /> View Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No billing records available.</p>
      )}

      {/* Modal for generating new invoice */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="modal-content" overlayClassName="modal-overlay">
        <h2>Generate Invoice</h2>
        <table className="billing-table">
          <thead>
            <tr>
              <th>Service Group</th>
              <th>Service Item</th>
              <th>Quantity</th>
              <th>Unit Price ($)</th>
              <th>Total Price ($)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, index) => (
              <tr key={index}>
                <td>
                  <select
                    value={s.serviceGroup}
                    onChange={(e) => updateService(index, "serviceGroup", e.target.value)}
                  >
                    <option value="">Select Group</option>
                    {Object.keys(serviceGroups).map((group) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={s.serviceItem}
                    onChange={(e) => updateService(index, "serviceItem", e.target.value)}
                    disabled={!s.serviceGroup}
                  >
                    <option value="">Select Service</option>
                    {s.serviceGroup &&
                      serviceGroups[s.serviceGroup].map((item) => (
                        <option key={item.name} value={item.name}>{item.name}</option>
                      ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    value={s.quantity}
                    onChange={(e) => updateService(index, "quantity", parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </td>
                <td>${s.unitPrice}</td>
                <td>${s.totalPrice}</td>
                <td>
                  <button className="delete-btn" onClick={() => setServices(services.filter((_, i) => i !== index))}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="add-btn" onClick={addServiceRow}>
          <FaPlus /> Add Service
        </button>

        <h3>Total Bill: ${calculateTotalBill()}</h3>

        {/* Save invoice and upload */}
        <button
          className="save-btn"
          onClick={async () => {
            const invoice = await generateInvoicePDF();
            await handleUploadbill(user, patient, invoice, setPatientData);
            setServices([]);
            setInvoiceNumber(prev => prev + 1);
            setIsModalOpen(false);
          }}
          disabled={calculateTotalBill() === 0}
        >
          Save Invoice
        </button>

        <button className="close-btn" onClick={() => setIsModalOpen(false)}>
          Close
        </button>
      </Modal>
    </div>
  );
};

export default BillingSection;
