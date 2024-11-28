<template>
  <div class="quiz-container">
    <div v-if="questions.length && currentQuestion">
      <p class="question-count">Fråga {{ currentQuestionIndex + 1 }} av {{ questions.length }}</p>
      <h2 class="question-text">{{ currentQuestion.question }}</h2>
      <div class="answers-grid">
        <button class="answer-button" v-for="(answer, index) in currentQuestion.all_answers" :key="index" @click="handleAnswer(answer)">
          {{ answer }}
        </button>
      </div>
    </div>
    <div v-else>
      <LoadingAnimation />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import LoadingAnimation from '@/components/LoadingAnimation.vue';
import { Question } from '@/types/quizTypes';

export default defineComponent({
  name: 'QuizComponent',
  components: { LoadingAnimation },
  props: {
    categoryId: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      default: '',
    },
    questionCount: {
      type: Number,
      default: 10,
    },
  },
  setup(props, { emit }) {
    const questions = ref<Question[]>([]);
    const currentQuestionIndex = ref(0);
    const loading = ref(true);

    function decodeHTMLEntities(text: string): string {
      const parser = new DOMParser();
      const decodedString = parser.parseFromString(text, 'text/html').body.textContent;
      return decodedString || '';
    }

    const fetchQuestions = async () => {
      try {
        console.log('Hämtar frågor för kategori:', props.categoryId);

        // Bygg API-URL med de nya parametrarna
        let apiUrl = `https://opentdb.com/api.php?amount=${props.questionCount}&category=${props.categoryId}&type=multiple`;

        if (props.difficulty) {
          apiUrl += `&difficulty=${props.difficulty}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log('API-svar:', data);

        // Bearbeta och dekoda frågorna
        questions.value = data.results.map((q: any) => ({
          question: decodeHTMLEntities(q.question),
          correct_answer: decodeHTMLEntities(q.correct_answer),
          all_answers: [...q.incorrect_answers, q.correct_answer]
            .map((ans: string) => decodeHTMLEntities(ans))
            .sort(() => Math.random() - 0.5),
        }));

        emit('questionsLoaded', questions.value);
      } catch (error) {
        console.error('Fel vid hämtning av frågor:', error);
      } finally {
        loading.value = false;
      }
    };

    const handleAnswer = (answer: string) => {
      const currentQuestion = questions.value[currentQuestionIndex.value];

      emit('answerSelected', {
        questionIndex: currentQuestionIndex.value,
        userAnswer: answer,
        correctAnswer: currentQuestion.correct_answer,
        questionText: currentQuestion.question,
      });

      if (currentQuestion.correct_answer === answer) {
        emit('correct');
      }

      if (currentQuestionIndex.value < questions.value.length - 1) {
        currentQuestionIndex.value++;
      } else {
        emit('complete');
      }
    };

    const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);

    onMounted(fetchQuestions);

    return {
      questions,
      currentQuestionIndex,
      currentQuestion,
      handleAnswer,
      loading,
    };
  },
});
</script>

<style scoped>
.quiz-container {
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.question-count {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.question-text {
  font-size: 1.8rem;
  margin-bottom: 2rem;
}

.answers-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.answer-button {
  padding: 1rem;
  font-size: 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.answer-button:hover {
  background-color: #369f6a;
  transform: translateY(-2px);
}
</style>
