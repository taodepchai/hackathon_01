"use strict";
// import Swal from "sweetalert2";
class Feedback {
    constructor() {
        this.scoreActive = 10;
        this.listFeedbackLocal = JSON.parse(localStorage.getItem("feedbacks")) || [];
        this.feedbackInput = document.querySelector("#feedbackInput");
        this.error = document.querySelector(".error");
        this.btnSend = document.querySelector(".btn-send");
        this.reviewNumber = document.querySelector(".review-number");
        this.averageRate = document.querySelector(".average-number");
        this.inputContainer = document.querySelector(".input-container");
        this.inputContainer.addEventListener("click", () => {
            this.feedbackInput.focus();
        });
        this.feedbackInput.focus();
        this.renderListButtonScore();
        this.handleScoreButtonClick();
        this.renderListFeedback();
        this.validateData();
        this.handleAverageRating();
        this.handleSendButtonClick();
    }
    renderListButtonScore() {
        let scroses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let btnScoreGroup = document.querySelector(".btn-score-group");
        let scoreHtmls = scroses.map((score) => {
            return `
                <button class="btn-score ${score === this.scoreActive ? "active" : ""}" data-score="${score}">${score}</button>
            `;
        });
        let scroreHtml = scoreHtmls.join("");
        btnScoreGroup.innerHTML = scroreHtml;
    }
    handleScoreButtonClick() {
        let btnScoreGroup = document.querySelector(".btn-score-group");
        btnScoreGroup.addEventListener("click", (e) => {
            let targetButton = e.target.closest(".btn-score");
            if (targetButton) {
                let allButtons = btnScoreGroup.querySelectorAll(".btn-score");
                allButtons.forEach((button) => button.classList.remove("active"));
                targetButton.classList.add("active");
                this.scoreActive = +targetButton.dataset.score;
            }
        });
    }
    renderListFeedback() {
        let listFeedbackContent = document.querySelector(".list-feedback-content");
        let feedbackHtmls = this.listFeedbackLocal.map((feedback) => {
            return `
                <div class="feedback-content">
                    <div class="feedback-content-header">
                        <i id="update_${feedback.feedbackId}" class="fa-solid fa-pen-to-square"></i>
                        <i id="delete_${feedback.feedbackId}" class="fa-solid fa-xmark"></i>
                    </div>
                    <div class="feedback-content-body">
                        <p class="content-feedback">${feedback.content}</p>
                    </div>
                    <button class="btn-score active">${feedback.score}</button>
                </div>
            `;
        });
        let feedbackHtml = feedbackHtmls.join("");
        listFeedbackContent.innerHTML = feedbackHtml;
        this.reviewNumber.innerHTML = this.listFeedbackLocal.length.toString();
        this.handleDeleteFeedback();
        this.handleUpdateFeedback();
    }
    handleDeleteFeedback() {
        let listFeedbackContent = document.querySelector(".list-feedback-content");
        listFeedbackContent.addEventListener("click", (e) => {
            const deleteButton = e.target.closest(".fa-xmark");
            if (deleteButton) {
                Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "##fc0303",
                    cancelButtonColor: "##fc0303",
                    confirmButtonText: "Yes, delete it!"
                }).then((result) => {
                    if (result.isConfirmed) {
                        const idDelete = deleteButton.id.split("_")[1];
                        this.listFeedbackLocal = this.listFeedbackLocal.filter((fb) => fb.feedbackId !== idDelete);
                        localStorage.setItem("feedbacks", JSON.stringify(this.listFeedbackLocal));
                        this.renderListFeedback();
                        this.handleAverageRating();
                    }
                });
            }
        });
    }
    handleUpdateFeedback() {
        let listFeedbackContent = document.querySelector(".list-feedback-content");
        listFeedbackContent.addEventListener("click", (e) => {
            if (e.target && e.target.matches(".fa-pen-to-square")) {
                let idUpdate = e.target.id.split("_")[1];
                let updatingFeedback = this.listFeedbackLocal.find((fb) => fb.feedbackId === idUpdate);
                if (updatingFeedback) {
                    this.feedbackInput.value = updatingFeedback.content;
                    this.scoreActive = updatingFeedback.score;
                    this.renderListButtonScore();
                }
            }
        });
    }
    handleSendButtonClick() {
        this.btnSend.addEventListener("click", (e) => {
            Swal.fire({
                title: "Are you sure?",
                text: "",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "##03fc0b",
                cancelButtonColor: "##fc0303",
                confirmButtonText: "Yes"
            }).then((result) => {
                if (result.isConfirmed) {
                    e.stopPropagation();
                    let feedback = this.feedbackInput.value;
                    let updatingFeedback = null;
                    if (updatingFeedback) {
                        updatingFeedback.content = feedback;
                        updatingFeedback.score = this.scoreActive;
                        localStorage.setItem("feedbacks", JSON.stringify(this.listFeedbackLocal));
                        this.feedbackInput.value = "";
                        updatingFeedback = null;
                        this.feedbackInput.focus();
                        this.renderListFeedback();
                        this.handleAverageRating();
                    }
                    else {
                        let newFeedback = {
                            feedbackId: uuidv4(),
                            score: this.scoreActive,
                            content: feedback,
                        };
                        this.listFeedbackLocal.unshift(newFeedback);
                        localStorage.setItem("feedbacks", JSON.stringify(this.listFeedbackLocal));
                        this.renderListFeedback();
                        this.handleAverageRating();
                        this.feedbackInput.value = "";
                    }
                    this.reviewNumber.innerHTML = this.listFeedbackLocal.length.toString();
                    this.btnSend.classList.remove("btn-dark");
                }
            });
        });
    }
    validateData() {
        let feedback = this.feedbackInput.value;
        this.feedbackInput.addEventListener("input", (e) => {
            if (!e.target.value.trim()) {
                this.error.style.display = "block";
                this.btnSend.classList.remove("btn-dark");
            }
            else {
                feedback = e.target.value;
                this.error.style.display = "none";
                this.btnSend.classList.add("btn-dark");
            }
        });
    }
    handleAverageRating() {
        if (this.listFeedbackLocal.length > 0) {
            let totalScoreFeedback = this.listFeedbackLocal.reduce((a, b) => {
                return a + b.score;
            }, 0);
            let averageRating = totalScoreFeedback / this.listFeedbackLocal.length;
            this.averageRate.innerHTML = averageRating.toFixed(1);
        }
        else {
            this.averageRate.innerHTML = "0";
        }
    }
}
new Feedback();
