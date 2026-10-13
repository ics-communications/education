# MA-EL and MWS-E online applications: setup

The application form on `/mael-apply-new/` and `/mwse-apply-new/` (`js/application.js`,
styles in `css/application.css`) takes the application fee through PayPal, then
sends the application to a Google Apps Script (`education-applications.gs`). Both
pages carry the same form; each just preselects its own program.

> **Preview pages.** Until the Program Director approves them, the new pages live
> at `/mael-apply-new/` and `/mwse-apply-new/`, marked `noindex` and linked from
> nowhere; `/mael-apply/` and `/mwse-apply/` still carry the original inquiry form.
> To go live: copy each `-new/index.html` over the matching `-apply/index.html`,
> change its `robots` meta back to `index, follow`, point its canonical, `og:url`
> and JSON-LD URLs back to the `-apply/` address, and delete the `-new` folders. The script
checks every answer again, then for each applicant:

- creates a folder in Google Drive containing their uploaded documents (statement
  of purpose, writing sample, IELTS report) and a PDF of their answers,
- adds a row to the **ICS MA-EL and MWS-E Applications** Google Sheet,
- emails the application (PDF attached) to academic-registrar@ and evanderboom@,
- emails the applicant a confirmation listing what they still need to arrange
  (transcripts, references, any documents they chose to send separately).

The fee is **CAD $90**, with no late fee. The form shows the deadline for the
chosen start term, and says when it has passed, using these deadlines (from the
Admission page):

| Start | MA-EL deadline | MWS-E deadline |
|---|---|---|
| Winter (January) | November 1 | December 1 |
| Summer (April) | April 1 | April 1 |
| Fall (September) | April 1 | August 1 |

Until step 6 is done, the form shows a "write to the Registrar" notice and takes no
payments, so it's safe to publish the site before setup.

Setup takes about 15 minutes. Do every step signed in as
**ics-communications@icscanada.edu**.

---

## 1. Create the script

1. Go to <https://script.google.com> → **New project**.
2. Rename it (top left) to `Education applications`.
3. Delete everything in `Code.gs`, and paste in the whole of
   `_scripts/education-applications.gs`. Save (⌘S / Ctrl+S).
4. **Project Settings** (gear icon) → set **Time zone** to
   `(GMT-05:00) Eastern Time - Toronto`.

## 2. PayPal (nothing to do at launch)

The script already contains ICS's PayPal client ID, the same one ART in Orvieto
and the F2BF courses page use, so payments go to the same ICS PayPal account.

