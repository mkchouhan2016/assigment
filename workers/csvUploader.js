const { parentPort, workerData } = require("worker_threads");
const fs = require("fs");
const csv = require("csv-parser");
const connectDB = require("../db");

const Agent = require("../models/Agent");
const User = require("../models/User");
const Account = require("../models/Account");
const LOB = require("../models/LOB");
const Carrier = require("../models/Carrier");
const Policy = require("../models/Policy");

(async () => {
  await connectDB();
  const path = workerData.filePath;
  fs.createReadStream(path)
    .pipe(csv())
    .on("data", async (row) => {
      try {
         await Agent.findOneAndUpdate(
          { name: row["agent"] },
          { name: row["agent"] },
          { upsert: true, new: true }
        );

        const user = await User.findOneAndUpdate(
          { email: row["email"] },
          {
            firstName: row["firstname"],
            dob: row["dob"],
            address: row["address"],
            phoneNumber: row["phone"],
            state: row["state"],
            zipCode: row["zip"],
            email: row["email"],
            gender: row["gender"],
            userType: row["userType"],
          },
          { upsert: true, new: true }
        );

        await Account.findOneAndUpdate(
          { name: row["account_name"], userId: user._id },
          { name: row["account_name"], userId: user._id },
          { upsert: true, new: true }
        );

        const lob = await LOB.findOneAndUpdate(
          { categoryName: row["category_name"] },
          { categoryName: row["category_name"] },
          { upsert: true, new: true }
        );

        const carrier = await Carrier.findOneAndUpdate(
          { companyName: row["company_name"] },
          { companyName: row["company_name"] },
          { upsert: true, new: true }
        );

        await Policy.create({
          policyNumber: row["policy_number"],
          policyStartDate: row["policy_start_date"],
          policyEndDate: row["policy_end_date"],
          lobId: lob._id,
          carrierId: carrier._id,
          userId: user._id,
        });
      } catch (err) {
        console.error("Error inserting row:", err);
      }
    })
    .on("end", () => {
      fs.unlinkSync(path,()=>{
        console.log("file deleted", path);
      })
      parentPort.postMessage("Upload complete");
    });
})();
