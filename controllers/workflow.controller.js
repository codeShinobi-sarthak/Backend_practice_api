
//  if you are using ES6 modules ans want to import using commonJS modules, you can use the following code
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";
import { sendReminderEmail } from '../utils/send-email.js';


const REMINDERS = [7, 6, 5, 4, 3, 2, 1];

export const sendRemainder = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== "active") {
        return {
            status: "error",
            message: "Subscription not found or not active",
        };
    }

    const renewalDate = dayjs(subscription.renewalDate);

    if (!renewalDate.isBefore(dayjs())) {
        console.log("Subscription is not due for renewal yet");
        return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, "day");

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(
                context,
                `Reminder ${daysBefore} days before`,
                reminderDate
            );
        }

        if (dayjs().isSame(reminderDate, "day")) {
            await triggerReminder(
                context,
                `${daysBefore} days before reminder`,
                subscription
            );
        }
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
      return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
  }

const sleepUntilReminder = async (context, reminderName, reminderDate) => {
    console.log(`Sleeping until ${reminderName} at ${reminderDate}`);

    await context.sleepUntil(reminderName, reminderDate.toDate());
};

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);

        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        });
    });
};
