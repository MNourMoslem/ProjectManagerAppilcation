import { MailtrapClient } from "mailtrap";
import { config } from "dotenv";

config();

const TOKEN = process.env.MAILTRAP_API_TOKEN; // Replace with your Mailtrap API token

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};