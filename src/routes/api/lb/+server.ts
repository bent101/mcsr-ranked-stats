import { getLeaderboardURL } from "$lib/urls";

export const config = {
  isr: {
    expiration: 10,
  },
};

export async function GET() {
  const lb = await fetch(getLeaderboardURL()).then((res) => res.json());

  return new Response(JSON.stringify(lb), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=20, s-maxage=20, stale-while-revalidate=20",
    },
  });
}
