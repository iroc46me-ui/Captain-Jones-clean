import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, page, device, details } = await request.json();

    if (!name || !email || !page || !device || !details) {
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
        subject: `Rough Seas Report: ${page}`,
        html: `
          <h2>New Rough Seas Report</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Where:</strong> ${page}</p>
          <p><strong>Device:</strong> ${device}</p>
          <h3>What Happened</h3>
          <p>${details}</p>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend error:", error);

      return NextResponse.json(
        { error: "The report could not be sent.", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Rough Seas error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}