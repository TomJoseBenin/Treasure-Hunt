import React, { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Tab, Tabs, TextField } from '@material-ui/core';

import { formatDate, getAsset } from '../../../../config/Utils';
import AppContainer from '../../../components/AppContainer/AppContainer';
import { getCurrentQuestion, submitContestAnswer } from '../Contest.service';

import './GamePage.scss';


const GamePage = () => {

    const TAB_QUESTION = "question";
    const TAB_CLUE = "clue";
    const COMPLIMENT_TITLES = [
        "ð Congratulations !!!",
        "Kudos to you ð",
        "Great Job ð",
        "ð Well done !!!"
    ];
    const COMPLIMENT_MESSAGES = [
        "You have completed this level. You truely are a genius.",
        "Great job. You deserve a pat in the back for pulling that off.",
        "WOW !!! You continue to exceed every expectation that we set. Great job.",
        "Many others failed because they had a lot of excuses. You succeeded because you didnât have any. Well done.",
        "Your hard work and effort have paid off! A success well deserved, an occasion worth celebrating! Congratulations!"
    ];
    const ERROR_TITLES = [
        "Incorrect Answer!!!",
        "OOPS!!!"
    ];
    const ERROR_MESSAGES = [
        "Looks like you missed something.",
        "Don't give up. You can do it"
    ];

    const params = useParams();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    const [answer, setAnswer] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [helperText, setHelperText] = useState("");
    const [isSuccessResult, setIsSuccessResult] = useState(false);
    const [currentTab, setCurrentTab] = useState("question");
    const [currentQuestion, setCurrentQuestion] = useState();

    useEffect(() => {
        window.scrollTo(0, 0);
        let contestId = params.id;
        getQuestion.current(contestId);
    }, [params, params.id]);

    const getQuestion = useRef(() => { });
    getQuestion.current = (contestId) => {
        getCurrentQuestion(contestId)
            .then(response => {
                setCurrentQuestion(response);
            })
            .catch(error => {
                enqueueSnackbar(JSON.stringify(error), { variant: 'error' });
            });
    };

    const handleTabChange = (event, value) => {
        setCurrentTab(value);
        if (value === TAB_CLUE) {
            let contestId = params.id;
            getQuestion.current(contestId);
        }
    };

    const handleAnswerChange = (event) => {
        let text = event.target.value.toLowerCase();
        if (!text.match(/^[a-z0-9]+$/i)) {
            setHelperText("No special characters allowed !!! Use only alpha-numeric characters.");
            setTimeout(() => { setHelperText("") }, 3000);
        }
        else {
            setAnswer(event.target.value.toLowerCase());
        }
        if (answer.length === 1) {
            setAnswer(event.target.value.toLowerCase());
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleSubmit();
    }

    const handleSubmit = (event) => {
        if (validate()) {
            let reqBody = {
                contestId: params.id,
                answer: answer.trim()
            };
            submitAnswer(reqBody)
        }
    };

    const validate = () => {
        let isValid = true;

        if (!answer.match(/^[a-z0-9]+$/i)) {
            isValid = false;
            setHelperText("No special characters allowed!!! Use only alpha-numeric characters !!!");
            setTimeout(() => { setHelperText("") }, 3000);
        }
        if (!answer.trim()) {
            isValid = false;
            setHelperText("Invalid input !!!");
            setTimeout(() => { setHelperText("") }, 3000);
        }

        return isValid;
    };

    const submitAnswer = (reqBody) => {
        submitContestAnswer(reqBody)
            .then(status => {
                setShowResult(true);
                if (status) {
                    setIsSuccessResult(true);
                }
                else {
                    setIsSuccessResult(false);
                }
            })
            .catch(error => {
                enqueueSnackbar(JSON.stringify(error), { variant: 'error' });
                setAnswer("");
            });
    };

    const handleNext = (state) => {
        if (state) {
            getQuestion.current(params.id);
            setCurrentTab(TAB_QUESTION);
        }
        setAnswer("");
        setShowResult(false);
        setIsSuccessResult(false);
    };

    const getComplimentMessage = () => {
        return COMPLIMENT_MESSAGES[Math.floor(Math.random() * 10) % COMPLIMENT_MESSAGES.length];
    };

    const getComplimentTitle = () => {
        return COMPLIMENT_TITLES[Math.floor(Math.random() * 10) % COMPLIMENT_TITLES.length];
    };

    const getErrorMessage = () => {
        return ERROR_MESSAGES[Math.floor(Math.random() * 10) % ERROR_MESSAGES.length];
    };

    const getErrorTitle = () => {
        return ERROR_TITLES[Math.floor(Math.random() * 10) % ERROR_TITLES.length];
    };

    const gotoLeaderboard = () => {
        history.push(`/contest/${params.id}/leaderboard`);
    };

    const getQuestionClueTemplate = (stmt) => {
        let template = "";
        let stmtArray = `${stmt}`.split("\n");

        if (stmtArray.length > 1) {
            template = stmtArray.map((eachStmt, index) => <div key={index}>{eachStmt}</div>);
        } else {
            template = stmtArray[0] || "";
        }
        return template
    };

    return (
        <AppContainer>
            <div className="game-page-wrapper">
                {
                    currentQuestion && currentQuestion.lastQuestion ?
                        <div className="last-question-wrapper">
                            <div className="last-question-container">
                                <h1 className="section-title">{`ðCongratulations!!!ð`}</h1>
                                {/* <h1 className="section-title">{`LEVEL ${currentQuestion && currentQuestion.level}`}</h1> */}
                                <p className="time">{`Completed on: ${currentQuestion && currentQuestion.timeCompleted ? formatDate(currentQuestion.timeCompleted, "MMM D, YYYY, hh : mm a") : ''}`}</p>
                                <div className="content-container">
                                    {/* <h6 className="content">Looks like you are a ninja
                                            <img className="emoji" alt="ninja" src={getAsset("ninja.png", "img")} />
                                    </h6>
                                    <h6 className="content">Please wait while we cook some questions for you.</h6> */}
                                    <h6 className="content">Thank you Litmus7ites. You have been wonderful.</h6>
                                    <h6 className="content">Remember, INCOGNITO never ends...</h6>
                                    <h6 className="content"></h6>
                                    <h6 className="content"></h6>
                                    <h6 className="content">./team_incognito</h6>

                                    <blockquote className="wishes">
                                        May this yearâs Christmas be the best Christmas ever. Warmest wishes to you and your family. Have a great and wonderful Christmas and New Year!
                                    </blockquote>
                                </div>
                                <div className="action-wrapper">
                                    <Button variant="outlined" color="primary" onClick={gotoLeaderboard}>Go to Leaderboard</Button>
                                </div>
                            </div>
                        </div> :
                        <div className="current-question-wrapper">
                            <div className="current-question-header-container">
                                <h1 className="section-title">Level <span className="level">{currentQuestion && currentQuestion.level}</span></h1>
                                <Button variant="outlined" color="primary" onClick={gotoLeaderboard}>Leaderboard</Button>
                            </div>

                            <div className="question-container">
                                <section className="question-clue-section">
                                    <Tabs
                                        value={currentTab}
                                        onChange={handleTabChange}
                                        indicatorColor="primary"
                                    >
                                        <Tab label="Question" value={TAB_QUESTION} />
                                        <Tab label="Clues" value={TAB_CLUE} />
                                    </Tabs>

                                    {
                                        currentTab === TAB_QUESTION &&
                                        <div className="item-container">
                                            <h6 className="title">{currentQuestion && getQuestionClueTemplate(currentQuestion.question)}</h6>
                                            {
                                                currentQuestion && currentQuestion.imageUrl &&
                                                <img
                                                    src={currentQuestion.imageUrl}
                                                    className="media"
                                                    alt="media"
                                                />
                                            }
                                        </div>
                                    }

                                    {
                                        currentTab === TAB_CLUE &&
                                        <>
                                            {
                                                currentQuestion && currentQuestion.clues &&

                                                    currentQuestion.clues.length > 0 ?
                                                    currentQuestion.clues.map((clue, index) =>
                                                        <div className="item-container" key={clue.number}>
                                                            <h6 className="title">{`${index + 1}. `}{clue && getQuestionClueTemplate(clue.clueBody || "")}</h6>
                                                            {
                                                                currentQuestion && clue.image &&
                                                                <img
                                                                    src={clue.image}
                                                                    className="media"
                                                                    alt="media"
                                                                />
                                                            }
                                                        </div>
                                                    ) :
                                                    <div className="empty">Clues will be released shortly.</div>
                                            }
                                        </>
                                    }

                                </section>
                                <section className="answer-section">
                                    <div className="answer-container">
                                        {
                                            !showResult ?
                                                <form className="form-container" onSubmit={handleFormSubmit}>
                                                    <TextField
                                                        fullWidth
                                                        value={answer}
                                                        onChange={handleAnswerChange}
                                                        label="Shoot your answer"
                                                        variant="outlined"
                                                        className="answer"
                                                        autoFocus
                                                        helperText={helperText}
                                                        error={helperText ? true : false}
                                                    />
                                                    <Button
                                                        variant="contained"
                                                        className="btn-submit"
                                                        color="primary"
                                                        onClick={handleSubmit}
                                                    >
                                                        Submit
                                                    </Button>
                                                </form> :
                                                <div className="result-container">
                                                    <h1 className="title">{isSuccessResult ? getComplimentTitle() : getErrorTitle()}</h1>
                                                    <p className="content">{isSuccessResult ? getComplimentMessage() : getErrorMessage()}</p>
                                                    {
                                                        currentQuestion && currentQuestion.lastQuestion && isSuccessResult &&
                                                        <>
                                                            <p className="more-questions">Stay tuned for more exciting questions.</p>
                                                            <h1 className="emoji"><span role="img" aria-label="">ð</span></h1>
                                                        </>
                                                    }
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        className="btn-next"
                                                        onClick={() => handleNext(isSuccessResult)}
                                                    >
                                                        {isSuccessResult ? 'Next' : 'Try Again'}
                                                    </Button>
                                                </div>
                                        }
                                    </div>
                                    <div className="notification-container">
                                        <h1 className="title"><span role="img" aria-label="">ð¨</span> Stuck on a level?</h1>
                                        <p className="description">
                                            Don't lose hope. Clues will be updated on regular intervals to make the hunt fun.
                                </p>
                                        <p className="description">
                                            Check back later if you are stuck on a question and feels like murdering the guys running this.
                                </p>
                                    </div>
                                </section>
                            </div>
                        </div>
                }
            </div>
        </AppContainer >
    )
};

export default GamePage;