import { test, expect } from "@playwright/test";
import fs from "fs";

const path = "data/customer-orders-chapter-3-masked.json";
const dataset = JSON.parse(fs.readFileSync(path, "utf-8"));

const allowedStatuses = [
  "Shipped",
  "Pending",
  "Delivered",
  "Cancelled",
  "Returned",
  "Payment Error",
  "On Hold",
  "Delayed"
];

const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const phonePattern = /^\+44-\d{4}-\d{3}-\d{3}$/;

for (const record of dataset) {

  test(`Order ${record.orderId} — isValid=${record.isValid}`, async ({ request }) => {

    //  Round-trip POST
    const result = await request.post("https://postman-echo.com/post", {
      data: record,
      headers: { "Content-Type": "application/json" }
    });

    expect(result.ok()).toBeTruthy();

    const body = await result.json();
    expect(body.json).toEqual(record);

    //  Base schema
    expect(typeof record.orderId).toBe("number");
    expect(typeof record.customerName).toBe("string");
    expect(typeof record.email).toBe("string");
    expect(typeof record.phoneNumber).toBe("string");
    expect(typeof record.status).toBe("string");
    expect(typeof record.totalAmount).toBe("number");
    expect(Array.isArray(record.items)).toBeTruthy();

    //  VALID RECORDS

    if (record.isValid) {

      expect(record.email).toMatch(emailPattern);
      expect(record.phoneNumber).toMatch(phonePattern);
      expect(allowedStatuses).toContain(record.status);

      expect(record.items.length).toBeGreaterThan(0);

      for (const it of record.items) {
        expect(typeof it.name).toBe("string");
        expect(it.name.length).toBeGreaterThan(0);

        expect(typeof it.quantity).toBe("number");
        expect(it.quantity).toBeGreaterThan(0);

        expect(typeof it.price).toBe("number");
        expect(it.price).toBeGreaterThan(0);
      }

      const expectedTotal = Number(
        record.items.reduce((s, it) => s + it.quantity * it.price, 0).toFixed(2)
      );

      expect(Number(record.totalAmount.toFixed(2))).toBe(expectedTotal);
    }
 
    // INVALID RECORDS

    else {
      let fails = 0;

      if (!emailPattern.test(record.email)) fails++;
      if (!phonePattern.test(record.phoneNumber)) fails++;
      if (!allowedStatuses.includes(record.status)) fails++;
      if (!Array.isArray(record.items) || record.items.length === 0) fails++;

      for (const it of record.items ?? []) {
        if (typeof it.quantity !== "number" || it.quantity <= 0) fails++;
        if (typeof it.price !== "number" || it.price <= 0) fails++;
      }

      const expectedTotal = Number(
        (record.items ?? []).reduce((s, it) => s + it.quantity * it.price, 0).toFixed(2)
      );

      const actualTotal = Number(record.totalAmount.toFixed(2));

      if (expectedTotal !== actualTotal) fails++;

      expect(fails).toBeGreaterThan(0);
    }
  });
}
