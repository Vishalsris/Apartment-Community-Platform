const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas for migration...');

        const Business = mongoose.model('Business', new mongoose.Schema({}, { strict: false }));
        const MarketplaceItem = mongoose.model('MarketplaceItem', new mongoose.Schema({}, { strict: false }));

        console.log('Migrating Businesses...');
        const bResult = await Business.updateMany(
            { approvalStatus: { $exists: false } },
            { $set: { approvalStatus: 'Pending' } }
        );
        console.log(`Updated ${bResult.modifiedCount} Businesses to Pending.`);

        console.log('Migrating Marketplace Items...');
        const mResult = await MarketplaceItem.updateMany(
            { approvalStatus: { $exists: false } },
            { $set: { approvalStatus: 'Pending' } }
        );
        console.log(`Updated ${mResult.modifiedCount} Marketplace Items to Pending.`);

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
