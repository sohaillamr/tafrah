export const financeQuizzes = {
  1: {
    passingScore: 2,
    questions: [
      { id: "fq_1_1", text: "ما هي الأصول؟", textEn: "What are Assets?", options: [{id: "b", text: "الأشياء التي تملكها الشركة", textEn: "Things the company owns"}, {id: "a", text: "الديون", textEn: "Debts"}], correct: "b"},
      { id: "fq_1_2", text: "ما معادلة المحاسبة؟", textEn: "Equation?", options: [{id: "a", text: "الأصول = الخصوم + حقوق الملكية", textEn: "Assets = Lia + Eq"}, {id: "b", text: "الأرباح", textEn: "Profit"}], correct: "a"}
    ]
  },
  2: { passingScore: 1, questions: [{ id: "fq_2_1", text: "الغرض من قيود اليومية؟", textEn: "Purpose of Journal Entries?", options: [{id: "a", text: "تسجيل خطوة بخطوة مباشر", textEn: "Record step by step"}, {id: "b", text: "الأرباح", textEn: "Profit"}], correct: "a"}] },
  3: { passingScore: 1, questions: [{ id: "fq_3_1", text: "ما هي قائمة الدخل؟", textEn: "Income Statement?", options: [{id: "c", text: "توضح الأرباح", textEn: "Shows profit"}, {id: "a", text: "الديون", textEn: "Debts"}], correct: "c"}] },
  4: { passingScore: 1, questions: [{ id: "fq_4_1", text: "Dynamics 365?", textEn: "Why ERP?", options: [{id: "a", text: "أتمتة العمليات", textEn: "Automate"}, {id: "b", text: "النوم", textEn: "Sleep"}], correct: "a"}] }
};
