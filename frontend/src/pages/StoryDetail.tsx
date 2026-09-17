import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, ApiClientError } from "../services/api";
import type { Story } from "../types";
import { Loading, ErrorState } from "../components/StateBlock";

export function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Story>(`/stories/${id}`).then(setStory).catch((e: ApiClientError) => setError(e.message));
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!story) return <Loading label="Carregando história" />;

  return (
    <article className="section">
      <div className="container" style={{ maxWidth: "700px" }}>
        <span className="tag tag--teal">{story.theme}</span>
        <h1>{story.title}</h1>
        <p style={{ color: "var(--ink-soft)" }}>— {story.authorName}</p>
        {story.body.split("\n").map((line, i) => (line.trim() ? <p key={i}>{line}</p> : <br key={i} />))}
      </div>
    </article>
  );
}
