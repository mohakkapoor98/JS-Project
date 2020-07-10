// INSTRUCTIONS:
/*
  Create a new resource controller that uses the
  User as an associative collection (examples):
  - User -> Books
  - User -> Reservation

  The resource controller must contain the 7 resource actions:
  - index
  - show
  - new
  - create
  - edit
  - update
  - delete
*/

const viewPath = 'gym';
const Gym = require('../models/gym');
const User = require('../models/User');

const exercises = Gym.schema.paths.Exercise.enumValues;
exports.index = async (req, res) => {
  try {
    const gym = await Gym
      .find()
      .populate('user')
      .sort({ updatedAt: 'desc' });

    res.render(`${viewPath}/index`, {
      pageTitle: 'Archive',
      gym,
      exercises
    });
  } catch (error) {
    req.flash('danger', `There was an error: ${error}`);
    res.redirect('/');
  }
};

exports.show = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id)
      .populate('user');

    res.render(`${viewPath}/show`, {
      pageTitle: gym.title,
      gym,
      exercises
    });
  } catch (error) {
    req.flash('danger', `There was an error: ${error}`);
    res.redirect('/');
  }
};

exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'New Fitness',
    exercises
  });
};

exports.create = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({ email: email });
    const gym = await Gym.create({ user: user._id, ...req.body });

    req.flash('success', 'Athelete created successfully');
    res.redirect(`/gym/${gym.id}`);
  } catch (error) {
    req.flash('danger', `There was an error creating this athelete: ${error}`);
    req.session.formData = req.body;
    res.redirect('/gym/new');
  }
};

exports.edit = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);
    res.render(`${viewPath}/edit`, {
      pageTitle: gym.title,
      formData: gym,
      exercises
    });
  } catch (error) {
    req.flash('danger', `There was an error accessing this athelete: ${error}`);
    res.redirect('/');
  }
};

exports.update = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({ email: email });

    let gym = await Gym.findById(req.body.id);
    if (!gym) throw new Error('Athelete could not be found');

    const attributes = { user: user._id, ...req.body };
    await Gym.validate(attributes);
    await Gym.findByIdAndUpdate(attributes.id, attributes);

    req.flash('success', 'The athelete was updated successfully');
    res.redirect(`/gym/${req.body.id}`);
  } catch (error) {
    req.flash('danger', `There was an error updating this athelete: ${error}`);
    res.redirect(`/gym/${req.body.id}/edit`);
  }
};

exports.delete = async (req, res) => {
  try {
    await Gym.deleteOne({ _id: req.body.id });
    req.flash('success', 'The athelete was deleted successfully');
    res.redirect(`/gym`);
  } catch (error) {
    req.flash('danger', `There was an error deleting this athelete: ${error}`);
    res.redirect(`/gym`);
  }
};