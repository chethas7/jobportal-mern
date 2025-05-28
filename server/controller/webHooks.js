import { Webhook } from "svix";
import userModel from "../models/userModel.js"; // Ensure this path is correct

const clerkWebhooks = async (req, res) => {
  console.log("Webhook route hit at", new Date().toISOString());
  console.log("Clerk webhook received a request.");

  // Check if CLERK_WEBHOOK_SECRET is loaded
  if (!process.env.CLERK_WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET not found in environment variables.");
    return res
      .status(500)
      .json({ success: false, message: "Webhook secret not configured." });
  }

  // Log headers for debugging svix verification
  console.log("Request Headers:", JSON.stringify(req.headers));
  // Log raw body to ensure it's what we expect
  console.log("Request Body (raw):", JSON.stringify(req.body));

  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    let evt;

    // Verify the webhook
    try {
      evt = wh.verify(req.body, {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      });

      console.log("Webhook successfully verified.");
    } catch (err) {
      console.error("Error verifying webhook:", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }

    const { data, type } = evt; // Use 'evt' which is the verified payload

    console.log(`Received event type: ${type}`);
    console.log("Event data:", JSON.stringify(data));

    switch (
      type // Corrected from 'key' to 'type'
    ) {
      case "user.created": {
        console.log("Processing user.created event for ID:", data.id);
        // IMPORTANT: Log the 'data' object to confirm the structure for names, email, etc.
        // e.g., console.log("User created data structure:", JSON.stringify(data));
        const userData = {
          _id: data.id, // Clerk user ID as MongoDB _id
          email:
            data.email_addresses && data.email_addresses.length > 0
              ? data.email_addresses[0].email_address
              : null,
          // Common Clerk payload: data.first_name, data.last_name. Adjust if different.
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || data.profile_image_url || "", // Check for both common image URL fields
          resume: "", // Default empty resume
        };
        if (!userData.email) {
          console.warn("User created event: Email address is missing.");
          // Decide if you want to proceed without an email or return an error
        }
        console.log("User data to create:", JSON.stringify(userData));
        const newUser = await userModel.create(userData);
        console.log("New user created in DB:", JSON.stringify(newUser));
        res.status(201).json({ success: true, user: newUser }); // Send 201 for created
        break;
      }
      case "user.updated": {
        console.log("Processing user.updated event for ID:", data.id);
        // IMPORTANT: Log the 'data' object to confirm the structure
        // e.g., console.log("User updated data structure:", JSON.stringify(data));
        const userDataToUpdate = {
          email:
            data.email_addresses && data.email_addresses.length > 0
              ? data.email_addresses[0].email_address
              : undefined, // Only update if present
          name:
            `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
            undefined,
          image: data.image_url || data.profile_image_url || undefined,
        };

        // Remove undefined fields so they don't overwrite existing data with null/undefined
        Object.keys(userDataToUpdate).forEach(
          (key) =>
            userDataToUpdate[key] === undefined && delete userDataToUpdate[key]
        );

        if (Object.keys(userDataToUpdate).length === 0) {
          console.log("User updated event: No relevant data to update.");
          return res
            .status(200)
            .json({ success: true, message: "No data to update." });
        }

        console.log("User data to update:", JSON.stringify(userDataToUpdate));
        const updatedUser = await userModel.findByIdAndUpdate(
          data.id,
          userDataToUpdate,
          { new: true }
        );
        if (!updatedUser) {
          console.error("User not found for update with ID:", data.id);
          return res
            .status(404)
            .json({ success: false, message: "User not found for update." });
        }
        console.log("User updated in DB:", JSON.stringify(updatedUser));
        res.status(200).json({ success: true, user: updatedUser });
        break;
      }
      case "user.deleted": {
        console.log("Processing user.deleted event for ID:", data.id);
        if (!data.id) {
          // Clerk might send a slightly different payload for deletions
          console.error("User deleted event: ID is missing from data.");
          return res.status(400).json({
            success: false,
            message: "User ID missing in delete event.",
          });
        }
        const deletedUser = await userModel.findByIdAndDelete(data.id);
        if (!deletedUser) {
          console.error("User not found for deletion with ID:", data.id);
          // It's often okay to return 200 even if not found, as the goal (user gone) is achieved.
          // Or return 404 if you need to distinguish.
          return res.status(200).json({
            success: true,
            message: "User not found or already deleted.",
          });
        }
        console.log("User deleted from DB, ID:", data.id);
        res
          .status(200)
          .json({ success: true, message: "User deleted successfully." });
        break;
      }
      default:
        console.log(`Unhandled event type: ${type}`);
        res
          .status(200)
          .json({ success: true, message: `Unhandled event type: ${type}` }); // Acknowledge other events
        break;
    }
  } catch (error) {
    console.error("Error processing webhook:", error.message);
    console.error("Stack Trace:", error.stack); // Log the full stack trace
    // Avoid sending back detailed error messages in production if they might contain sensitive info
    res.status(500).json({
      success: false,
      message: "Internal server error processing webhook.",
    });
  }
};

export default clerkWebhooks;
