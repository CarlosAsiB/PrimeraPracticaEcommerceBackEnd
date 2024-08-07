import User from '../dao/models/userModel.js';

export const upgradeToPremium = async (req, res) => {
  try {
    const user = await User.findById(req.params.uid);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = user.role === 'user' ? 'premium' : 'user';
    await user.save();
    res.status(200).json({ message: `User role updated to ${user.role}` });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user role' });
  }
};
