import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, firstName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const { data, error } = await resend.contacts.create({
      email,
      firstName: firstName || null,
      lastName: "",
      unsubscribed: false,
      audienceId: "3ba599f4-e6ce-401b-8766-3e1573db506b",
    });

    if (error) {
      console.error("Resend contact creation error:", error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Newsletter API error:", error);

    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
