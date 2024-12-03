const {default: mongoose} = require( "mongoose" );
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema( {
    name: {  type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    tasks: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }] }
}, { timestamps: true }
);

userSchema.pre( 'save', async function ( next ) {
    const user = this;
    if ( user.isModified( 'password' ) ) {
        user.password = await bcrypt.hash( user.password, 10 );
    }
    next();
} );

userSchema.methods.isAdmin = function () {
    return this.role === "admin";
};

const User = mongoose.model( "User", userSchema );

module.exports = User
