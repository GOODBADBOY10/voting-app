import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";


export async function GET(request: Request) {
    const actionMetadata: ActionGetResponse = {
        icon: "https://media.gettyimages.com/id/75941645/photo/woman-scooping-peanut-butter-from-jar.jpg?s=612x612&w=0&k=20&c=etUc0P3NdZ6TdjKmTEURwQg74hTys7UL2FSjoFIzVYY=",
        title: "Vote for your favorite type of peanut butter",
        description: "vote between cruchy and smooth peanut butter",
        label: "Vote",
    }
    return Response.json(actionMetadata, {
        headers: ACTIONS_CORS_HEADERS
    });
}