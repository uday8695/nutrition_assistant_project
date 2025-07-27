exports.updateDailyGoal = async (req, res) => {
  const { dailyGoal } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { dailyGoal },
    { new: true }
  );
  res.json({ dailyGoal: user.dailyGoal });
};