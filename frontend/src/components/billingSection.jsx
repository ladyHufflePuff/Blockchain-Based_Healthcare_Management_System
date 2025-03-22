import React, { useState,} from "react";
import Modal from "react-modal";
import {  FaPlus, FaFilePdf, FaTrash  } from "react-icons/fa";
import { jsPDF } from "jspdf";

const BillingSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
   
    const [services, setServices] = useState([]);
    const [invoiceNumber, setInvoiceNumber] = useState(1);
    const today = new Date().toISOString().split("T")[0];
    const [pastInvoices, setPastInvoices]  = useState([
      {
        fileName: "Invoice_2025-03-15",
        status: "paid" 
      },
      {
        fileName: "Invoice_2025-02-28",
        status: "pending"
      },
    ]);
  
    const serviceGroups = {
      Consultation: ["General Consultation", "Specialist Consultation"],
      LabTests: ["Blood Test", "MRI Scan", "X-Ray"],
      Medication: ["Painkillers", "Antibiotics", "Insulin"],
      Hospitalization: ["Overnight Stay", "ICU Admission"],
      EmergencyCare: ["ER Visit", "Ambulance Service"],
      SpecialistVisits: ["Cardiologist", "Neurologist"],
      MentalHealth: ["Therapy Session", "Psychiatric Evaluation"],
    };
  
    const fixedPrices = {
      "General Consultation": 50,
      "Specialist Consultation": 100,
      "Blood Test": 30,
      "MRI Scan": 200,
      "X-Ray": 80,
      Painkillers: 10,
      Antibiotics: 25,
      Insulin: 50,
      "Overnight Stay": 500,
      "ICU Admission": 1000,
      "ER Visit": 150,
      "Ambulance Service": 300,
      Cardiologist: 120,
      Neurologist: 150,
      "Therapy Session": 80,
      "Psychiatric Evaluation": 100,
    };
    
    const addServiceRow = () => {
      setServices([
        ...services,
        { serviceGroup: "", serviceItem: "", quantity: 1, unitPrice: 0, totalPrice: 0 },
      ]);
    };
  
    const updateService = (index, key, value) => {
      const updatedServices = [...services];
      updatedServices[index][key] = value;
  
      if (key === "serviceGroup") {
        updatedServices[index].serviceItem = "";
        updatedServices[index].unitPrice = 0;
        updatedServices[index].totalPrice = 0;
      }
  
      if (key === "serviceItem") {
        updatedServices[index].unitPrice = fixedPrices[value] || 0;
        updatedServices[index].totalPrice = updatedServices[index].unitPrice * updatedServices[index].quantity;
      }
  
      if (key === "quantity") {
        updatedServices[index].totalPrice = updatedServices[index].unitPrice * value;
      }
  
      setServices(updatedServices);
    };
  
    const calculateTotalBill = () => {
      return services.reduce((sum, service) => sum + service.totalPrice, 0);
    };
    const validInvoice = services.filter(
      (s) => s.serviceGroup.trim() !== "" || s.serviceItem.trim() !== "" 
    );
    const generateInvoicePDF = () => {
      const doc = new jsPDF();
      // Invoice Header
      doc.setFontSize(16);
      doc.text("CuraBlock Medical Invoice", 70, 20);
    
      let yPosition = 35;
      doc.setFontSize(12);
      doc.text(`Patient Name: Dabrechi`, 20, yPosition);
      yPosition += 8;
      doc.text(`Medical ID: 123456789`, 20, yPosition);
      yPosition += 8;
      doc.text(`Insurance Provider: MedPlus Insurance`, 20, yPosition);
      yPosition += 8;
      doc.text(`Insurance Plan: Platinum`, 20, yPosition);
      yPosition += 8;
      doc.text(`Insurance Number: P2345678`, 20, yPosition);
      yPosition += 12;

      // Invoice Number and Date
      doc.text(`Invoice #: ${invoiceNumber}`, 20, yPosition);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, yPosition);
      yPosition += 10;
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 8;
  
    
      doc.setFontSize(12);
      doc.text("Service Group", 20, yPosition);
      doc.text("Service Item", 60, yPosition);
      doc.text("Qty", 110, yPosition);
      doc.text("Unit Price ($)", 130, yPosition);
      doc.text("Total Price ($)", 160, yPosition);

      // Draw a line under the headers
      doc.line(20, yPosition + 2, 190, yPosition + 2);
      yPosition += 10;

      // Table Body (Loop through services)
      validInvoice.forEach((s) => {
        doc.text(s.serviceGroup, 20, yPosition);
        doc.text(s.serviceItem, 60, yPosition);
        doc.text(s.quantity.toString(), 110, yPosition);
        doc.text(`$${s.unitPrice}`, 130, yPosition);
        doc.text(`$${s.totalPrice}`, 160, yPosition);
        yPosition += 8;
      });

    // Draw a line above Total Bill
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 8;

   // Total Bill
  const totalBill = calculateTotalBill();
  doc.setFontSize(14);
  doc.text(`Total Bill: $${totalBill}`, 20, yPosition);

  // Payment Status (Paid or Pending)
  const isPaid = Math.random() > 0.5; // Randomly decide payment status (for now)
  const paymentStatus = isPaid ? "Paid" : "Pending";
  

    // Save the PDF
    const pdfName = `Invoice_${invoiceNumber}.pdf`;
    doc.save(pdfName);

    // Store Past Invoices
    setPastInvoices([
      {  
        fileName: pdfName, 
        status: paymentStatus 
      },...pastInvoices
    ]);
  
    // Clear Invoice Fields
    setServices([]);
    setInvoiceNumber(invoiceNumber + 1);
    setIsModalOpen(false);
  };
  
   
    return (
      <div>
        {/* "Add New Bill" Button */}
        <div className="dashboard-card">
          <div className="card-header">
            <button className="add-bill-btn" onClick={() => setIsModalOpen(true)}>
              <FaPlus /> Add New Bill
            </button>
          </div>
        </div>
  
        {/* Billing Records List */}
        {pastInvoices.length > 0 ? (
          <div className="billing-list">
            {pastInvoices.map((bill, index) => (
              <div key={index} className="dashboard-card">
                <div className="card-header">
                  <span>{bill.fileName}</span>
                  <span className={`status-label ${bill.status.toLowerCase()}`}>{bill.status}</span>
                  <button onClick={() => window.open(`/${bill.invoiceFile}.pdf`, "_blank")}>
                    <FaFilePdf /> View Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No billing records available.</p>
        )}
  
  <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="modal-content"  overlayClassName="modal-overlay">
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
            {services.map((service, index) => (
              <tr key={index}>
                <td>
                  <select
                    value={service.serviceGroup}
                    onChange={(e) => updateService(index, "serviceGroup", e.target.value)}
                  >
                    <option value="">Select Group</option>
                    {Object.keys(serviceGroups).map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={service.serviceItem}
                    onChange={(e) => updateService(index, "serviceItem", e.target.value)}
                    disabled={!service.serviceGroup}
                  >
                    <option value="">Select Service</option>
                    {service.serviceGroup &&
                      serviceGroups[service.serviceGroup].map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    value={service.quantity}
                    onChange={(e) => updateService(index, "quantity", parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </td>
                <td>${service.unitPrice}</td>
                <td>${service.totalPrice}</td>
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

        <button className="save-btn" onClick={generateInvoicePDF} disabled={calculateTotalBill() === 0}  >
          Save Invoice as PDF
        </button>
        <button className="close-btn" onClick={() => setIsModalOpen(false)}>
          Close
        </button>
      </Modal>
      </div>
    );
  };
  
export default BillingSection;
