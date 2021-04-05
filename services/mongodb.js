const mongoose = require('mongoose');
  module.exports = () => {
    mongoose.connect('mongodb+srv://dbUser:sadece0ben@cluster0.za9bj.mongodb.net/Cluster0?retryWrites=true&w=majority', { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});    
      mongoose.connection.on('open', () => {
      });
        mongoose.connection.on('error', (err) => {
        console.log('MongoDB: Error', err);
  });
        
  mongoose.Promise = global.Promise;
};
