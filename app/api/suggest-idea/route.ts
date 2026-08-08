import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, title, details } = await request.json();

    if (!name || !email || !title || !details) {
      return NextResponse.json(
        { error: "Please complete all fields." },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Davey Jones Junk-N-Treasure <onboarding@resend.dev>",
        to: ["iroc46me@gmail.com"],
        reply_to: email,
        subject: `Captain's Log Idea: ${title}`,
        html: `
          <h2>New Captain's Log Idea</h2>

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Idea:</strong> ${title}</p>

          <h3>Details</h3>
          <p>${details}</p>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend error:", error);

      return NextResponse.json(
        { error: "The message could not be sent." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Suggest idea error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}