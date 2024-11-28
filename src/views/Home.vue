<template>
  <div class="home-container">
    <h1>Välkommen till Quiz-appen!</h1>
    <p>Välj en kategori för att börja spela.</p>

    <div v-if="loading">
      <p>Laddar kategorier...</p>
    </div>
    <div v-else-if="error">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="categories.length === 0">
      <p>Inga kategorier tillgängliga.</p>
    </div>
    <div v-else class="categories">
      <div
        class="category-card"
        v-for="category in categories"
        :key="category.id"
       @click="goToQuiz(category.id, category.name)"

      >
        {{ category.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Category } from '@/types/quizTypes';

export default defineComponent({
  name: 'Home',
  setup() {
    const router = useRouter();
    const categories = ref<Category[]>([]);
    const loading = ref(true);
    const error = ref<string | null>(null);

    const fetchCategories = async () => {
      try {
        const response = await fetch('https://opentdb.com/api_category.php');
        const data = await response.json();
        categories.value = data.trivia_categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
        }));
      } catch (err) {
        console.error('Fel vid hämtning av kategorier:', err);
        error.value = 'Kunde inte hämta kategorier. Vänligen försök igen senare.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchCategories);

   const goToQuiz = (categoryId: number, categoryName: string) => {
  router.push({
    name: 'QuizPage',
    params: { category: categoryId },
    query: { categoryName: categoryName },
  });
   };

    return {
      categories,
      loading,
      error,
      goToQuiz,
    };
  },
});
</script>

<style scoped>
.home-container {
  width: 100%;
  max-width: 800px;
  text-align: center;
  margin: 0 auto;
}

.categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.category-card {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  font-weight: bold;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

.category-card a {
  text-decoration: none;
  color: #333;
  display: block;
  height: 100%;
}
</style>
