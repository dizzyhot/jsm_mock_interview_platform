"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7 * 1000;

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // First, verify that the Firebase Admin SDK is properly initialized
    if (!db) {
      throw new Error("Firebase Admin SDK not properly initialized");
    }

    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in instead",
      };
    }

    await db.collection("users").doc(uid).set({
      name,
      email,
      createdAt: new Date(),
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in",
    };
  } catch (error: any) {
    console.error("SignUp error:", error);

    // Handle specific Firebase authentication errors
    if (error.code === 16 || error.message?.includes("UNAUTHENTICATED")) {
      return {
        success: false,
        message:
          "Firebase authentication failed. Please check your Firebase configuration.",
      };
    }

    if (error.code === "auth/email-already-exists") {
      console.log(error);
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create an account. Please try again.",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK,
  });

  cookieStore.set("session", sessionCookie, {
    httpOnly: true,
    maxAge: ONE_WEEK,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Please sign up instead",
      };
    }

    await setSessionCookie(idToken);
    return {
      success: true,
      message: "Logged in successfully",
    };
  } catch (e: any) {
    console.log(e);
    return {
      success: false,
      message: "Failed to log into an account",
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (e: any) {
    console.log(e);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
