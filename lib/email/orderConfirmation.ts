export type OrderConfirmationEmailItem = {
  name: string;
  quantity: number;
  unit_price: number;
};

export type OrderConfirmationEmailPayload = {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  paymentMethod: string;
  shipName: string;
  shipPhone: string;
  shipAddress: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: string;
  orderUrl: string;
  items: OrderConfirmationEmailItem[];
};

const ORDER_CONFIRMATION_TEMPLATE = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="ar" dir="rtl">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>تأكيد الدفع - El Azaz</title>
    <style type="text/css" rel="stylesheet" media="all">
      @import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap");

      body {
        width: 100% !important;
        height: 100%;
        margin: 0;
        background-color: #f8f8f8;
        -webkit-text-size-adjust: none;
      }

      body,
      td,
      th,
      p,
      a,
      h1 {
        font-family: "Cairo", Tahoma, Arial, sans-serif;
      }

      table {
        border-collapse: collapse;
      }

      a {
        color: #b47720;
      }

      .email-wrapper {
        width: 100%;
        margin: 0;
        padding: 24px 0;
        background-color: #f8f8f8;
      }

      .email-content {
        width: 100%;
      }

      .email-masthead {
        text-align: center;
        padding: 10px 0 18px;
      }

      .brand {
        display: inline-block;
        font-size: 24px;
        font-weight: 700;
        color: #1d1f1f;
        text-decoration: none;
        letter-spacing: 2px;
      }

      .brand-subtitle {
        margin: 8px 0 0;
        font-size: 13px;
        color: #666666;
      }

      .email-body_inner {
        width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border: 1px solid #eeeeee;
      }

      .brand-strip {
        height: 6px;
        line-height: 6px;
        font-size: 6px;
        background-color: #b47720;
      }

      .content-cell {
        padding: 28px 24px;
        text-align: right;
      }

      h1 {
        margin: 0 0 14px;
        color: #1d1f1f;
        font-size: 24px;
        line-height: 1.4;
      }

      p {
        margin: 0 0 14px;
        color: #444444;
        font-size: 16px;
        line-height: 1.8;
      }

      .section-title {
        margin: 20px 0 10px;
        color: #1d1f1f;
        font-size: 15px;
        font-weight: 700;
        line-height: 1.5;
      }

      .info-table,
      .items-table,
      .summary-table {
        width: 100%;
        margin: 0 0 16px;
        border: 1px solid #eeeeee;
      }

      .info-table td {
        padding: 10px 12px;
        font-size: 14px;
        line-height: 1.7;
        border-bottom: 1px solid #eeeeee;
        vertical-align: top;
      }

      .info-table tr:last-child td {
        border-bottom: 0;
      }

      .label-cell {
        width: 34%;
        color: #666666;
        font-weight: 600;
        background-color: #fbfbfb;
      }

      .value-cell {
        color: #1d1f1f;
      }

      .items-table th,
      .items-table td {
        padding: 10px 8px;
        font-size: 14px;
        line-height: 1.6;
        border-bottom: 1px solid #eeeeee;
      }

      .items-table th {
        color: #555555;
        background-color: #fbfbfb;
        font-weight: 700;
      }

      .items-table tr:last-child td {
        border-bottom: 0;
      }

      .item-name {
        text-align: right;
        color: #1d1f1f;
      }

      .item-qty {
        width: 70px;
        text-align: center;
        color: #444444;
      }

      .item-money {
        width: 140px;
        text-align: left;
        direction: ltr;
        color: #444444;
        white-space: nowrap;
      }

      .summary-table td {
        padding: 10px 12px;
        font-size: 14px;
        line-height: 1.6;
        border-bottom: 1px solid #eeeeee;
      }

      .summary-table tr:last-child td {
        border-bottom: 0;
      }

      .summary-label {
        color: #666666;
        font-weight: 600;
      }

      .summary-value {
        text-align: left;
        direction: ltr;
        color: #1d1f1f;
        white-space: nowrap;
      }

      .summary-total .summary-label,
      .summary-total .summary-value {
        font-weight: 700;
        color: #1d1f1f;
      }

      .body-action {
        width: 100%;
        margin: 26px 0;
        text-align: center;
      }

      .button {
        display: inline-block;
        background-color: #b47720;
        border: 12px solid #b47720;
        color: #ffffff !important;
        font-size: 16px;
        font-weight: 700;
        line-height: 1;
        text-decoration: none !important;
        min-width: 180px;
        text-align: center;
      }

      .button:hover,
      .button:active,
      .button:visited,
      .button:focus {
        color: #ffffff !important;
        text-decoration: none !important;
      }

      .fallback-text {
        margin-top: 24px;
        padding-top: 18px;
        border-top: 1px solid #eeeeee;
      }

      .fallback-text p {
        margin: 0 0 8px;
        color: #777777;
        font-size: 12px;
        line-height: 1.6;
      }

      .fallback-link {
        color: #666666 !important;
        text-decoration: underline !important;
        word-break: break-all;
      }

      .email-footer {
        width: 600px;
        margin: 0 auto;
        text-align: center;
      }

      .footer-cell {
        padding: 16px 8px 0;
      }

      .footer-text {
        margin: 0 0 4px;
        color: #8a8a8a;
        font-size: 12px;
        line-height: 1.6;
      }

      .footer-link {
        color: #8a8a8a !important;
        text-decoration: underline;
      }

      @media only screen and (max-width: 640px) {
        .email-body_inner,
        .email-footer {
          width: 100% !important;
        }

        .content-cell {
          padding: 24px 16px;
        }

        .label-cell {
          width: 38%;
        }

        .items-table th,
        .items-table td {
          font-size: 13px;
          padding: 9px 6px;
        }

        .item-qty {
          width: 58px;
        }

        .item-money {
          width: 110px;
        }
      }

      @media (prefers-color-scheme: dark) {
        body,
        .email-wrapper {
          background-color: #111111 !important;
        }

        .email-body_inner {
          background-color: #1b1b1b !important;
          border-color: #2b2b2b !important;
        }

        .brand {
          color: #ffffff !important;
        }

        .brand-subtitle,
        p {
          color: #d0d0d0 !important;
        }

        h1 {
          color: #ffffff !important;
        }

        .section-title {
          color: #ffffff !important;
        }

        .info-table,
        .items-table,
        .summary-table {
          border-color: #2b2b2b !important;
        }

        .info-table td,
        .items-table th,
        .items-table td,
        .summary-table td {
          border-bottom-color: #2b2b2b !important;
        }

        .label-cell,
        .items-table th {
          background-color: #212121 !important;
          color: #cfcfcf !important;
        }

        .value-cell,
        .item-name,
        .item-qty,
        .item-money,
        .summary-value {
          color: #e6e6e6 !important;
        }

        .summary-label {
          color: #cfcfcf !important;
        }

        .summary-total .summary-label,
        .summary-total .summary-value {
          color: #ffffff !important;
        }

        .fallback-text {
          border-top-color: #2b2b2b !important;
        }

        .fallback-text p,
        .fallback-link,
        .footer-text,
        .footer-link {
          color: #a8a8a8 !important;
        }
      }
    </style>
  </head>
  <body>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td class="email-masthead">
                <a href="https://elazaz.site" class="brand">ELAZAZ</a>
                <p class="brand-subtitle">متجر الحقائب والأحذية</p>
              </td>
            </tr>
            <tr>
              <td>
                <table class="email-body_inner" align="center" width="600" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="brand-strip">&nbsp;</td>
                  </tr>
                  <tr>
                    <td class="content-cell">
                      <h1>مرحباً {{CUSTOMER_NAME}}</h1>
                      <p>تم تأكيد الدفع لطلبك بنجاح. فيما يلي تفاصيل الطلب والشحن الخاصة بك.</p>

                      <p class="section-title">تفاصيل الطلب</p>
                      <table class="info-table" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td class="label-cell">رقم الطلب</td>
                          <td class="value-cell">{{ORDER_NUMBER}}</td>
                        </tr>
                        <tr>
                          <td class="label-cell">تاريخ الطلب</td>
                          <td class="value-cell">{{ORDER_DATE}}</td>
                        </tr>
                        <tr>
                          <td class="label-cell">طريقة الدفع</td>
                          <td class="value-cell">{{PAYMENT_METHOD}}</td>
                        </tr>
                      </table>

                      <p class="section-title">بيانات الشحن</p>
                      <table class="info-table" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td class="label-cell">الاسم</td>
                          <td class="value-cell">{{SHIP_NAME}}</td>
                        </tr>
                        <tr>
                          <td class="label-cell">الهاتف</td>
                          <td class="value-cell">{{SHIP_PHONE}}</td>
                        </tr>
                        <tr>
                          <td class="label-cell">العنوان</td>
                          <td class="value-cell">{{SHIP_ADDRESS_HTML}}</td>
                        </tr>
                      </table>

                      <p class="section-title">المنتجات</p>
                      <table class="items-table" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <th align="right">المنتج</th>
                          <th align="center">الكمية</th>
                          <th align="left">سعر الوحدة</th>
                          <th align="left">الإجمالي</th>
                        </tr>
                        {{ITEM_ROWS}}
                      </table>

                      <p class="section-title">ملخص الدفع</p>
                      <table class="summary-table" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td class="summary-label">المجموع الفرعي</td>
                          <td class="summary-value">{{SUBTOTAL}}</td>
                        </tr>
                        <tr>
                          <td class="summary-label">الخصم</td>
                          <td class="summary-value">{{DISCOUNT}}</td>
                        </tr>
                        <tr>
                          <td class="summary-label">الشحن</td>
                          <td class="summary-value">{{SHIPPING}}</td>
                        </tr>
                        <tr class="summary-total">
                          <td class="summary-label">الإجمالي الكلي</td>
                          <td class="summary-value">{{TOTAL}}</td>
                        </tr>
                      </table>

                      <table class="body-action" border="0" cellspacing="0" cellpadding="0" role="presentation">
                        <tr>
                          <td align="center">
                            <a href="{{ORDER_URL}}" target="_blank" rel="noopener noreferrer" class="button">عرض الطلب</a>
                          </td>
                        </tr>
                      </table>

                      <p>إذا كان لديك أي استفسار بخصوص الطلب، تواصل معنا عبر <a href="mailto:elazazeg@gmail.com">elazazeg@gmail.com</a>.</p>

                      <div class="fallback-text">
                        <p>إذا لم يعمل الزر، انسخ الرابط التالي والصقه في المتصفح:</p>
                        <p><a href="{{ORDER_URL}}" class="fallback-link">{{ORDER_URL}}</a></p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table class="email-footer" align="center" width="600" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="footer-cell" align="center">
                      <p class="footer-text">© 2026 ELAZAZ. جميع الحقوق محفوظة.</p>
                      <p class="footer-text"><a class="footer-link" href="https://elazaz.site">elazaz.site</a> | <a class="footer-link" href="tel:+201027043700">+201027043700</a></p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const escapeHtmlWithBreaks = (value: string): string =>
  escapeHtml(value).replace(/\r?\n/g, "<br />");

