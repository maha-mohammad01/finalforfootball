// CheckoutForm.js

import { ElementsConsumer, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import CardSection from "./CardSection";
import axios from "axios";

function CheckoutForm({ stripe, elements }) {
  const location = useLocation();
  const locationState = location.state || {};
  const { total, cart } = locationState;
  const amount = total * 100;
  
  const [paymentAmount, setPaymentAmount] = useState(amount);
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.error("Error creating payment method:", error);
      // يمكنك إظهار رسالة الخطأ للمستخدم هنا
      return;
    }

    if (paymentMethod) {
      const { id } = paymentMethod;
      const response = await axios.post("http://localhost:2000/Payment", {
        amount: paymentAmount, // استخدام المبلغ الذي تم حفظه في الحالة
        id,
      });

      if (response.data.success) {
        try {
          alert("Payment successful");
          console.log("Payment successful");
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("Payment failed");
      }
    } else {
      console.log("Payment method is undefined");
    }
  };

  return (
    <div className="checkout-container">
      <form onSubmit={handleSubmit} className="payment-form">
        <CardSection />

        <button className="bg-emerald-500 text-white text-[1.2em] cursor-pointer transition-[background-color] duration-[0.3s] ease-[ease] px-[15px] py-2.5 rounded-[9px] border-[none] hover:bg-emerald-700">
          Pay ${paymentAmount / 100}
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm;
