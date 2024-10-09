const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class ReceiptGenerator {
    static async generateOrderList(order, companyInfo) {
        return new Promise((resolve, reject) => {
            const width = 226.8; // 80mm in points
            const margin = 10;
            const contentWidth = width - 2 * margin;

            const doc = new PDFDocument({
                size: [width, 1000],
                margin: margin,
                autoFirstPage: false
            });

            const filename = `order-list-${order.id}.pdf`;
            const stream = fs.createWriteStream(filename);
            doc.pipe(stream);

            let y = margin;

            doc.addPage({ size: [width, 1000], margin: margin });

            // Order List title
            doc.fontSize(12).font('Helvetica-Bold');
            y = this.addTextRow(doc, '*Order List', y, margin, contentWidth, 'center');
            doc.moveTo(margin, y).lineTo(width - margin, y).stroke();
            y += 5;

            // Order details
            doc.fontSize(8).font('Helvetica');
            y = this.addTextRow(doc, `R. No.: ${order.id}`, y, margin, contentWidth);
            y = this.addTextRow(doc, `Date: ${new Date(order.updatedAt).toLocaleString()}`, y, margin, contentWidth);
            // y = this.addTextRow(doc, `Transaction by: ${order.transactionBy || 'Admin'}`, y, margin, contentWidth);
            // y = this.addTextRow(doc, `Table: ${order.tableId || 'N/A'}`, y, margin, contentWidth);
            y = this.addTextRow(doc, 'No Description', y, margin, contentWidth);
            y += 5;

            // Products
            doc.fontSize(8).font('Helvetica');
            order.products.forEach((item, index) => {
                const productY = y;
                y = this.addTextRow(doc, `${item.quantity} ${item.name}`, y, margin, contentWidth - 20); // Leave space for checkbox

                // Add variations if any
                if (item.variation && item.variation.length > 0) {
                    item.variation.forEach(v => {
                        doc.fontSize(7).font('Helvetica-Oblique');
                        y = this.addTextRow(doc, `  *${v.name}`, y, margin, contentWidth - 20);
                    });
                    doc.fontSize(8).font('Helvetica');
                }

                // Add checkbox
                this.drawCheckbox(doc, width - margin - 15, productY);

                y += 2; // Add a small space after each item
            });

            // Trim the page to the actual content height
            const pageHeight = y + margin;
            doc.page.size = [width, pageHeight];

            doc.end();

            stream.on('finish', () => {
                resolve(filename);
            });

            stream.on('error', (error) => {
                reject(error);
            });
        });
    }

    static drawCheckbox(doc, x, y) {
        doc.rect(x, y, 10, 10).stroke();
    }
    static async generateReceipt(order, companyInfo) {
        return new Promise((resolve, reject) => {
            const width = 226.8; // 80mm in points
            const margin = 10;
            const contentWidth = width - 2 * margin;

            const doc = new PDFDocument({
                size: [width, 1000], // Start with a long page, we'll trim it later
                margin: margin,
                autoFirstPage: false // We'll add the page manually
            });

            const filename = `receipt-${order.id}.pdf`;
            const stream = fs.createWriteStream(filename);
            doc.pipe(stream);

            let y = margin;
            let pageHeight = 0;

            // Add a new page
            doc.addPage({ size: [width, 1000], margin: margin });

            // Add company logo
            if (companyInfo.company_logo) {
                const logoPath = path.join(__dirname, '../..', 'public', companyInfo.company_logo);
                if (fs.existsSync(logoPath)) {
                    doc.image(logoPath, (width - 50) / 2, y, { width: 50 });
                    y += 60;
                }
            }

            // Company info
            doc.fontSize(10).font('Helvetica-Bold');
            y = this.addTextRow(doc, companyInfo.company_name || 'Company Name', y, margin, contentWidth, 'center');
            doc.fontSize(8).font('Helvetica');
            y = this.addTextRow(doc, companyInfo.address || '123 Main Street, City, Country', y, margin, contentWidth, 'center');
            y = this.addTextRow(doc, companyInfo.phone_number || 'Phone: (123) 456-7890', y, margin, contentWidth, 'center');
            y = this.addTextRow(doc, companyInfo.email || 'Email: info@company.com', y, margin, contentWidth, 'center');
            y = this.addTextRow(doc, companyInfo.website || 'www.company.com', y, margin, contentWidth, 'center');
            y += 10;

            // Receipt title
            doc.fontSize(12).font('Helvetica-Bold');
            y = this.addTextRow(doc, 'Receipt', y, margin, contentWidth, 'center');
            y += 5;

            // Order details
            doc.fontSize(8).font('Helvetica');
            y = this.addTextRow(doc, `Order ID: ${order.id}`, y, margin, contentWidth);
            y = this.addTextRow(doc, `Date: ${new Date().toLocaleString()}`, y, margin, contentWidth);
            y = this.addTextRow(doc, `Order Type: ${order.orderType}`, y, margin, contentWidth);
            y = this.addTextRow(doc, `Status: ${order.status}`, y, margin, contentWidth);
            y += 10;

            // Table header
            doc.fontSize(8).font('Helvetica-Bold');
            y = this.addTableRow(doc, ['Item', 'Qty', 'Price', 'Total'], y, margin, contentWidth, [0.5, 0.15, 0.175, 0.175]);
            doc.moveTo(margin, y).lineTo(width - margin, y).stroke();
            y += 5;

            // Table content
            doc.fontSize(8).font('Helvetica');
            order.products.forEach(item => {
                y = this.addTableRow(doc, [
                    item.name,
                    item.quantity.toString(),
                    `$${item.price.toFixed(2)}`,
                    `$${(item.quantity * item.price).toFixed(2)}`
                ], y, margin, contentWidth, [0.5, 0.15, 0.175, 0.175]);

                // Add variations if any
                if (item.variation && item.variation.length > 0) {
                    item.variation.forEach(v => {
                        doc.fontSize(7).font('Helvetica-Oblique');
                        y = this.addTableRow(doc, [
                            `  ${v.pName}: ${v.name}`,
                            '',
                            '',
                            ''
                        ], y, margin, contentWidth, [0.5, 0.15, 0.175, 0.175]);
                    });
                    doc.fontSize(8).font('Helvetica');
                    y += 2; // Add a small space after variations
                }
            });
            y += 5;

            // Totals
            doc.moveTo(margin, y).lineTo(width - margin, y).stroke();
            y += 5;
            doc.fontSize(8).font('Helvetica-Bold');
            y = this.addTextRow(doc, `Subtotal: $${order.subTotal.toFixed(2)}`, y, margin, contentWidth, 'right');
            y = this.addTextRow(doc, `Tax: $${order.tax.toFixed(2)}`, y, margin, contentWidth, 'right');
            y = this.addTextRow(doc, `Total: $${order.total.toFixed(2)}`, y, margin, contentWidth, 'right');
            y += 10;

            // Footer
            doc.fontSize(8).font('Helvetica');
            y = this.addTextRow(doc, companyInfo.receipt_footer_text || 'Thank you for your purchase!', y, margin, contentWidth, 'center');

            // Calculate the actual height needed
            pageHeight = y + margin;

            // Trim the page to the actual content height
            doc.page.size = [width, pageHeight];

            doc.end();

            stream.on('finish', () => {
                resolve(filename);
            });

            stream.on('error', (error) => {
                reject(error);
            });
        });
    }

    static addTextRow(doc, text, y, margin, width, align = 'left') {
        doc.text(text, margin, y, {
            width: width,
            align: align
        });
        return y + doc.heightOfString(text, { width: width }) + 2;
    }

    static addTableRow(doc, columns, y, margin, width, columnWidths) {
        let maxHeight = 0;
        columns.forEach((text, i) => {
            const colWidth = width * columnWidths[i];
            const textHeight = doc.heightOfString(text, { width: colWidth });
            maxHeight = Math.max(maxHeight, textHeight);

            doc.text(text, margin + width * columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
                width: colWidth,
                align: i === 0 ? 'left' : 'right'
            });
        });
        return y + maxHeight + 2;
    }
}

module.exports = ReceiptGenerator;