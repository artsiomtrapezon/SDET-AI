# Test Project

This is a Playwright-based test automation project for testing a web application.

## Project Structure

- `tests/` - Contains test files (homepage.spec.js, contact.spec.js)
- `pages/` - Page object models (HomePage.js, ContactPage.js)
- `data/` - Test data files (customer-orders-chapter-1.json)
- `playwright.config.js` - Playwright configuration
- `fixtures.js` - Test fixtures

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

Run all tests:
```bash
npx playwright test
```

Run tests in headed mode (visible browser):
```bash
npx playwright test --headed
```

Run specific test file:
```bash
npx playwright test tests/homepage.spec.js
```

## Generating Reports

Generate and view HTML report:
```bash
npx playwright show-report
```

## Configuration

Test configuration can be found in `playwright.config.js`. This includes browser settings, timeouts, and other test options.

## Chapter 1 – Customer Order Dataset
Prompt used: "Generate 15 customer orders with fields: orderId, customerName, status (Pending, Shipped, Cancelled), and totalAmount. Return as JSON array."

**Observations:**
- Names slightly unrealistic for production-like datasets (unless intentionally mixed).
- Status is not correlated with amount.

## Chapter 2 – Data Variety and Extended Schema
Prompt used: Generate at least 30 customer orders including realistic scenarios and edge cases.

Each order should include the following fields:

- orderId: integer in range 000001–999999 (ensure uniqueness where possible)
- customerName: Firstname Lastname (diverse cultural names transliterated into English, no special characters)
- email: valid email format derived from customerName (e.g., firstname.lastname@example.com)
- phoneNumber: valid UK phone number in international format as a string (pattern: +44-XXXX-XXX-XXX or similar realistic variation)

- items: an array (1 to 10 items) of objects with:
  - name: short, realistic product name
  - quantity: integer (include edge cases like 0 and negative values in a few records)
  - price: number (include normal, very large, zero, and negative values for testing)

- status: expanded set including:
  Pending, Shipped, Cancelled, Returned, Payment Error, On Hold, Delayed

- totalAmount:
  - must equal the sum of (quantity × price) for valid records
  - include boundary cases:
    - 0 total
    - very large totals
    - negative totals (for testing invalid scenarios)

Additional requirements:
- Include a small subset of intentionally invalid entries:
  - missing required fields (e.g., no email or no items)
  - incorrect data types (e.g., string instead of number)
  - malformed email or phoneNumber
- Ensure most records are valid, but at least 10–20% contain errors for testing purposes
- Populate all contact and item fields with realistic, varied values
- Keep data diverse and representative of real-world usage

Return the result as a JSON array.

**Observations:**

- Most orders are valid with realistic data and consistent structure.
- ~25% of records include intentional errors for testing (slightly above target range).
- Common issues: incorrect totals, invalid quantities (0/negative), and malformed contact details.
- Some records contain missing fields (empty email, no items).
- Edge cases are well covered (zero, negative, and very large totals).
- Dataset remains mostly schema-consistent, with errors clearly identifiable for validation testing.

## Chapter 3 – Data Masking and Validation

Prompt used: 
Mask sensitive personal data (PII) in the provided JSON array of customer orders while preserving structure and usability.

Apply the following anonymization rules:

- customerName:
  - Replace with synthetic but realistic names.
  - Keep format "Firstname Lastname".
  - If the original value is empty or malformed, replace it with a similarly malformed synthetic value (preserve structure/issue).

- email:
  - Replace with randomly generated emails using the domain "@test.oh.com".
  - Use varied formats (e.g., firstname.lastname@test.oh.com, f.lastname@test.oh.com, random strings).
  - Ensure all emails are valid in format when original is valid.
  - If the original email is empty or malformed, replace it with a synthetic value that keeps the same issue (e.g., empty stays empty, invalid format remains invalid but anonymized).

