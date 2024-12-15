const ELEVEN_LABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";

export const generateAudio = async (text: string, voiceId: string, apiKey: string): Promise<string> => {
  try {
    const response = await fetch(`${ELEVEN_LABS_API_URL}/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate audio");
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error("Error generating audio:", error);
    throw error;
  }
};

export const getBackgroundMusicUrl = (musicSetting: string): string | null => {
  const musicMap: { [key: string]: string } = {
    'gentle-lullaby': '/assets/gentle-lullaby.mp3',
    'sleeping-lullaby': '/assets/peaceful-dreams.mp3',
    'water-dreams': '/assets/ocean-waves.mp3',
    'forest-birds': '/assets/nature-sounds.mp3',
    'relaxing-piano': '/assets/soft-piano.mp3'
  };

  return musicSetting && musicSetting !== 'no-music' ? musicMap[musicSetting] || null : null;
};