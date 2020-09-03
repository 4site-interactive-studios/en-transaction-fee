# Engaging Networks Transaction Fee Script

## Setup

1 - First, create a script with the options:

```html
<script>
  window.TransactionFeeOptions = {
    enOnSubmit: false, // Use enOnSubmit? If False, you have to call addFees() by hand in your script
    class: "foursite-transaction-fee",
    fixed: 0.2,
    percent: 5,
    label:
      "I'd like to cover all transaction fees (${fixed} + {percent}%) so that 100% of my donation goes to the The National Wildlife Federation!",
    position: ".CC_Number", // A query selector for the sibling element you want to add the transaction fee
  };
</script>
```

2 - Then add the transaction fee file:

```html
<script async type="text/javascript" src="/dist/transaction-fee.js"></script>
```

3 - You're done! If you set the `enOnSubmit` option to `false`, you'll need to call `window.transactionFee.addFees();` by hand in your form submit script. We made it that way so we can easily calculate the fees when submiting your donation using other scripts that also interacts with the Donation Form.

## Options

**enOnSubmit** - true to calculate the fees automatically before submitting the donation.  
**class** - Set a custom class here if you want to change the styling of your transaction fee checkbox.  
**fixed** - Set a fixed transaction amount to add. Defaults to 0.20.  
**percent** - Set a percentage to add. Defaults to 3.  
**label** - The transaction fee label. You can use the {fixed} and {percent} keywords to get replaced by the values defined on the fixed and percent options.  
**position** - You can add a query selector to define exactly where you want the checkbox field to get placed. Default empty. If empty, the element will be placed as the last element on the form.

You can ommit any option that you don't need to change the default value.

## How to call transactionFee.addFees(); by hand

If you set the `enOnSubmit` to `false`, you just need to paste this javascript code to your form validation script right before the form submission:

```javascript
// 4Site Transaction Fee Start
if (window.hasOwnProperty("transactionFee")) {
  window.transactionFee.addFees();
}
// 4Site Transaction Fee End
```

It first checks if the `transactionFee` global variable is available, so your code will not return any error if you haven't added our main javascript file yet.

## Features

- It only runs if you're on a donation page. If you add the script to other pages, you'll not get any output errors.
- It creates 3 cookies to save the state of your donation amount, donation frequency and transaction fee checkbox. Those cookies are valid during the current session and do not conflict with different donation pages. You can test it by changing the donation amount, checking the transaction fee checkbox and refreshing the page. It also refreshes the cookies before changing the amount to submit the form.
- You don't need to worry about any HTML or CSS.
- It has no external dependency.

## Install Dependencies

1. `npm install`

## Deploy

1. `npm run build`

It's going to create a `dist` folder, where you can get the files and publish it.
