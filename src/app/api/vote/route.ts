import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";


export const OPTIONS = GET;

export async function GET(request: Request) {
    const actionMetadata: ActionGetResponse = {
        icon: "https://media.gettyimages.com/id/75941645/photo/woman-scooping-peanut-butter-from-jar.jpg?s=612x612&w=0&k=20&c=etUc0P3NdZ6TdjKmTEURwQg74hTys7UL2FSjoFIzVYY=",
        title: "Vote for your favorite type of peanut butter",
        description: "vote between cruchy and smooth peanut butter",
        label: "Vote",
        links: {
            actions: [
                {
                    label: "Vote for crunchy",
                    href: "/api/vote?candidate=crunchy",
                    type: "transaction",
                },
                {
                    label: "Vote for crunchy",
                    href: "/api/vote?candidate=smooth",
                    type: "transaction",
                },
            ]
        }
    }
    return Response.json(actionMetadata, {
        headers: ACTIONS_CORS_HEADERS
    });
}


export async function POST(request: Request) {
    const url = new URL(request.url);
    const candidate = url.searchParams.get("candidate");

    if (candidate != "crunchy" && candidate != "smooth") {
        return new Response("Invalid Credentials", {
            status: 400,
            headers: ACTIONS_CORS_HEADERS
        });
    }
    const connection = new Connection("https://127.0.0.1:8000", "confrimed");
}