import "./scss/main.scss";
import { TransactionFee } from "./app/transaction-fee";

//run();
window.addEventListener("load", function() {
  window.TransactionFee = TransactionFee;
  if (!window.hasOwnProperty("TransactionFeeOptions")) {
    window.TransactionFeeOptions = {};
  }
  window.transactionFee = new TransactionFee(window.TransactionFeeOptions);
});
