import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import type { Quiz as QuizType, Answer } from "../types";
import { Loading, ErrorState } from "../components/StateBlock";

export function Quiz() {
  const { slug } = useParams<{ slug: string }>();
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Answer | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    api
      .get<QuizType>(`/quizzes/${slug}`)
      .then(setQuiz)
      .catch(() => setError("Não foi possível carregar este quiz."));
  }, [slug]);

  if (error) return <ErrorState message={error} />;
  if (!quiz) return <Loading label="Carregando quiz" />;

  const questions = quiz.questions ?? [];
  const currentQuestion = questions[step];

  function chooseAnswer(answer: Answer) {
    setSelected(answer);
  }

  function nextStep() {
    setSelected(null);
    if (step + 1 < questions.length) setStep(step + 1);
    else setFinished(true);
  }

  return (
    <section className="section">
      <div className="container quiz-card">
        <p className="eyebrow">Ferramenta interativa</p>
        <h1>{quiz.title}</h1>
        <p>{quiz.description}</p>

        {finished ? (
          <div className="card" style={{ textAlign: "center" }}>
            <h3>Obrigado por refletir com a gente</h3>
            <p>
              Este exercício não é um diagnóstico. Se algo aqui ressoou com a sua realidade,
              considere explorar a área <Link to="/entender">Entender</Link> ou conversar com a{" "}
              <Link to="/nina">Nina</Link>.
            </p>
            <Link to="/buscar-ajuda" className="btn btn--primary">Buscar ajuda</Link>
          </div>
        ) : currentQuestion ? (
          <div className="card">
            <p className="quiz-progress">Situação {step + 1} de {questions.length}</p>
            <h3>{currentQuestion.prompt}</h3>

            {!selected ? (
              <div className="quiz-options">
                {currentQuestion.answers.map((a) => (
                  <button key={a.id} className="quiz-option" onClick={() => chooseAnswer(a)}>
                    {a.text}
                  </button>
                ))}
              </div>
            ) : (
              <div className="quiz-explanation">
                <p style={{ marginBottom: "1rem" }}>{selected.explanation}</p>
                <button className="btn btn--primary" onClick={nextStep}>
                  {step + 1 < questions.length ? "Próxima situação" : "Ver considerações finais"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>Este quiz ainda não possui perguntas cadastradas.</p>
        )}
      </div>
    </section>
  );
}
