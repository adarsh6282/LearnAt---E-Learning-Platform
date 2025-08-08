import PDFDocument from "pdfkit";

export async function generateCertificate({
  name,
  course,
  date,
}: {
  name: string;
  course: string;
  date: Date;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      layout: "landscape",
      size: "A4",
    });

    const buffers: Buffer[] = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f3f3f3");

    doc.save();
    doc.lineWidth(6);
    doc.strokeColor("#333366");
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();
    doc.restore();

    doc
      .fontSize(40)
      .fillColor("#333366")
      .font("Times-Bold")
      .text("Certificate of Completion", {
        align: "center",
      });

    doc.moveDown(2);

    doc
      .fontSize(22)
      .fillColor("#444444")
      .font("Times-Roman")
      .text("This certificate is proudly presented to", {
        align: "center",
      });

    doc
      .fontSize(30)
      .fillColor("#000000")
      .font("Times-Bold")
      .text(name, {
        align: "center",
      });

    doc.moveDown(1);

    doc
      .fontSize(20)
      .fillColor("#444444")
      .font("Times-Roman")
      .text(`for successfully completing the course`, {
        align: "center",
      });

    doc
      .fontSize(24)
      .fillColor("#000000")
      .font("Times-Bold")
      .text(course, {
        align: "center",
      });

    doc.moveDown(2);

    doc
      .fontSize(18)
      .fillColor("#666666")
      .text(`Date: ${date.toDateString()}`, {
        align: "right",
        width: doc.page.width - 100,
      });
    doc.end();
  });
}
