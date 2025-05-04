"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [applicant, setApplicant] = useState("");
  const [songs, setSongs] = useState([]);

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
    <div style={{ padding: "2rem" }}>
      <h1>노래 신청하기</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "400px",
        }}
      >
        <input
          type="text"
          placeholder="노래 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="가수"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="신청자 이름"
          value={applicant}
          onChange={(e) => setApplicant(e.target.value)}
          required
        />
        <button type="submit">신청하기</button>
      </form>

      <h2>신청된 노래 목록</h2>
      <table border="1" style={{ marginTop: "1rem", width: "100%" }}>
        <thead>
          <tr>
            <th>노래 제목</th>
            <th>가수</th>
            <th>신청자 이름</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr key={index}>
              <td>{song.title}</td>
              <td>{song.artist}</td>
              <td>{song.applicant}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
}
