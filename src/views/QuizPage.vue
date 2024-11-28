<template>
  <div class="quiz-page-container">
    <h1>Quiz: {{ categoryName }}</h1>
    <div v-if="showSettings" class="quiz-settings">
      <div class="setting">
        <label for="difficulty">Välj svårighetsgrad:</label>
        <select id="difficulty" v-model="selectedDifficulty">
          <option value="">Alla</option>
          <option value="easy">Lätt</option>
          <option value="medium">Medium</option>
          <option value="hard">Svår</option>
        </select>
      </div>

      <div class="setting">
        <label for="questionCount">Antal frågor:</label>
        <input
          type="number"
          id="questionCount"
          v-model.number="questionCount"
          min="1"
          max="50"
        />
      </div>

      <button @click="startQuiz" class="start-button">Starta Quiz</button>
    </div>

    <div v-else>
      <QuizComponent
        :categoryId="categoryId"
        :difficulty="selectedDifficulty"
        :questionCount="questionCount"
        @correct="handleCorrect"
        @complete="handleComplete"
        @questionsLoaded="handleQuestionsLoaded"
        @answerSelected="handleAnswerSelected"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import { categories } from '@/components/categoryList';
import QuizComponent from '@/components/QuizComponent.vue';

export default defineComponent({
  name: 'QuizPage',
  components: {
    QuizComponent,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const score = ref(0);
    const totalQuestions = ref(0);
    const showSettings = ref(true);
    const selectedDifficulty = ref('');
    const questionCount = ref(10);

    const categoryId = Number(route.params.category) || 9;

    const categoryName = ref(route.query.categoryName || 'Okänd kategori');


    const userAnswers = ref<any[]>([]);

    const handleCorrect = () => {
      score.value++;
    };

    const handleComplete = () => {
      // Spara data i sessionStorage
      sessionStorage.setItem('userAnswers', JSON.stringify(userAnswers.value));
      sessionStorage.setItem('score', score.value.toString());
      sessionStorage.setItem('totalQuestions', totalQuestions.value.toString());

      router.push({
        name: 'ResultsPage',
      });
    };

    const handleQuestionsLoaded = (questions: any[]) => {
      totalQuestions.value = questions.length;
    };

    const handleAnswerSelected = (answerData: any) => {
      userAnswers.value.push(answerData);
    };

    const startQuiz = () => {
      showSettings.value = false;
    };

    return {
      categoryId,
      categoryName,
      handleCorrect,
      handleComplete,
      handleQuestionsLoaded,
      handleAnswerSelected, // Lägg till denna rad
      score,
      showSettings,
      selectedDifficulty,
      questionCount,
      startQuiz,
    };
  },
});
</script>

<style scoped>
.quiz-page-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.quiz-settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.setting {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.setting label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.setting select,
.setting input {
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.start-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.start-button:hover {
  background-color: #369f6a;
}
</style>
