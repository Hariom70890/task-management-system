const {default: mongoose} = require( "mongoose" );

const taskSchema = new mongoose.Schema( {
    title: { type: String, required: true,trim:true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true  },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["pending", "inProgress", "completed"],  default: "pending" },
    assignedTo: { id: { type: mongoose.Schema.Types.ObjectId, ref: "User", }, name: { type: String, } },
    creator: { id: { type: mongoose.Schema.Types.ObjectId, ref: "User", }, name: { type: String, } },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" } ,
}, { timestamps: true } 
);

const Task = mongoose.model( "Task", taskSchema );

module.exports = Task;
