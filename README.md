 
---

````markdown
## 📬 Contact Us API

**Endpoint:** `/api/contactus`  
**Method:** `POST`  
**Description:** Accepts contact form submissions, validates input, and sends the data to a Google Sheet via Google Apps Script.

---

### 📥 Request Body

Send a `JSON` payload:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "message": "I'd like to inquire about your services.",
  "category": "Support"
}
````

#### 🔹 Fields:

| Field      | Type   | Required | Description                                                |
| ---------- | ------ | -------- | ---------------------------------------------------------- |
| `name`     | string | ✅ Yes    | Minimum 2 characters.                                      |
| `email`    | string | ✅\*      | Must be valid if provided. Required if `phone` is missing. |
| `phone`    | string | ✅\*      | 7 to 15 digit number. Required if `email` is missing.      |
| `message`  | string | ✅ Yes    | Must be between 10 and 1000 characters.                    |
| `category` | string | ❌ No     | Optional. Defaults to `"General"` if not provided.         |

> **Note:** Either `email` or `phone` must be provided.

---

### ✅ Validation Rules

* `name` must be at least 2 characters
* `email` must follow valid format (if provided)
* `phone` must be 7–15 digits (if provided)
* `message` must be between 10 and 1000 characters

---

### 📤 Responses

#### ✅ Success (`200 OK`)

```json
{
  "success": true,
  "message": "📬 We’ve received your message. Our team will contact you within 1 business day."
}
```

#### ❌ Client Error (`400 Bad Request`)

```json
{
  "success": false,
  "message": "Message must be between 10 and 1000 characters."
}
```

#### ❌ Server Error (`500 Internal Server Error`)

```json
{
  "success": false,
  "message": "Server error. Please try again later."
}
```

---

### ⚙️ Configuration

Set your Google Apps Script Web App URL in `.env.local`:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
```

In the API code, reference it like this:

```js
fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, { ... })
```

---

### 🛡️ Tips

* Deploy your Google Apps Script as a **Web App** with access set to "Anyone".
* Use HTTPS when sending requests.
* Add rate limiting or CAPTCHA if exposing this API publicly.

 
