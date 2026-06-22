export const fallbackLearning = {
  course: {
    id: 1,
    title: "Persiapan Mental Pensiun",
    category: "Keuangan",
    progress: 15,
    thumbnailUrl: "",
  },
  modules: [
    {
      id: 1,
      title: "Modul 1: Persiapan Mental Pensiun",
      locked: false,
      materials: [
        {
          id: 1,
          title: "Materi 1: Menemukan Ikigai Baru",
          type: "video",
          duration: "24 Menit",
          done: false,
        },
        {
          id: 2,
          title: "Materi 2: Manajemen Stress & Perubahan",
          type: "video",
          duration: "18 Menit",
          done: true,
        },
        {
          id: 3,
          title: "Materi 3: Lingkaran Sosial Positif",
          type: "artikel",
          duration: "12 Menit",
          done: false,
        },
      ],
      quiz: {
        id: 1,
        title: "Quiz Modul 1",
        duration: 12,
        passingScore: 80,
        totalQuestions: 10,
        questions: [
          {
            id: 1,
            text: "Apa langkah pertama yang paling penting dalam mengelola kecemasan menghadapi masa pensiun?",
            options: [
              "Mengabaikan perasaan cemas dan tetap sibuk bekerja lembur.",
              "Mengenali dan menerima perasaan tersebut sebagai bagian dari transisi hidup.",
              "Segera menjual seluruh aset tanpa perencanaan matang.",
              "Menarik diri dari lingkungan sosial agar tidak perlu bercerita tentang pensiun.",
            ],
            correctIndex: 1,
          },
        ],
      },
    },
    { id: 2, title: "Modul 2: Perencanaan Keuangan Mandiri", locked: true, materials: [] },
    { id: 3, title: "Modul 3: Investasi Aman Masa Tua", locked: true, materials: [] },
    { id: 4, title: "Modul 4: Gaya Hidup Sehat & Nutrisi", locked: true, materials: [] },
    { id: 5, title: "Modul 5: Kewirausahaan Skala Rumah", locked: true, materials: [] },
    { id: 6, title: "Modul 6: Teknologi untuk Komunikasi", locked: true, materials: [] },
    { id: 7, title: "Modul 7: Hukum & Waris", locked: true, materials: [] },
    { id: 8, title: "Modul 8: Kesimpulan & Rencana Aksi", locked: true, materials: [] },
  ],
};

export function normalizeLearning(learning) {
  const course = {
    ...fallbackLearning.course,
    ...(learning?.course || {}),
  };

  const modules =
    Array.isArray(learning?.modules) && learning.modules.length > 0
      ? learning.modules
      : fallbackLearning.modules;

  return {
    course,
    modules,
    progress:
      typeof learning?.progress === "number" ? learning.progress : course.progress,
  };
}

export function flattenMaterials(modules) {
  return modules.flatMap((module) =>
    (module.materials || []).map((material) => ({ ...material, module })),
  );
}

export function firstQuiz(modules) {
  const quiz = modules.find((module) => module.quiz)?.quiz;

  if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    return fallbackLearning.modules[0].quiz;
  }

  return quiz;
}
