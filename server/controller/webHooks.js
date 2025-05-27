import { Webhook } from "svix";
import userModel from "../models/userModel.js";

const clerkWebhooks = async (req, res) => {
  try {
    //SVIX instance Created
    const wHook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    //Verifying Headers
    await wHook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });
    // data from req.body
    const { data, type } = req.body;
    //switch case for diff events
    switch (key) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first._name + "" + data.last_name,
          image: data.image_url,
          resume: "",
        };
        await userModel.create(userData);
        res.json({});
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first._name + "" + data.last_name,
          image: data.image_url,
        };
        await userModel.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }
      case "user.deleted": {
        await userModel.findByIdAndDelete(data.id);
        res.json({});
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "webhook error" });
  }
};
export default clerkWebhooks;
