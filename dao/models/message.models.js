import mongoose from "mongoose"; 

const messageSchema = new mongoose.Schema({
    user_email: {
        type: String,
        required: true,
        
    },
    user_message: {
        type: String,
        required: true,
    },
});

// messageSchema.index({ user_email: 1, user_message: 1 }, { unique: true });

export const messageModel = mongoose.model('messages', messageSchema);
