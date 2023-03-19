import React, { useEffect, useState } from "react";
import "./Signin.css";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import Cookies from "js-cookie";

import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";

function Signin() {
  const [text, setText] = useState("");
  const [array, setArray] = useState([]);
  const [isListening, setisListening] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // console.log("transcript is: ", transcript);
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    setText(transcript);
  }, [transcript]);

  const baseURL = `${process.env.REACT_APP_BACKEND_URL}api/questionAnswer`;
  const userId = Cookies.get("userId");

  const fetchQuesAns = async () => {
    try {
      const result = await axios.post(`${baseURL}/get`, {
        userId: userId,
      });

      // console.log("result is: ", result);
      let x = result.data.array;

      setArray(x);
      // console.log("array is: ", x);
    } catch (err) {
      console.log("err is: ", err);
    }
  };

  useEffect(() => {
    fetchQuesAns();
  }, []);

  const config = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);

  const doYourStuff = async () => {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        prompt: text,
        model: "text-davinci-003",
        max_tokens: 50,
        n: 1,
        stop: ".",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      }
    );

    // console.log("response from openai is: ", response.data.choices[0].text);

    speak({ text: response.data.choices[0].text });

    setText("");

    setArray([
      ...array,
      { question: text, answer: response.data.choices[0].text },
    ]);

    await axios.post(`${baseURL}/post`, {
      userId: userId,
      question: text,
      answer: response.data.choices[0].text,
    });
  };

  const cleanStuff = () => {
    setText("");
  };

  return (
    <div className="startDiv">
      <div className="headerDiv">
        <h2>ChatBot - The Answer To All Your Queries</h2>
        <h4>(Powered By AI)</h4>
      </div>
      <div className="msgOuterDiv">
        {array.map((item) => {
          return (
            <div key={item._id} className="msg">
              <div className="ques">
                <p className="msgText">{item.question}</p>
              </div>
              <div className="ans">
                <p className="msgText">{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <div className="textAreMicDiv">
          <div className="textAreaMic">
            <div className="textAreaDiv">
              <textarea
                className="text-area"
                rows={10}
                cols={55}
                onChange={(e) => {
                  setText(e.target.value);
                }}
                value={text}
                placeholder="Please ask your query"
              ></textarea>
            </div>
            {isListening ? (
              <div
                className="micon"
                onClick={() => {
                  setisListening(!isListening);
                }}
              >
                <button
                  className="micBtn"
                  onClick={SpeechRecognition.stopListening}
                >
                  <FaMicrophone
                    style={{ color: "aquamarine", fontSize: "30px" }}
                  ></FaMicrophone>
                </button>
              </div>
            ) : (
              <div
                className="micoff"
                onClick={() => {
                  setisListening(!isListening);
                }}
              >
                <button
                  className="micBtn"
                  onClick={SpeechRecognition.startListening}
                >
                  <FaMicrophoneSlash
                    style={{ color: "aquamarine", fontSize: "30px" }}
                  ></FaMicrophoneSlash>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="btnDiv">
          <button className="submitBtn" onClick={doYourStuff}>
            Submit
          </button>
          <button className="resetBtn" onClick={cleanStuff}>
            Reset
          </button>
          <button
            className="LogOutBtn"
            onClick={() => {
              Cookies.remove("userId");
              Cookies.remove("token");
              window.location.href = `${process.env.REACT_APP_FRONTEND_URL}`;
            }}
          >
            LogOut
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signin;
