import { Schema, model } from 'mongoose';
import { TStudent, TUserName, TGuardian, TLocalGuardian, TStudentModel } from './student.interface';
import validator from 'validator'
import bcrypt from 'bcrypt'
import config from '../../config';
const userNameSchema = new Schema<TUserName>({
    firstName: {
        type: String,
        // trim property will remove the string spaces
        trim: true,
        required: [true, 'First name is required'],
        validate: {
            validator: function (value: string) {
                const firstCarCapital = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
                return value === firstCarCapital
            },
            message: '{VALUE} is not capitalize!'
        }
    },
    middleName: {
        type: String
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        validate: {
            validator: (value: string) => validator.isAlpha(value),
            message: "{VALUE} is not valid value."
        }
    }

})


const guardianSchema = new Schema<TGuardian>({
    fatherName: String,
    fatherOccupation: String,
    fatherContactNo: String,
    motherName: String,
    motherOccupation: String,
    motherContactNo: String,
})

const localGuardianSchema = new Schema<TLocalGuardian>({
    name: String,
    occupation: String,
    contactNo: String,
    address: String,
})



const StudentSchema = new Schema<TStudent, TStudentModel>({
    id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: userNameSchema,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: [6, 'password should be at last 6 character']
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'other'],
            message: "{VALUE} is not supported. The gender filed can be one of the following: 'male', 'female' or 'other'",

        },
        required: [true, 'Gender is required']
    },
    email: {
        type: String,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: "{VALUE} is not valid email."
        }
    },
    dateOfBirth: { type: String },
    contactNumber: {
        type: String,
        minlength: [11, 'The length of ContactNO should be 11'],
        maxlength: [11, 'The length of ContactNO should be 11'],
        required: [true, 'ContactNO is required!']
    },
    emergencyContactNo: {
        type: String,
        minlength: [11, 'The length of ContactNO should be 11'],
        maxlength: [11, 'The length of ContactNO should be 11'],
        required: [true, 'ContactNO is required!']
    },
    bloodGroup: { type: String },
    presentAddress: { type: String },
    permanentAddress: { type: String },
    guardian: {
        type: guardianSchema,
        required: true
    },
    localGuardian: {
        type: localGuardianSchema,
        required: true
    },
    studentStatus: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active',
    },
    profilePic: String,
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: {
        virtuals: true
    }
});


//Mongoose virtual method       
StudentSchema.virtual('fullName').get(function () {
    return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`

})





//creating a custom static method
StudentSchema.statics.isStudentExists = async function (id: string) {
    const existingStudent = await StudentModel.findOne({ id })

    return existingStudent;
}


/*                        MONGOOSE BUILTIN MIDDLEWARE                                */
//Document middleware example
//pre save middleware
StudentSchema.pre('save', async function (next) {
    // console.log(this, 'pre hook we will save the data');

    const user = this; //this raper the currently processing document.  
    //hashing password and save into db
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt),
    )
    next();
});


//post save middleware
StudentSchema.post('save', function (doc, next) {
    // console.log(this, 'Post hook we saved our data');

    doc.password = ''// we have empty string the password
    next();
});






//Query middleware example
//pre save query middleware
StudentSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } })

    next();
});

StudentSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } })
    next();
});


//when we will use aggregate this middleware will work
StudentSchema.pre('aggregate', function (next) { 
    
    // console.log(this.pipeline()); 
    //Output: [ { '$match': { id: '10' } } ] 

    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
    //Output: [{$match: {isDeleted: {$ne: true}}}, { '$match': { id: '10' } } ]


    next();
});





//creating a custom instance method
// StudentSchema.methods.isUserExists = async function (id: string) {
//     const existingStudent = StudentModel.findOne({ id })
//     return existingStudent;
// }



export const StudentModel = model<TStudent, TStudentModel>('Student', StudentSchema);


