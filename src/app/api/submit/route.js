import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_SECRET });

export async function POST(req) {
  const body = await req.json();
  const { title, artist, applicant } = body;

  if (!title || !artist || !applicant) {
    return NextResponse.json(
      { message: "필수 항목이 누락되었습니다." },
      { status: 400 }
    );
  }

  try {
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        "노래 제목": {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        가수: {
          rich_text: [
            {
              text: {
                content: artist,
              },
            },
          ],
        },
        "신청자 이름": {
          rich_text: [
            {
              text: {
                content: applicant,
              },
            },
          ],
        },
      },
    });

    return NextResponse.json(
      { message: "노래 신청이 완료되었습니다!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Notion API 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
