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
        { id: 1, title: "Materi 1: Menemukan Ikigai Baru", type: "video", duration: "24 Menit", done: false },
        { id: 2, title: "Materi 2: Manajemen Stress & Perubahan", type: "video", duration: "18 Menit", done: true },
        { id: 3, title: "Materi 3: Lingkaran Sosial Positif", type: "artikel", duration: "12 Menit", done: false },
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

// ✅ FIX BARU: Normalisasi 1 soal dari format DB → format frontend
function normalizeQuestion(q) {
  // Handle format DB: { teks_soal, options: [{teks_opsi, is_correct, id}] }
  // Handle format fallback: { text, options: ["string", ...] }
  const text = q.text ?? q.teks_soal ?? "";

  const rawOptions = Array.isArray(q.options) ? q.options : [];
  const options = rawOptions.map((opt) => {
    if (typeof opt === "object" && opt !== null) {
      // Format dari DB — kembalikan sebagai objek agar teks_opsi bisa dikirim ke backend
      return {
        id: opt.id,
        teks_opsi: opt.teks_opsi ?? opt.text ?? "",
        is_correct: !!opt.is_correct,
      };
    }
    // Sudah berupa string (format fallback)
    return opt;
  });

  return { ...q, text, options };
}

// ✅ FIX BARU: Normalisasi 1 kuis dari format DB → format frontend
function normalizeQuiz(quiz) {
  if (!quiz) return null;
  return {
    ...quiz,
    // Map field DB "judul" → "title" jika ada
    title: quiz.title ?? quiz.judul ?? "",
    // Map field DB "nilai_lulus" → "passingScore" jika ada
    passingScore: quiz.passingScore ?? quiz.nilai_lulus ?? 70,
    // Map field DB "total_soal" → "totalQuestions" jika ada
    totalQuestions: quiz.totalQuestions ?? quiz.total_soal ?? 0,
    // Normalisasi tiap soal
    questions: Array.isArray(quiz.questions)
      ? quiz.questions.map(normalizeQuestion)
      : [],
  };
}

// ✅ FIX BARU: Normalisasi 1 modul dari format DB → format frontend
function normalizeModule(mod) {
  return {
    ...mod,
    quiz: mod.quiz ? normalizeQuiz(mod.quiz) : null,
  };
}

export function normalizeLearning(learning) {
  const course = {
    ...fallbackLearning.course,
    ...(learning?.course || {}),
  };

  const rawModules =
    Array.isArray(learning?.modules) && learning.modules.length > 0
      ? learning.modules
      : fallbackLearning.modules;

  // ✅ Normalisasi semua modul beserta kuis & soal-nya
  const modules = rawModules.map(normalizeModule);

  return {
    course,
    modules,
    progress:
      typeof learning?.progress === "number" ? learning.progress : course.progress,
  };
}

export function flattenMaterials(modules) {
  return modules.flatMap((module) =>
    (module.materials || []).map((material) => ({ ...material, module }))
  );
}

export function firstQuiz(modules) {
  const quiz = modules.find((module) => module.quiz)?.quiz;
  if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    return null; // ← jangan balikin fallbackLearning dummy
  }
  return quiz;
}