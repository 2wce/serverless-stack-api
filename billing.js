import stripePackage from "stripe";
import { calculateCost } from "./libs/billing-lib";
import { failure, success } from "./libs/response-lib";

export async function main(event, context) {
  const { storage, source } = JSON.parse(event.body);
  const amount = calculateCost(storage);
  const description = "Scratch charge";

  // load our secret key from env
  const stripe = stripePackage(process.env.stripeSecretKey);

  try {
    await stripe.charges.create({
      source,
      amount,
      description,
      currency: "usd"
    });
    return success({ status: true });
  } catch (error) {
    return failure({ message: error.message });
  }
}
