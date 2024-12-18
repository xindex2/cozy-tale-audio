export const getToastMessage = (key: string, language: string) => {
  const messages: { [key: string]: { [lang: string]: string } } = {
    generating: {
      en: "Creating your story...",
      es: "Creando tu historia...",
      fr: "Création de votre histoire...",
      de: "Erstelle deine Geschichte...",
      ar: "جاري إنشاء قصتك..."
    },
    audioGenerating: {
      en: "Generating audio narration...",
      es: "Generando narración de audio...",
      fr: "Génération de la narration audio...",
      de: "Generiere Audio-Erzählung...",
      ar: "جاري إنشاء السرد الصوتي..."
    },
    ready: {
      en: "Your story is ready to play!",
      es: "¡Tu historia está lista para reproducir!",
      fr: "Votre histoire est prête à être jouée !",
      de: "Deine Geschichte ist bereit zum Abspielen!",
      ar: "قصتك جاهزة للتشغيل!"
    },
    error: {
      en: "Failed to generate story",
      es: "Error al generar la historia",
      fr: "Échec de la génération de l'histoire",
      de: "Geschichte konnte nicht generiert werden",
      ar: "فشل في إنشاء القصة"
    }
  };
  return messages[key][language] || messages[key]['en'];
};