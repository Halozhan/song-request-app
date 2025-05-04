"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [applicant, setApplicant] = useState("");

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
      <ToastContainer />
    </div>
  );
}
