import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { formatDate } from "@/lib/utils";
import type { PaymentStatus } from "@prisma/client";

interface InvoiceEmailProps {
  purchase: {
    id: string;
    status: PaymentStatus;
    amount: number;
    date: Date;
    address: string | null;
    phone: string | null;
    zipCode: string | null;
    orderNumber: string | null;
    template: {
      name: string;
    } | null;
  };
  user: {
    name: string | null;
    email: string | null;
  };
}

export const InvoiceEmail = ({ purchase, user }: InvoiceEmailProps) => {
  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "SUCCESS":
        return "#16a34a"; // green-600
      case "PENDING":
        return "#ca8a04"; // yellow-600
      default:
        return "#dc2626"; // red-600
    }
  };

  return (
    <Html>
      <Head />
      <Preview>
        Your Invoice -{" "}
        {purchase.orderNumber || `Purchase #${purchase.id.substring(0, 8)}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo and Company Info */}
          <Section style={headerSection}>
            <Row>
              <Column style={{ width: "50%" }}>
                <Heading as="h3" style={invoiceTitle}>
                  INVOICE
                </Heading>
                <Text style={invoiceNumber}>
                  {purchase.orderNumber ||
                    `Purchase #${purchase.id.substring(0, 8)}`}
                </Text>
              </Column>
              <Column style={{ width: "50%", textAlign: "right" as const }}>
                <Text style={companyName}>Wabtech</Text>
                <Text style={companyDetail}>
                  Kololo, Kampala Uganda
                  <br />
                  wabtech.tech@gmail.com
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Billing and Invoice Details */}
          <Section style={infoSection}>
            <Row>
              <Column style={{ width: "50%" }}>
                <Text style={sectionTitle}>Bill To:</Text>
                <Text style={customerInfo}>
                  {user?.name || "Customer"}
                  <br />
                  {user?.email || "No email provided"}
                  <br />
                  {purchase.address || ""} {purchase.zipCode || ""}
                  <br />
                  {purchase.phone || ""}
                </Text>
              </Column>
              <Column style={{ width: "50%", textAlign: "right" as const }}>
                <Text style={sectionTitle}>Invoice Details:</Text>
                <Text style={customerInfo}>
                  Invoice Date: {formatDate(purchase.date)}
                  <br />
                  Due Date: {formatDate(purchase.date)}
                  <br />
                  Status:{" "}
                  <span style={{ color: getStatusColor(purchase.status) }}>
                    {purchase.status}
                  </span>
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Invoice Items Table */}
          <Section style={{ padding: "0" }}>
            {/* Table Headers */}
            <Row style={tableHeader}>
              <Column style={{ ...tableHeaderCell, width: "40%" }}>Item</Column>
              <Column
                style={{
                  ...tableHeaderCell,
                  width: "20%",
                  textAlign: "right" as const,
                }}
              >
                Price
              </Column>
              <Column
                style={{
                  ...tableHeaderCell,
                  width: "20%",
                  textAlign: "right" as const,
                }}
              >
                Quantity
              </Column>
              <Column
                style={{
                  ...tableHeaderCell,
                  width: "20%",
                  textAlign: "right" as const,
                }}
              >
                Total
              </Column>
            </Row>

            {/* Table Row */}
            <Row style={tableRow}>
              <Column style={{ ...tableCell, width: "40%" }}>
                <Text style={{ margin: 0, fontWeight: "500" }}>
                  {purchase.template?.name || "Unknown Product"}
                </Text>
                <Text
                  style={{
                    margin: "4px 0 0",
                    fontSize: "13px",
                    color: "#6b7280",
                  }}
                >
                  Template
                </Text>
              </Column>
              <Column
                style={{
                  ...tableCell,
                  width: "20%",
                  textAlign: "right" as const,
                }}
              >
                ${purchase.amount.toFixed(2)}
              </Column>
              <Column
                style={{
                  ...tableCell,
                  width: "20%",
                  textAlign: "right" as const,
                }}
              >
                1
              </Column>
              <Column
                style={{
                  ...tableCell,
                  width: "20%",
                  textAlign: "right" as const,
                }}
              >
                ${purchase.amount.toFixed(2)}
              </Column>
            </Row>
          </Section>

          {/* Totals Section */}
          <Section style={totalsSection}>
            <Row>
              <Column style={{ width: "60%" }}></Column>
              <Column style={{ width: "40%" }}>
                <Row>
                  <Column style={{ width: "50%", textAlign: "right" as const }}>
                    <Text style={totalLabel}>Subtotal</Text>
                  </Column>
                  <Column style={{ width: "50%", textAlign: "right" as const }}>
                    <Text style={totalValue}>
                      ${purchase.amount.toFixed(2)}
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Column style={{ width: "50%", textAlign: "right" as const }}>
                    <Text style={totalLabel}>Tax (0%)</Text>
                  </Column>
                  <Column style={{ width: "50%", textAlign: "right" as const }}>
                    <Text style={totalValue}>$0.00</Text>
                  </Column>
                </Row>
                <Row>
                  <Column style={{ width: "50%", textAlign: "right" as const }}>
                    <Text style={totalLabelBold}>Total</Text>
                  </Column>
                  <Column style={{ width: "50%", textAlign: "right" as const }}>
                    <Text style={totalValueBold}>
                      ${purchase.amount.toFixed(2)}
                    </Text>
                  </Column>
                </Row>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Thank You Message */}
          <Section style={thankyouSection}>
            <Text style={thankyouText}>Thank you for your purchase!</Text>
            <Text style={noteText}>
              If you have any questions about this invoice, please contact our
              support team at wabtech.tech@gmail.com.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This is a computer-generated document. No signature is required.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  maxWidth: "700px",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
};

const headerSection = {
  marginBottom: "24px",
};

const invoiceTitle = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
  color: "#1f2937",
};

const invoiceNumber = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "4px 0 0",
};

const companyName = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#4361ee",
  margin: "0",
};

const companyDetail = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "4px 0 0",
  lineHeight: "1.5",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const infoSection = {
  marginBottom: "24px",
};

const sectionTitle = {
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "500",
  marginBottom: "8px",
};

const customerInfo = {
  fontSize: "14px",
  color: "#1f2937",
  lineHeight: "1.5",
  margin: "0",
};

const tableHeader = {
  borderBottom: "1px solid #e5e7eb",
};

const tableHeaderCell = {
  padding: "12px 0",
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "500",
};

const tableRow = {
  borderBottom: "1px solid #e5e7eb",
};

const tableCell = {
  padding: "16px 0",
  fontSize: "14px",
  color: "#1f2937",
};

const totalsSection = {
  marginTop: "16px",
};

const totalLabel = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "8px 0",
  fontWeight: "500",
};

const totalValue = {
  fontSize: "14px",
  color: "#1f2937",
  margin: "8px 0",
};

const totalLabelBold = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1f2937",
  margin: "8px 0",
};

const totalValueBold = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1f2937",
  margin: "8px 0",
};

const thankyouSection = {
  marginTop: "24px",
  textAlign: "center" as const,
};

const thankyouText = {
  fontSize: "16px",
  color: "#1f2937",
  margin: "0 0 8px",
};

const noteText = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "8px 0",
};

const footer = {
  marginTop: "32px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#9ca3af",
};

export default InvoiceEmail;
