import mongoose, { Schema } from "mongoose";
import { ICourse } from "../interfaces/course.interface";

const LectureSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    videoUrl: { 
        type: String, 
        required: true 
    },
    duration: { 
        type: String, 
        required: true 
    },
    order: { 
        type: Number 
    }
});

const courseSchema = new Schema<ICourse>({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    thumbnail:{type:String},
    lectures: [LectureSchema],
    instructor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Instructor',
        required: false
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default:[]
    }]
}, {
    timestamps: true
});

export default mongoose.model<ICourse>("Course", courseSchema); 