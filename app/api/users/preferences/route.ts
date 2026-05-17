import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSession } from '../../../../lib/auth';

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { category, uiSettings } = data;

    // Update User
    if (category) {
      await prisma.user.update({
        where: { id: session.userId },
        data: { category }
      });
    }

    // Update UserPreferences
    await prisma.userPreference.upsert({
      where: { userId: session.userId },
      update: { uiSettings: uiSettings },
      create: {
        userId: session.userId,
        uiSettings: uiSettings
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Preferences update error", error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}