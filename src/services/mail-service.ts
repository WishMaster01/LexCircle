import { env, isResendConfigured, isSmtpConfigured } from "@/lib/env";
import type { ContactFormValues } from "@/lib/validations/contact";

function buildAdminHtml(payload: ContactFormValues) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#161514">
      <h2>New InkSphere contact message</h2>
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Topic:</strong> ${payload.topic}</p>
      <p><strong>Company:</strong> ${payload.company || "Not provided"}</p>
      <p><strong>Team size:</strong> ${payload.teamSize || "Not provided"}</p>
      <p><strong>Message:</strong></p>
      <p>${payload.message.replace(/\n/g, "<br />")}</p>
    </div>
  `;
}

function buildConfirmationHtml(payload: ContactFormValues) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#161514">
      <h2>We received your message</h2>
      <p>Hi ${payload.name},</p>
      <p>Thanks for contacting InkSphere. Your message has been received and queued for review.</p>
      <p><strong>Topic:</strong> ${payload.topic}</p>
      <p><strong>Submitted email:</strong> ${payload.email}</p>
      <p><strong>Your message:</strong></p>
      <p>${payload.message.replace(/\n/g, "<br />")}</p>
      <p>We will follow up as soon as possible.</p>
      <p>InkSphere Team</p>
    </div>
  `;
}

export async function sendContactEmail(payload: ContactFormValues) {
  const adminSubject = `InkSphere contact: ${payload.topic} from ${payload.name}`;
  const adminText = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Topic: ${payload.topic}`,
    `Company: ${payload.company || "Not provided"}`,
    `Team size: ${payload.teamSize || "Not provided"}`,
    "",
    payload.message,
  ].join("\n");
  const confirmationSubject = "InkSphere: we received your message";
  const confirmationText = [
    `Hi ${payload.name},`,
    "",
    "Thanks for contacting InkSphere. Your message has been received and queued for review.",
    `Topic: ${payload.topic}`,
    `Submitted email: ${payload.email}`,
    "",
    "Your message:",
    payload.message,
    "",
    "We will follow up as soon as possible.",
    "InkSphere Team",
  ].join("\n");

  if (isResendConfigured()) {
    const adminResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: payload.email,
        subject: adminSubject,
        html: buildAdminHtml(payload),
        text: adminText,
      }),
    });

    if (!adminResponse.ok) {
      throw new Error("Resend admin email delivery failed");
    }

    const confirmationResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [payload.email],
        subject: confirmationSubject,
        html: buildConfirmationHtml(payload),
        text: confirmationText,
      }),
    });

    if (!confirmationResponse.ok) {
      throw new Error("Resend confirmation email delivery failed");
    }

    return {
      provider: "resend" as const,
      adminDelivered: true,
      userDelivered: true,
    };
  }

  if (isSmtpConfigured()) {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: env.SMTP_SECURE === "true",
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: env.CONTACT_FROM_EMAIL,
      to: env.CONTACT_TO_EMAIL,
      replyTo: payload.email,
      subject: adminSubject,
      text: adminText,
      html: buildAdminHtml(payload),
    });

    await transporter.sendMail({
      from: env.CONTACT_FROM_EMAIL,
      to: payload.email,
      subject: confirmationSubject,
      text: confirmationText,
      html: buildConfirmationHtml(payload),
    });

    return {
      provider: "smtp" as const,
      adminDelivered: true,
      userDelivered: true,
    };
  }

  console.info("Contact email skipped: no Resend or SMTP configuration found.", {
    subject: adminSubject,
    replyTo: payload.email,
  });
  return {
    provider: "none" as const,
    adminDelivered: false,
    userDelivered: false,
  };
}
