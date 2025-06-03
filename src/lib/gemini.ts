import {GoogleGenerativeAI} from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);

export async function generateRecap(gameData: string){
  const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro-latest' });

  const prompt=`
  You are a sports journalist writing an engaging NBA game recap for fans. Include key stats, momentum shifts, standout players, and final score. Keep it under 150 words and make it sound exciting.
  ${gameData}
  
  Mention key players and the amount of points they scored, scores and overall game flow. Keep in under 150 words.
  `;


  const result = await model.generateContent({
    contents:[
      {
        role:'user',
        parts: [{text: prompt}],
      },
    ],
  });
  const response = await result.response;
  const text = response.text();

  return text;

}