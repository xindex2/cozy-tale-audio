interface StoryTemplate {
  title: string;
  story: string;
}

interface LanguageTemplates {
  [key: string]: StoryTemplate;
}

interface StoryTemplates {
  [key: string]: LanguageTemplates;
}

export const storyTemplates: StoryTemplates = {
  short: {
    en: {
      title: "Luna's Quick Adventure",
      story: "Once upon a time, in a magical forest, there lived a curious rabbit named Luna. One special morning, she discovered a glowing flower that sparkled with rainbow colors. The forest animals gathered around in wonder, sharing stories and becoming friends under its magical light. The wise owl shared ancient tales, while the playful squirrels danced in the flower's glow. The shy deer family emerged from the shadows to join the celebration. That day, Luna learned that the best adventures are the ones shared with new friends, and the magical flower continued to bring joy to the forest creatures for many days to come."
    },
    es: {
      title: "La Breve Aventura de Luna",
      story: "Había una vez, en un bosque mágico, vivía una coneja curiosa llamada Luna. Una mañana especial, descubrió una flor brillante que destellaba con colores del arcoíris. Los animales del bosque se reunieron maravillados, compartiendo historias y haciéndose amigos bajo su luz mágica. El sabio búho compartió historias antiguas, mientras las ardillas juguetonas bailaban en el resplandor de la flor. La tímida familia de ciervos emergió de las sombras para unirse a la celebración. Ese día, Luna aprendió que las mejores aventuras son las que se comparten con nuevos amigos, y la flor mágica continuó trayendo alegría a las criaturas del bosque durante muchos días más."
    },
    ar: {
      title: "مغامرة لونا القصيرة",
      story: "ذات مرة، في غابة سحرية، عاشت أرنبة فضولية تدعى لونا. في صباح مميز، اكتشفت زهرة متوهجة تتلألأ بألوان قوس قزح. تجمعت حيوانات الغابة في دهشة، يتشاركون القصص ويصبحون أصدقاء تحت ضوئها السحري. شارك البوم الحكيم قصصًا قديمة، بينما رقصت السناجب المرحة في ضوء الزهرة. خرجت عائلة الغزلان الخجولة من الظلال للانضمام إلى الاحتفال. في ذلك اليوم، تعلمت لونا أن أفضل المغامرات هي التي نشاركها مع الأصدقاء الجدد، واستمرت الزهرة السحرية في جلب البهجة لمخلوقات الغابة لأيام عديدة قادمة."
    }
  },
  medium: {
    en: {
      title: "Luna's Magical Journey",
      story: "Once upon a time, Luna the rabbit discovered a mysterious glowing flower in the enchanted forest. Its radiant light attracted all the woodland creatures, from tiny mice to wise owls. They gathered in amazement, sharing stories of ancient forest magic. As the day turned to dusk, they celebrated with songs and dance, creating lasting friendships under the starlit sky."
    },
    es: {
      title: "El Viaje Mágico de Luna",
      story: "Había una vez, Luna la coneja descubrió una misteriosa flor brillante en el bosque encantado. Su luz radiante atrajo a todas las criaturas del bosque, desde pequeños ratones hasta sabios búhos. Se reunieron asombrados, compartiendo historias de antigua magia del bosque. Cuando el día se convirtió en atardecer, celebraron con canciones y bailes, creando amistades duraderas bajo el cielo estrellado."
    },
    ar: {
      title: "رحلة لونا السحرية",
      story: "ذات مرة، اكتشفت الأرنبة لونا زهرة متوهجة غامضة في الغابة المسحورة. جذب ضوؤها المشع جميع مخلوقات الغابة، من الفئران الصغيرة إلى البوم الحكيم. تجمعوا في دهشة، يتشاركون قصص سحر الغابة القديم. عندما تحول النهار إلى غسق، احتفلوا بالأغاني والرقص، مكونين صداقات دائمة تحت السماء المرصعة بالنجوم."
    }
  },
  long: {
    en: {
      title: "Luna's Epic Forest Tale",
      story: "Once upon a time, in the heart of an enchanted forest, lived a curious rabbit named Luna. One magical morning, she discovered a mysterious flower that glowed with rainbow colors. Its radiant light attracted all the woodland creatures, from tiny mice to wise owls, and even the shy deer family. They gathered around in amazement, sharing ancient stories of forest magic passed down through generations. As the day progressed, more animals joined their circle, each bringing their own special magic to share. The squirrels performed acrobatic dances in the trees, while the birds sang melodies that seemed to make the flower glow even brighter. When day turned to dusk, they celebrated with a grand feast of forest berries and honey, dancing and singing under the starlit sky. That day, Luna learned that the greatest magic of all was the power of bringing friends together, creating bonds that would last forever in their enchanted forest home."
    },
    es: {
      title: "El Cuento Épico del Bosque de Luna",
      story: "Había una vez, en el corazón de un bosque encantado, vivía una coneja curiosa llamada Luna. Una mañana mágica, descubrió una flor misteriosa que brillaba con colores del arcoíris. Su luz radiante atrajo a todas las criaturas del bosque, desde pequeños ratones hasta sabios búhos, e incluso la tímida familia de ciervos. Se reunieron asombrados, compartiendo antiguas historias de magia del bosque transmitidas por generaciones. A medida que avanzaba el día, más animales se unieron a su círculo, cada uno trayendo su propia magia especial para compartir. Las ardillas realizaron danzas acrobáticas en los árboles, mientras los pájaros cantaban melodías que parecían hacer que la flor brillara aún más. Cuando el día se convirtió en atardecer, celebraron con un gran festín de bayas del bosque y miel, bailando y cantando bajo el cielo estrellado. Ese día, Luna aprendió que la mayor magia de todas era el poder de unir a los amigos, creando lazos que durarían para siempre en su hogar del bosque encantado."
    },
    ar: {
      title: "حكاية لونا الملحمية في الغابة",
      story: "ذات مرة، في قلب غابة مسحورة، عاشت أرنبة فضولية تدعى لونا. في صباح سحري، اكتشفت زهرة غامضة تتوهج بألوان قوس قزح. جذب ضوؤها المشع جميع مخلوقات الغابة، من الفئران الصغيرة إلى البوم الحكيم، وحتى عائلة الغزلان الخجولة. تجمعوا في دهشة، يتشاركون قصصًا قديمة عن سحر الغابة المتوارث عبر الأجيال. مع تقدم النهار، انضم المزيد من الحيوانات إلى دائرتهم، كل منهم يجلب سحره الخاص للمشاركة. قدمت السناجب رقصات بهلوانية في الأشجار، بينما غنت الطيور ألحانًا بدت وكأنها تجعل الزهرة تتوهج بشكل أكثر سطوعًا. عندما تحول النهار إلى غسق، احتفلوا بوليمة كبيرة من توت الغابة والعسل، يرقصون ويغنون تحت السماء المرصعة بالنجوم. في ذلك اليوم، تعلمت لونا أن أعظم سحر على الإطلاق كان قوة جمع الأصدقاء معًا، مكونة روابط ستدوم إلى الأبد في منزلهم في الغابة المسحورة."
    }
  }
};

export const getStoryTemplate = (duration: number, language: string): StoryTemplate => {
  let lengthKey = 'medium';
  if (duration <= 5) {
    lengthKey = 'short';
  } else if (duration >= 15) {
    lengthKey = 'long';
  }

  const languageStories = storyTemplates[lengthKey];
  return languageStories[language] || languageStories['en'];
};
