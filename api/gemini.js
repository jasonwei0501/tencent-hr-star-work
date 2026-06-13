// 文件路径: api/gemini.js
export default async function handler(req, res) {
  // 限制只能通过 POST 请求调用
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允许 POST 请求' });
  }

  // 从 Vercel 的安全环境变量中读取真实的 API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '服务器未配置 API Key' });
  }

  // 目标 Google API 地址（建议使用 1.5 系列，比代码里之前的版本更稳定）
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    // 作为中间人，把前端发来的 Payload 原封不动转发给 Google
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body) // req.body 包含了你前端组装的 messages 等
    });

    const data = await response.json();
    
    // 把 Google 的结果返回给前端
    res.status(200).json(data);
  } catch (error) {
    console.error("代理请求失败:", error);
    res.status(500).json({ error: '请求 Gemini API 失败' });
  }
}
