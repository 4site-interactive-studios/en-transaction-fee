import crumbs from "./crumbs";
export class TransactionFee {
  constructor(options) {
    this.options = {
      enOnSubmit: true, // Use enOnSubmit? If False, you have to call addFees() by hand in your script
      class: "foursite-transaction-fee",
      fixed: 0.2,
      percent: 3,
      label:
        "I&#39;d like to cover all transaction fees (${fixed} + {percent}%) so that 100% of my donation goes to you!",
      position: "", // A query selector for the sibling element you want to add the transaction fee
    };
    this.options = Object.assign(this.options, options);
    if (!this.shouldRun()) {
      // If we're not on a Donation Page, get out
      return false;
    }
    let label = this.options.label
      .replace("{fixed}", this.options.fixed)
      .replace("{percent}", this.options.percent);
    const markup = `
    <!-- Custom Checkbox using the same markup as Engaging Networks -->
    <div class="${this.options.class} en__field en__field--checkbox en__field--000000 en__field--transaction_fee pseudo-en-field">
        <div class="en__field__element en__field__element--checkbox">
            <div class="en__field__item">
                <input class="en__field__input en__field__input--checkbox" data-transaction-fee-fixed-amount-added="${this.options.fixed}" data-transaction-fee-percent-added="${this.options.percent}" id="en__field_supporter_transaction_fee" name="supporter.transaction_fee" type="checkbox" value="Y" />
                <label class="en__field__label en__field__label--item" for="en__field_supporter_transaction_fee">
                    ${label}
                </label>
            </div>
        </div>
    </div>
    `;

    let component = document.createElement("div");
    component.id = "foursite-transaction-fee";
    component.classList.add("en__component");
    component.classList.add("en__component--transaction-fee");
    component.innerHTML = markup;
    const checkbox = component.querySelector(
      "#en__field_supporter_transaction_fee"
    );
    checkbox.addEventListener("click", this.check.bind(this));

    this.component = component;

    this.createField();

    // Load Values From Cookies
    window.setTimeout(this.loadCookies.bind(this), 500);

    // Use enOnSubmit
    if (this.options.enOnSubmit) {
      window.enOnSubmit = function() {
        this.addFees();
        return true; // return false to prevent submit
      };
    }
  }
  // Should we run the script?
  shouldRun() {
    // if the "Other Donation" amount field is not present on the page our code will do nothing as it can not run
    return !!document.querySelector(".en__field__input--other");
  }

  createField() {
    // Add new field
    if (!!this.options.position) {
      let field_base = document.querySelector(this.options.position);
      if (!field_base) {
        return false;
      }
      field_base.parentNode.insertBefore(
        this.component,
        field_base.nextSibling
      );
    } else {
      let field_base = document
        .querySelector(".en__submit")
        .closest(".en__component");
      field_base.parentNode.insertBefore(this.component, field_base);
    }
  }

  // Check / Uncheck the Transaction Fee Checkbox

  check(e) {
    // let checkbox = e.target;
    this.createCookies();
  }

  // Return the current page ID

  getPageID() {
    if (!window.pageJson) return 0;
    return window.pageJson.campaignPageId;
  }

  // Return the Donation Frequency

  getFrequency() {
    let frequency = document.querySelector(
      "[name='transaction.recurrpay']:checked"
    );
    return frequency.value == "Y" ? "monthly" : "single";
  }

  // Set the Donation Frequency

  setFrequency(freq = "single") {
    let freqValue = freq == "single" ? "N" : "Y";
    let frequency = document.querySelector(
      "[name='transaction.recurrpay'][value='" + freqValue + "']"
    );
    return (frequency.checked = true);
  }

  // Return the Donation Amount

  getAmount() {
    let amount = document.querySelector(
      "[name='transaction.donationAmt']:checked"
    );
    if (amount.value == "Other" || amount.value == "") {
      let otherAmount = parseFloat(
        document.querySelector('input[name="transaction.donationAmt.other"]')
          .value
      );
      return isNaN(otherAmount) ? 0 : otherAmount;
    }
    return parseFloat(amount.value);
  }

  // Set the Donation Amount
  setAmount(amount) {
    let amounts = document.getElementsByName("transaction.donationAmt");
    let found = false;
    amounts.forEach((element) => {
      if (element.value == amount) {
        element.click();
        element.checked = true;
        found = true;
        return;
      }
    });
    if (!found) {
      let otherAmount = document.querySelector(
        "[name='transaction.donationAmt'][value='Other' i], [name='transaction.donationAmt'][value='']"
      );
      // Set Other
      otherAmount.click();
      otherAmount.checked = true;
      // Set Amount
      document.querySelector(
        '[name="transaction.donationAmt.other"]'
      ).value = parseFloat(amount).toFixed(2);
    }
    return true;
  }
  // Return the Transaction Fee Checkbox State (checked / unchecked)
  getFee() {
    return !!document.getElementById("en__field_supporter_transaction_fee")
      .checked;
  }
  // Set the Transaction Fee Checkbox State (checked / unchecked)
  setFee(state) {
    document.getElementById(
      "en__field_supporter_transaction_fee"
    ).checked = !!state;
  }
  // Calculate the Fees and Set the Amount
  addFees() {
    if (!this.getFee()) return;
    const amount = this.getAmount();
    const transaction_fee =
      (parseFloat(this.options.percent) / 100) * amount +
      parseFloat(this.options.fixed);
    // Update Cookies Before Changing Amount
    this.createCookies();
    return this.setAmount(amount + transaction_fee);
  }

  // Create Cookies with Frequency, Fee and Amount
  createCookies() {
    let pageID = this.getPageID();
    crumbs.set("Frequency-" + pageID, this.getFrequency()); // Create session cookie
    crumbs.set("Amount-" + pageID, this.getAmount()); // Create session cookie
    crumbs.set("Fee-" + pageID, this.getFee()); // Create session cookie
  }

  // Load Frequency, Fee and Amount From Cookies
  loadCookies() {
    let pageID = this.getPageID();
    let frequency = crumbs.get("Frequency-" + pageID);
    let amount = crumbs.get("Amount-" + pageID);
    let fee = crumbs.get("Fee-" + pageID);
    if (frequency) {
      console.log("Frequency Loaded");
      this.setFrequency(frequency);
    }
    if (amount) {
      console.log("Amount Loaded");
      this.setAmount(amount);
    }
    if (fee) {
      console.log("Fee Loaded");
      this.setFee(fee);
    }
  }
}