At launch, the script doesn't check payments with PayPal itself. Every
application is saved and marked **CHECK PAYMENT**, and the Registrar confirms the
fee by finding its PayPal order ID in PayPal. See
[Turning on automatic payment checks](#turning-on-automatic-payment-checks) below.
If ART in Orvieto or the MA & PhD form already has the secret, use the same one here.

## 3. Create the folder and sheet

1. In the editor, choose the function **`setup`** from the dropdown next to
   **Run**, and click **Run**.
2. Google asks for permission. Click **Review permissions**, choose
   ics-communications@, then **Allow**. If you see "Google hasn't verified this
   app", click **Advanced** → **Go to Education applications**. That's normal for
   your own scripts.
3. The log at the bottom should show three lines:
   - `Folder:` a link to **ICS MA-EL and MWS-E Applications** in your Drive
   - `Sheet:` a link to the Sheet, which sits inside that folder
   - `PayPal: not checked automatically …`, which is expected at launch

`setup` shares the folder (and so the Sheet and every applicant folder inside it)
with academic-registrar@ and evanderboom@ as editors. Running `setup` again is harmless.

## 4. Publish the script as a web app

1. **Deploy** → **New deployment** → gear icon → **Web app**.
2. Description: `Application form`.
   **Execute as:** `Me (ics-communications@icscanada.edu)`.
   **Who has access:** `Anyone`.
3. **Deploy**, and copy the **Web app URL**. It ends in `/exec`.

## 5. Check it

Open the Web app URL in a browser. You should see:

```
{"ok":true,"service":"ICS education applications","storage":true,"paypal":"not checked automatically"}
```

## 6. Connect the website

In `js/application.js`, near the top, paste the URL between the quotes:

```js
SCRIPT_URL: 'https://script.google.com/macros/s/…/exec',
```

Commit and push. The PayPal buttons now appear at the end of the form on both
apply pages.

## 7. Test once with a real payment

1. Fill in the form on the live site with a PDF attached, and pay the $90.
2. Check that:
   - a folder appeared in **ICS MA-EL and MWS-E Applications** with the PDF of answers and the upload,
   - a row was added to the Sheet,
   - the staff email arrived with the PDF attached,
   - the confirmation email reached the test address.
3. Refund the test payment in PayPal: **Activity** → the payment → **Issue a refund**.
4. Delete the test row and folder.

---

## Day to day

- **New applications** arrive by email, and as a row and a folder in Drive.
- **Columns added later** (such as **Date of birth** and **School**) appear at
  the right-hand end of a Sheet that existed before they were added. Rows
  already in the Sheet keep their columns.
- **Documents sent separately**: the Sheet says "Will be sent separately"; the
  applicant has been asked to email it quoting their reference.
- **Payment status** column:
  - `CHECK PAYMENT`: every application shows this until automatic checks are on.
    Search PayPal (**Activity**) for the **PayPal order ID** in the row and confirm
    the fee in the **Fee** column (CAD $90).
  - `Paid`: confirmed by PayPal automatically. Requires the secret.
  - `Payment pending`: PayPal hasn't cleared it yet, usually a bank-funded payment.
- **If an application fails to save**, the script emails ics-communications@ with
  the details. The applicant is told their payment is safe and can press
  **Send application** to try again without paying twice.

## Turning on automatic payment checks

When someone with the ICS PayPal business login is available:

1. Go to <https://developer.paypal.com/dashboard/applications>, log in, and switch to **Live**.
2. Open the app whose Client ID starts with `AdZ0cWK3Bl7…`, and under **Secret key**
   click **Show** and copy it. Use the existing secret. Don't delete it or generate a
   new one, since F2BF, ART in Orvieto and the MA & PhD form may depend on it.
3. In Apps Script: **Project Settings** → **Script properties** → **Add script
   property**: `PAYPAL_SECRET` = the secret. Save.
4. Open the Web app URL. `"paypal"` should now read `"checked automatically"`.

## Changing the script later

Paste the new code, save, then **Deploy** → **Manage deployments** → pencil icon →
**Version: New version** → **Deploy**. This keeps the same URL. Don't create a new
deployment, which would get a new URL.

## Changing fees, deadlines or staff

Change these together:

| What | `js/application.js` | `education-applications.gs` |
|---|---|---|
| Fee | `FEE` | `FEE` |
| Deadlines or start terms | `PROGRAMS` (`winter: [11, 1, 1]` = November 1 of the year before the start) | `PROGRAMS` (same) |
| Referees required | `PROGRAMS` (`referees`) | `PROGRAMS` (same) |
| Concentrations | the radio buttons in both apply pages | `CONCENTRATIONS` |
| Staff who get applications | | `STAFF` (then run `setup` to share the folder) |

The form markup is in both `mael-apply-new/index.html` and `mwse-apply-new/index.html`
(the "ONLINE APPLICATION" section). Keep the two identical apart from
`data-program`. Deadlines shown elsewhere on the site (the deadline cards, the
Admission page and the FAQs) are separate text; update them too.

## Keeping it safe

- Turn on 2-step verification for ics-communications@ and the ICS PayPal account.
- Keep editors of the script itself to one or two people. Once the secret is
  added, anyone who can edit the script can see it. Staff only need access to the
  folder, which `setup` gives them.
- The form accepts PDF, Word (DOC, DOCX), ODT and RTF files, 10 MB each, and
  images (JPG, PNG) for the IELTS report only.
