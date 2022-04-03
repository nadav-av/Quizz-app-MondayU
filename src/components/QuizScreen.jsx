import React, { useState, useEffect } from "react";
import QuizQuestion from "./QuizQuestion.jsx";
import QuizResult from "./QuizResult.jsx";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";
import Categories from "../data/categories.json";

const QuizScreen = (props) => {
  const [QuestionList, setQuestionList] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [markedAnswer, setMarkedAnswer] = useState(
    new Array(QuestionList.length)
  );
  const [isLoading, setIsLoading] = useState(true);
  const { category, difficulty } = props;

  useEffect(() => {
    const catNum = Categories.find((cat) => cat.name === category).id;
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `https://opentdb.com/api.php?amount=10&category=${catNum}&difficulty=${difficulty.toLowerCase()}`
        );
        setQuestionList(response.data.results);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuestions();
  }, [category, difficulty]);

  if (isLoading) {
    return (
      <div className="sweet-loading" id="loader">
        <HashLoader
          size={100}
          color={"#0AD0AF"}
          loading={isLoading}
          speedMultiplier={2.4}
        />
      </div>
    );
  }
  const isQuestionEnd = currentQuestionIndex === QuestionList.length;
  const { retry } = props;

  const calculateResult = () => {
    let correctAnswers = 0;
    console.log(markedAnswer);
    QuestionList.forEach((question, index) => {
      if (question.correct_answer === markedAnswer[index]) {
        correctAnswers++;
      }
    });
    return {
      correct: correctAnswers,
      total: QuestionList.length,
      precentage: Math.trunc((correctAnswers / QuestionList.length) * 100),
    };
  };

  return (
    <div className="quiz-screen">
      {isQuestionEnd ? (
        <QuizResult score={calculateResult()} retry={retry} />
      ) : (
        <QuizQuestion
          question={QuestionList[currentQuestionIndex]}
          totalQuestions={QuestionList.length}
          currentQuestion={currentQuestionIndex}
          setAnswer={(answer) => {
            setMarkedAnswer((arr) => {
              let newArr = [...arr];
              newArr[currentQuestionIndex] = answer;
              return newArr;
            });
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          }}
        />
      )}
    </div>
  );
};

export default QuizScreen;
