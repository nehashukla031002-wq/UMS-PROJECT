import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json(
      {
        message: "Logout successful",
      },
      {
        status: 200,
      }
    );

    // token cookie delete
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Logout failed",
      },
      {
        status: 500,
      }
    );
  }
}