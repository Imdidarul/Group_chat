const User = require("./user");
const ArchivedMessages = require("./archivedMessage")
const Message = require("./message");

User.hasMany(Message, { foreignKey: "userId" });
Message.belongsTo(User, { foreignKey: "userId" });

module.exports = {User, Message, ArchivedMessages}