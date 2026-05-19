import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSession } from '../../../../lib/auth';
import { mapPreferenceTheme, normalizeCategory, normalizePreferences, VALID_CATEGORIES } from '../../../../lib/preferences';

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const currentUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { category: true },
    });
    const category = data.category ? normalizeCategory(data.category) : normalizeCategory(currentUser?.category);
    const uiPreferences = normalizePreferences(data.uiPreferences || data.uiSettings, category);

    if (data.category && !VALID_CATEGORIES.includes(data.category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.userId },
      data: {
        category,
        uiPreferences: uiPreferences as any
      },
      select: { id: true, category: true, uiPreferences: true }
    });

    await prisma.userPreference.upsert({
      where: { userId: session.userId },
      update: {
        theme: mapPreferenceTheme(category, uiPreferences),
        reduceMotion: Boolean(uiPreferences.reduceMotion),
        uiSettings: uiPreferences as any
      },
      create: {
        userId: session.userId,
        theme: mapPreferenceTheme(category, uiPreferences),
        reduceMotion: Boolean(uiPreferences.reduceMotion),
        uiSettings: uiPreferences as any
      }
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Preferences update error", error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}
