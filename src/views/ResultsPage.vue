<template>
  <div class="results-container">
    <h1>Resultat</h1>
    <p class="summary">{{ score }} / {{ total }} rätt</p>
    <div class="questions-grid">
      <div
        v-for="(answer, index) in userAnswers"
        :key="index"
        class="question-card"
        :class="{
          correct: answer.correctAnswer === answer.userAnswer,
          incorrect: answer.correctAnswer !== answer.userAnswer,
        }"
        @click="openModal(answer)"
      >
        <p class="question-number"><strong>Fråga {{ index + 1 }}</strong></p>
        <p class="question-text">{{ answer.questionText }}</p>
      </div>
    </div>

    <Modal :visible="showModal" @close="closeModal">
      <h2>Fråga {{ selectedAnswer?.questionIndex + 1 }}</h2>
      <p>{{ selectedAnswer?.questionText }}</p>
      <p><strong>Ditt svar:</strong> {{ selectedAnswer?.userAnswer }}</p>
      <p><strong>Rätt svar:</strong> {{ selectedAnswer?.correctAnswer }}</p>
    </Modal>

    <router-link to="/" @click.native="resetQuiz">Spela igen</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Modal from '@/components/modal.vue';

export default defineComponent({
  name: 'ResultsPage',
  components: {
    Modal,
  },
  setup() {
    // Hämta data från sessionStorage
    const userAnswers = JSON.parse(sessionStorage.getItem('userAnswers') || '[]');
    const score = Number(sessionStorage.getItem('score')) || 0;
    const total = Number(sessionStorage.getItem('totalQuestions')) || userAnswers.length || 0;

    const showModal = ref(false);
    const selectedAnswer = ref<any>(null);

    const openModal = (answer: any) => {
      selectedAnswer.value = answer;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      selectedAnswer.value = null;
    };

    const resetQuiz = () => {
      sessionStorage.removeItem('userAnswers');
      sessionStorage.removeItem('score');
      sessionStorage.removeItem('totalQuestions');
    };

    return {
      userAnswers,
      score,
      total,
      showModal,
      selectedAnswer,
      openModal,
      closeModal,
      resetQuiz,
    };
  },
});
</script>

<style scoped>
.results-container {
  width: 90%;
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.summary {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.questions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}

.question-card {
  padding: 0.5rem;
  border-radius: 8px;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: transform 0.2s;
}

.question-card:hover {
  transform: translateY(-3px);
}

.question-card.correct {
  background-color: #d4edda; /* Ljusgrön */
}

.question-card.incorrect {
  background-color: #f8d7da; /* Ljusröd */
}

.question-number {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.question-text {
  font-size: 0.8rem;
}

a {
  display: inline-block;
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

a:hover {
  background-color: #369f6a;
}
</style>
