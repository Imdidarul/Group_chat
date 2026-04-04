const { CronJob } = require('cron');
const sequelize = require('./utils/dbConnection');
const { Message, ArchivedMessages } = require('./model');


module.exports = function startArchivingMessages(){
        const job = new CronJob(
            '0 0 * * *',
            async function () {
                const transaction = await sequelize.transaction();

                try {
                    console.log("⏳ Starting archive job...");


                    const allMessages = await Message.findAll({ transaction });

                    if (allMessages.length === 0) {
                        console.log("⚠️ No messages to archive");
                        await transaction.commit();
                        return;
                    }

                    const cleanedMessages = allMessages.map(msg => {
                        const { id, ...rest } = msg.get({ plain: true });
                        return rest;
                    });

                    await ArchivedMessages.bulkCreate(cleanedMessages, { transaction });

                    await Message.destroy({
                        where: {},
                        truncate: true,
                        transaction
                    });

                    await transaction.commit();

                    console.log(`✅ Archived ${cleanedMessages.length} messages successfully`);

                } catch (error) {
                    await transaction.rollback();
                    console.error("Transaction failed", error);
                }
            },
            null,
            true,
            'Asia/Kolkata'
        );
        job.start()
        console.log("Achiving messages")
    }