- phoneNumber:
  - Preserve the "+44" country code and general format.
  - Replace remaining digits with zeros or randomized digits while keeping a valid UK pattern (e.g., +44-7000-000-000) when original is valid.
  - If the original phone number is incorrect or incomplete, replace it with a synthetic number that preserves the same incorrect format.

- orderId:
  - Keep unchanged.

- items:
  - Keep unchanged (including names, quantity, and price).

- status:
  - Keep unchanged.

- totalAmount:
  - Keep unchanged.

Additional requirements:
- Maintain the exact JSON schema and structure.
- Do not remove or add fields.
- Preserve data types (string, number, array, etc.).
- Keep intentional invalid or edge-case records unchanged except for masked PII.
- Ensure that formatting issues (empty, malformed, partial values) are preserved but anonymized.
- Ensure the output cannot be used to identify any real individual.

Return the fully anonymized dataset as a JSON array.

**Checks performed**
Prompt used: 
Validate key fields in the provided JSON array of customer orders to ensure schema consistency and data integrity.

Apply the following validation rules:

- orderId:
  - Must be an integer.
  - Should be within the range 000001–999999.
  - Should be unique across records (if applicable).

- customerName:
  - Must be a string.
  - Should follow "Firstname Lastname" format.

- email:
  - Must be a string.
  - Should follow a valid email format (e.g., contains "@" and domain).

- phoneNumber:
  - Must be a string.
  - Should follow a consistent UK format (e.g., +44-XXXX-XXX-XXX or similar pattern).

- totalAmount:
  - Must be numeric (integer or float).
  - Should match the sum of (quantity × price) for all items.
  - Should allow edge cases (0 or negative) but flag them if inconsistent.

- status:
  - Must be a string.
  - Must belong to the allowed set:
    [Pending, Shipped, Cancelled, Returned, Payment Error, On Hold, Delayed].

- items:
  - Must be an array.
  - Should contain between 1 and 10 items (flag if outside range).
  - Each item must include:
    - name: string
    - quantity: number (integer; allow edge cases like 0 or negative but flag them)
    - price: number (allow zero or negative for testing but flag them)

Additional requirements:
- Do not modify the original data.
- Identify and report any violations per record.
- Preserve structure while validating nested fields.
- Clearly indicate which records and fields fail validation and why.

Return the validation result as a structured report (e.g., JSON or bullet list).

## Chapter 4 –Integrating AI-Generated Data into Validation Workflows
All 40 test cases passed successfully.
This confirms that the implemented validation rules and the isValid flags in the dataset are fully aligned.

**Round‑Trip API Checks**

Every record was sent to the echo endpoint and returned unchanged.
No discrepancies were found between sent and received JSON payloads.

**Schema Validation Results**

All required fields (orderId, customerName, email, phoneNumber, status, totalAmount, items, isValid) were present in every entry.
All type checks passed (numbers, strings, arrays).

**Valid Records (isValid=true)**

All valid records satisfied:

correct email format
correct phone format
allowed status value
non‑empty items array
positive quantities and prices
accurate totalAmount matching the sum of items


No unexpected validation failures occurred.

**Invalid Records (isValid=false)**

Each invalid record contained at least one intentional violation, such as:

malformed email
malformed phone number
empty items list
zero or negative quantity
zero or negative price
mismatched totalAmount


No invalid record accidentally passed all validation checks.

**Overall Outcome**

0 unexpected failures
0 unexpected passes
Dataset integrity fully confirmed
Validation logic behaves exactly as intended

## Chapter 5 – AI Data Quality Report
Total records tested: 40
Passed: 40
Failed: 0
Pass rate: 100%
✅ Key Points

All round‑trip API checks returned identical payloads.
All isValid=true records met schema, format, and calculation rules.
All isValid=false records contained expected violations (email, phone, quantity, price, or totals).
No unexpected passes or failures.

✅ Conclusion
The dataset cleanly matches the validation rules.
Both valid and invalid rows behave exactly as intended, confirming strong data quality and consistent rule alignment.