export async function handler() {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "✅ Node API đang hoạt động trên Netlify!",
      message: "Chào mừng bạn đến với Video Search API (Node.js version).",
      usage: {
        "/api/search": "Tìm video từ Xvideos theo từ khóa",
        "/api/jrants/search": "Tìm bài viết trên Jrants theo từ khóa"
      },
    }),
  };
}
