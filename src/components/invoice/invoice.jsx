import { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    clientName: '',
    clientAddress: '',
    clientPhoneNumber: '',
    items: [],
    taxes: [],
    discounts: [],
    totalAmountDue: 0,
    totalPaid: 0,
    termsAndConditions: '',
    logo: 'default_logo.png', // Default logo image
    billedFrom: '',
  });

  let htmlTemplate = 
  `<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Invoice Template</title><style>p,label,h2,h3,h4{padding:0px;margin:0px}h1,h2,h3,h4,p{font-family:sans-serif}p{font-weight:normal}h2{font-size:14px}.invoice-section {width: 100vw;display: flex;justify-content: center;}.invoice-container {width: 800px;margin: 0 auto;padding: 20px;border: 1px solid #fff;border-radius: 5px;}.invoice-header {display: flex;justify-content: space-between;margin-bottom: 20px;padding: 0px 30px;}.invoice-header h2 {font-size: 24px;font-weight: bold;}.invoice-logo {max-width: 200px;}.invoice-info {display: flex;flex-direction: column;}.invoice-info label {font-weight: bold;display: flex;}.invoice-info input,.invoice-info textarea {width: 100%;padding: 8px;margin-bottom: 10px;border: 1px solid #ccc;border-radius: 5px;}.invoice-items {margin-bottom: 20px;}.invoice-items input[type="text"],.invoice-items input[type="number"] {width: calc(33.33% - 10px);margin-right: 10px;padding: 8px;border: 1px solid #ccc;border-radius: 5px;}.invoice-items button {padding: 8px 12px;background-color: #007bff;color: #fff;border: none;border-radius: 5px;cursor: pointer;}.invoice-items button:hover {background-color: #0056b3;}.invoice-items button[type="button"] {background-color: #dc3545;}.invoice-items button[type="button"]:hover {background-color: #bd2130;}.invoice-items > div {display: flex;align-items: center;margin-bottom: 10px;}.invoice-items > div:last-child {margin-bottom: 0;}.invoice-footer {margin-top: 20px;}.invoice-footer button {padding: 10px 20px;background-color: #28a745;color: #fff;border: none;border-radius: 5px;cursor: pointer;}.invoice-footer button:hover {background-color: #218838;}</style></head><body><div><div class='invoice-section'><div class='invoice-container' id='invoice-container'><div class='invoice-header'><h2>Invoice</h2></div><div class='invoice-info'><label style="width: 500px"><h2>Invoice Number:&nbsp;</h2><p>&nbsp;${invoiceData.invoiceNumber}</p></label><br/><label ><h2>Invoice Date: &nbsp;</h2><p>&nbsp;${invoiceData.invoiceDate}</p></label><br/><label><h2>Due Date: &nbsp;</h2><p>&nbsp;${invoiceData.dueDate}</p></label><br/><label><h2>Client Name: &nbsp;</h2><p>&nbsp;${invoiceData.clientName}</p></label><br/><label><h2>Client Address: &nbsp;</h2><p>&nbsp;${invoiceData.clientAddress}</p></label><br/><label><h2>Client Phone Number: </h2><p>&nbsp;${invoiceData.clientPhoneNumber}</p></label><br/></div><div class='invoice-info'><h3>Items</h3><div style="display: grid;grid-template-columns:repeat(3, 1fr);justify-items:center;border:1px solid rgba(0, 0, 0, .1);><p>Description</p><p>Quantity</p><p>Price</p></div><p>${invoiceData.items.map((item) => `<div style="display: grid;grid-template-columns:repeat(3, 1fr);justify-items:center;border:1px solid rgba(0, 0, 0, .1);"><div>${item.description}</div><div>${item.quantity}</div><div>${item.price}</div></div>`)}</p></div><br/><label><p>Total Amount Due: &nbsp;</p><p>&nbsp;$${invoiceData.totalAmountDue}</p></label><br/><label><p>Total Paid: &nbsp;</p><p>&nbsp;$${invoiceData.totalPaid}</p></label><br/><label><p>Terms and Conditions:<p><br><p>${invoiceData.termsAndConditions}</p></label><br/><label><p>Billed From: &nbsp;<span>&nbsp;${invoiceData.billedFrom}</span></p></label><br/></div></div></div></body></html>`

  const [htmlContent, setHtmlContent] = useState('');

  const handleHtmlChange = (e) => {
    setHtmlContent(e.target.value);
  };

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({
      ...invoiceData,
      [name]: value,
    });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 0, price: 0 }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = [...invoiceData.items];
    updatedItems.splice(index, 1);
    setInvoiceData({
      ...invoiceData,
      items: updatedItems,
    });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...invoiceData.items];
    updatedItems[index][name] = value;
    setInvoiceData({
      ...invoiceData,
      items: updatedItems,
    });
  };

  const generatePDF = async (e) => {
    e.preventDefault()
      try {
        const html = htmlTemplate.toString();
        const response = await axios.post('https://html-to-pdf-api-zeta.vercel.app/conversion', {html: html}, { responseType: 'arraybuffer' });
        console.log(response.data)
        // Create a Blob from the response data
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
  
        // Use file-saver to trigger the download
        saveAs(pdfBlob, 'invoice.pdf');
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
  };


  return (
    <div className='invoice-section'>
        <div className='invoice-container' id='invoice-container' value={htmlContent} onChange={handleHtmlChange}>
            <div className='invoice-header'>
                <h2>Customizable Invoice</h2>
            </div>
        
        <form>
            <div className='invoice-info'>
                <label style={{width: '40%'}}>
                Invoice Number:
                <input
                    type="text"
                    name="invoiceNumber"
                    value={invoiceData.invoiceNumber}
                    onChange={handleChange}
                />
                </label><br/>
                <label style={{width: '40%'}}>
                Invoice Date:
                <input
                    type="date"
                    name="invoiceDate"
                    value={invoiceData.invoiceDate}
                    onChange={handleChange}
                />
                </label><br/>
                <label style={{width: '40%'}}>
                Due Date:
                <input
                    type="date"
                    name="dueDate"
                    value={invoiceData.dueDate}
                    onChange={handleChange}
                />
                </label><br/>
                <label>
                Client Name:
                <input
                    type="text"
                    name="clientName"
                    value={invoiceData.clientName}
                    onChange={handleChange}
                />
                </label><br/>
                <label>
                Client Address:
                <input
                    type="text"
                    name="clientAddress"
                    value={invoiceData.clientAddress}
                    onChange={handleChange}
                />
                </label><br/>
                <label>
                Client Phone Number:
                <input
                    type="tel"
                    name="clientPhoneNumber"
                    value={invoiceData.clientPhoneNumber}
                    onChange={handleChange}
                />
                </label><br/>
            </div>
            
            <div className='invoice-info'>
                <h3>Items</h3>
                {invoiceData.items.map((item, index) => (
                <div key={index} className='invoice-items'>
                    <input
                    type="text"
                    name="description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
                    />
                    <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    />
                    <input
                    type="number"
                    name="price"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, e)}
                    />
                    <button type="button" onClick={() => removeItem(index)}>
                    Remove
                    </button>
                </div>
                ))}<br/>
                <button type="button" onClick={addItem} className='btn btn-outline-primary'>
                Add Item
                </button><br/>
                <label>
                Total Amount Due:
                <input
                    type="number"
                    name="totalAmountDue"
                    value={invoiceData.totalAmountDue}
                    onChange={handleChange}
                />
                </label><br/>
                <label>
                Total Paid:
                <input
                    type="number"
                    name="totalPaid"
                    value={invoiceData.totalPaid}
                    onChange={handleChange}
                />
                </label><br/>
                <label>
                Terms and Conditions:
                <textarea
                    name="termsAndConditions"
                    value={invoiceData.termsAndConditions}
                    onChange={handleChange}
                />
                </label><br/>
                <label>
                Billed From:
                <input
                    type="text"
                    name="billedFrom"
                    value={invoiceData.billedFrom}
                    onChange={handleChange}
                />
                </label><br/>
            </div>
            
            <button onClick={generatePDF} className='btn btn-primary'>Save Invoice</button><br/>
        </form>
        </div>
    </div>
    
  );
};

export default Invoice;
