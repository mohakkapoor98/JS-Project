// INSTRUCTIONS
/*
  Create a new resource model that uses the User
  as an associative collection (examples):
  - User -> Books
  - User -> Reservation

  Your model must contain at least three attributes
  other than the associated user and the timestamps.

  Your model must have at least one helpful virtual
  or query function. For example, you could have a
  book's details output in an easy format: book.format()
*/

const mongoose = require('mongoose');

const GymSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Exercise: {
    type: String,
    enum: ['Bicep-Curl', 'Deadlifts', 'Overhead-press', 'Bench-press', 'Tricep-dips', 'Squats', 'Pull-ups', 'Push-ups'],
    default: 'Bicep-Curl'
  },
  Weight: {
    type: String,
    enum: ['5', '10', '20', '30', '40', '50', '80', '100'],
    default: '5'
  },
  Repetitions: {
    type: String,
    enum: ['5', '10', '15', '20'],
    default: '5'
  }
}, {
  timestamps: true
});

GymSchema.virtual('synopsis')
  .get(function () {
    const gymData = this.content;
    return gymData.format(`You are doing ${Repetitions} of ${Exercise} wih ${Weight} weight.`);
  });

module.exports = mongoose.model('Gym', GymSchema);