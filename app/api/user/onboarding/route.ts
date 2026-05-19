export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { mapPreferenceTheme, normalizeCategory, normalizePreferences, VALID_CATEGORIES } from "@/lib/preferences";

export async function PATCH(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;
    const body = await request.json();
    const category = normalizeCategory(body.category);
    const uiPreferences = normalizePreferences(body.uiPreferences, category);

    if (body.category && !VALID_CATEGORIES.includes(body.category)) {
      return NextResponse.json(
        { error: "Invalid category. Must be one of: AUTISM, CP, LEARNING_HARDENING, NONE" },
        { status: 400 }
      );
    }

    // 1. Update the User record with category + raw JSON preferences
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        category,
        uiPreferences: uiPreferences as any,
      },
      select: {
        id: true,
        category: true,
        uiPreferences: true,
      },
    });

    // 2. Upsert the UserPreference record with derived accessibility settings
    const prefs = uiPreferences;
    const theme = mapPreferenceTheme(category, prefs);
    const reduceMotion = Boolean(prefs.reduceMotion);

    await prisma.userPreference.upsert({
      where: { userId },
      create: {
        userId,
        theme,
        reduceMotion,
        uiSettings: {
          highContrast: Boolean(prefs.highContrastText),
          mutedColors: Boolean(prefs.mutedColors),
          reduceSound: Boolean(prefs.reduceSound),
          focusMode: Boolean(prefs.focusMode),
          largeTargets: Boolean(prefs.largeTargets),
          keyboardNav: Boolean(prefs.keyboardNav),
          stickyKeys: Boolean(prefs.stickyKeys),
          extraSpacing: Boolean(prefs.extraSpacing),
          dyslexicFont: Boolean(prefs.dyslexicFont),
          simplifiedText: Boolean(prefs.simplifiedText),
          readingGuide: Boolean(prefs.readingGuide),
          ttsEnabled: Boolean(prefs.ttsEnabled),
          scale: prefs.scale || "normal",
          density: prefs.density || "normal",
          computedAttrs: prefs.computedAttrs || {},
        },
      },
      update: {
        theme,
        reduceMotion,
        uiSettings: {
          highContrast: Boolean(prefs.highContrastText),
          mutedColors: Boolean(prefs.mutedColors),
          reduceSound: Boolean(prefs.reduceSound),
          focusMode: Boolean(prefs.focusMode),
          largeTargets: Boolean(prefs.largeTargets),
          keyboardNav: Boolean(prefs.keyboardNav),
          stickyKeys: Boolean(prefs.stickyKeys),
          extraSpacing: Boolean(prefs.extraSpacing),
          dyslexicFont: Boolean(prefs.dyslexicFont),
          simplifiedText: Boolean(prefs.simplifiedText),
          readingGuide: Boolean(prefs.readingGuide),
          ttsEnabled: Boolean(prefs.ttsEnabled),
          scale: prefs.scale || "normal",
          density: prefs.density || "normal",
          computedAttrs: prefs.computedAttrs || {},
        },
      },
    });

    // 3. Log the onboarding activity
    await prisma.activityLog.create({
      data: {
        userId,
        action: "onboarding_complete",
        details: `Profile: ${category}, Preferences set.`,
      },
    });

    const response = NextResponse.json(updatedUser, { status: 200 });
    response.cookies.set("tafrah_onboarded", "true", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  } catch (error) {
    console.error("Error updating user onboarding:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
