export const maxDuration = 300;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
      return res.status(200).json({
        success: true,
        message: "Pesanan berhasil diproses.",
        data: body,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat memproses data.",
        error: error.message,
      });
    }
  }

  return res.status(200).json({
    status: "ok",
    message: "Endpoint pemesanan Drysnack aktif.",
    maxDuration,
  });
}
