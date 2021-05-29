import { Document, model, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface IUser {
  username: string;
  email: string;
  password: string;
  role: number;
}

interface IUserDocument extends IUser, Document {
  setPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;
  generateToken: () => string;
}

interface IUserModel extends Model<IUserDocument> {
  findByEmail: (email: string) => Promise<IUserDocument>;
}

const UserSchema: Schema<IUserDocument, IUserModel> = new Schema({
  username: {
    type: String,
    unique: 1,
  },
  email: {
    type: String,
    unique: 1,
  },
  password: String,
  role: {
    type: Number,
    default: 0,
  },
});

UserSchema.methods.setPassword = async function (password: string) {
  const hash = await bcrypt.hash(password, 10);
  this.password = hash;
};

UserSchema.methods.checkPassword = async function (password: string) {
  const result = await bcrypt.compare(password, this.password);

  return result;
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d', // 7일 동안 유효함
    }
  );

  return token;
};

UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email });
};

const User = model('User', UserSchema);

export default User;
