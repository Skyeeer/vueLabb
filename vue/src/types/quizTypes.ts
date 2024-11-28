export interface Question {
    question: string;
    correct_answer: string;
    all_answers: string[];
}

export interface Category {
    id: number;
    name: string;
}
