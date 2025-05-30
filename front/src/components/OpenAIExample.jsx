import { useState } from 'react';
import OpenAI from 'openai';

const OpenAIExample = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: input }],
        model: "gpt-4o-mini",
      });

      setResponse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error);
      setResponse('에러가 발생했습니다. API 키를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">OpenAI API 예제</h1>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          rows="4"
          placeholder="질문을 입력하세요..."
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? '처리 중...' : '전송'}
        </button>
      </form>

      {response && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="font-bold mb-2">응답:</h2>
          <p className="whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
};

export default OpenAIExample; 