const replacePlaceholders = (
  template: string,
  values: Readonly<Record<string, string>>,
): string =>
  template.replace(/{{([A-Z0-9_]+)}}/g, (match, key: string) => values[key] ?? match);

const formatQuantity = (quantity: number): string => {
  if (Number.isInteger(quantity)) return String(quantity);
  return quantity.toFixed(2);
};

export const money = (amount: number, currency: string): string => {
  const numericAmount = Number.isFinite(amount) ? amount : 0;
  const normalizedCurrency = currency.trim().toUpperCase();

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: normalizedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${numericAmount.toFixed(2)} ${normalizedCurrency || "CUR"}`;
  }
};

export const buildItemsRows = (
  items: OrderConfirmationEmailItem[],
  currency: string,
): string => {
  if (items.length === 0) {
    return `<tr><td class="item-name" colspan="4">لا توجد منتجات في هذا الطلب.</td></tr>`;
  }

  return items
    .map((item) => {
      const lineTotal = item.quantity * item.unit_price;
      return `
                        <tr>
                          <td class="item-name">${escapeHtml(item.name)}</td>
                          <td class="item-qty">${escapeHtml(formatQuantity(item.quantity))}</td>
                          <td class="item-money">${escapeHtml(money(item.unit_price, currency))}</td>
                          <td class="item-money">${escapeHtml(money(lineTotal, currency))}</td>
                        </tr>`;
    })
    .join("");
};

export function buildOrderConfirmationEmailHTML(
  payload: OrderConfirmationEmailPayload,
): string {
  const currency = payload.currency.trim().toUpperCase();
  const itemsRows = buildItemsRows(payload.items, currency);
  const orderUrl = payload.orderUrl.trim();

  return replacePlaceholders(ORDER_CONFIRMATION_TEMPLATE, {
    CUSTOMER_NAME: escapeHtml(payload.customerName.trim() || "عميلنا العزيز"),
    ORDER_NUMBER: escapeHtml(payload.orderNumber.trim()),
    ORDER_DATE: escapeHtml(payload.orderDate.trim()),
    PAYMENT_METHOD: escapeHtml(payload.paymentMethod.trim()),
    SHIP_NAME: escapeHtml(payload.shipName.trim()),
    SHIP_PHONE: escapeHtml(payload.shipPhone.trim()),
    SHIP_ADDRESS_HTML: escapeHtmlWithBreaks(payload.shipAddress.trim()),
    ITEM_ROWS: itemsRows,
    SUBTOTAL: escapeHtml(money(payload.subtotal, currency)),
    DISCOUNT: escapeHtml(`- ${money(payload.discount, currency)}`),
    SHIPPING: escapeHtml(money(payload.shipping, currency)),
    TOTAL: escapeHtml(money(payload.total, currency)),
    ORDER_URL: escapeHtml(orderUrl),
  });
}
