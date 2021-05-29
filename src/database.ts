import mongoose from 'mongoose';

const { DATABASE } = process.env;

mongoose
  .connect(DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(e => {
    console.log(e);
  });

export default mongoose;
