export const maxDuration = 300;

export default async function handler(req, res) {
  return res.status(200).json({
    name: "Drysnack API",
    status: "active",
    maxDuration,
  });
}
