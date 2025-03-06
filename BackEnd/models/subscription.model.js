import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Price must be greater than 0']
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other'],
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
        //using a validator here will allow us to make sure that the start date can't be in the future
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past'
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            
            validator: function (value) { 
                return value > this.startDate
            },
            message: 'Renewal date must be after start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }
}, { timestamps: true});


//this will calculate the renewal date
subscriptionSchema.pre('save', function(next) {
    if(!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };
        //this code will get the date from startdate and then add the renewalperiod number to get the new renewalDate
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);

    }
    //this will update the status if the renewal date has passed
    if(this.renewalDate < new Date()){
        this.status = 'expired';
    }
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;