import { connectToDatabase } from "@/lib/mongo";
import Recap from "@/models/Recap";

export async function POST(req: Request) {
  const body = await req.json();
  await connectToDatabase();

  const newRecap = await Recap.create(body);

  return new Response(JSON.stringify(newRecap), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
