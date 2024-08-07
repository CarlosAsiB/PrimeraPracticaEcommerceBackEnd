import crypto from 'crypto';
import User from '../dao/models/userModel.js';
import sendEmail from '../utils/mailer.js'; 

export const sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    const resetURL = `http://${req.headers.host}/reset/${token}`;
    await sendEmail(user.email, 'Password Reset', `Click this link to reset your password: ${resetURL}`);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending reset email' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    if (req.body.password === req.body.confirmPassword) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      res.status(200).json({ message: 'Password reset successful' });
    } else {
      res.status(400).json({ message: 'Passwords do not match' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error resetting password' });
  }
};
