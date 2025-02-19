import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Subscription name is required"],
            trim: "true",
            minLength: 2,
            maxLength: 100,
        },
        price: {
            type: Number,
            required: [true, "Subscription price is required"],
            min: [0, "Price must be a greater than 0"],
        },
        currency: {
            type: String,
            enum: ["USD", "EUR", "IND", "GBP"],
            default: "USD",
        },
        frequency: {
            type: String,
            enum: ["daily", "weekly", "monthly", "yearly"],
            default: "monthly",
        },
        category: {
            type: String,
            enum: [
                "sports",
                "entertainment",
                "technology",
                "business",
                "general",
            ],
            default: "general",
        },
        paymentMethod: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["active", "cancelled", "inactive"],
            default: "active",
        },
        startDate: {
            type: Date,
            required: true,
            validate: {
                validator: (value) => {
                    return value <= new Date();
                },
                message: "Start date must be a past",
            },
        },
        renewalDate: {
            type: Date,
            validate: {
                validator: function (value) {
                    return value > this.startDate;
                },
                message:
                    "Renewal date must be greater than start date i.e in future",
            },
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

// Auto-calculate renewal date if missing.
SubscriptionSchema.pre('save', function (next) {
    if(!this.renewalDate) {
      const renewalPeriods = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        yearly: 365,
      };
  
      this.renewalDate = new Date(this.startDate);
      this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
  
    // Auto-update the status if renewal date has passed
    if (this.renewalDate < new Date()) {
      this.status = 'expired';
    }
  
    next();
  });

export default mongoose.model("Subscription", SubscriptionSchema);
