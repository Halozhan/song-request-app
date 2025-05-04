"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [applicant, setApplicant] = useState("");
  const [songs, setSongs] = useState<
    { title: string; artist: string; applicant: string }[]
  >([]);

  const fetchSongs = async () => {
    try {
      const response = await fetch("/api/get-songs");
      const data = await response.json();
      setSongs(data);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  useEffect(() => {
    fetchSongs(); // 초기 데이터 로드

    const interval = setInterval(() => {
      fetchSongs(); // 주기마다 데이터 새로고침
    }, 2000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !artist || !applicant) {
      toast.error("모든 필드를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, artist, applicant }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setTitle("");
        setArtist("");
        setApplicant("");
        fetchSongs(); // 새 데이터를 가져옵니다.
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("신청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-500">
        노래 신청하기
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mb-8"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="노래 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="가수"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="신청자 이름"
            value={applicant}
            onChange={(e) => setApplicant(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          신청하기
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4 text-blue-500">
        신청된 노래 목록
      </h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white rounded-lg shadow-md">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border px-4 py-2">노래 제목</th>
              <th className="border px-4 py-2">가수</th>
              <th className="border px-4 py-2">신청자 이름</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-200" : "bg-gray-50"}`}
              >
                <td className="border px-4 py-2 text-blue-500">{song.title}</td>
                <td className="border px-4 py-2 text-blue-500">
                  {song.artist}
                </td>
                <td className="border px-4 py-2 text-blue-500">
                  {song.applicant}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
}
