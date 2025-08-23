import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, topic, company, message } = body;

    // Basic validation
    if (!name || !email || !topic || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Send email to hello@cmon.group
    const emailContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Company: ${company || "Not specified"}
Topic: ${topic}
Message: ${message}

Submitted at: ${new Date().toLocaleString()}
    `;

    // Using Resend for simple email sending
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: "Contact Form <noreply@cmon.group>",
      to: ["hello@cmon.group"],
      subject: `New Contact Form: ${topic}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    });

    if (error) {
      console.error("Email sending failed:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you for your message. We'll get back to you within 24 hours.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
