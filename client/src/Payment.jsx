import React from 'react'
import { loadStripe } from "@stripe/stripe-js";
import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';
import CheckoutForm from "../src/Component/CheckoutForm";

const stripePromise = loadStripe('pk_test_51OGgPBGQpG0LBUoZNw8FNO2sAJUviOz5AjLfz3h2rHPIXRK8xsBn2yQtW2YKCg9H89QedSFsEdpMbY7KMKv2p4wK00XUrTQdBw');
const Payment = () => {
  return (
    <div className="product">

    <div>


        <Elements stripe={stripePromise}>
        <ElementsConsumer>
  {({ stripe, elements }) => <CheckoutForm stripe={stripe} elements={elements} />}
</ElementsConsumer>

      </Elements>

    </div>
  </div>
  )
}

export default Payment