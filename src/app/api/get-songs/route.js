import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_SECRET });

export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    response.results.forEach((page) => {
      console.log(page.properties["상태"]);
    });

    const songs = response.results
      .map((page) => ({
        title: page.properties["노래 제목"].title[0]?.text.content || "",
        artist: page.properties["가수"].rich_text[0]?.text.content || "",
        applicant:
          page.properties["신청자 이름"].rich_text[0]?.text.content || "",
        status: page.properties["상태"].status?.name || "", // 상태 필드 추가
        createdTime: page.created_time, // 생성 일시 추가
      }))
      .filter((song) => song.status !== "완료") // 완료 상태 숨기기
      .sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime)); // 생성 일시 기준 오름차순 정렬

    return NextResponse.json(songs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json(
      { message: "데이터를 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
