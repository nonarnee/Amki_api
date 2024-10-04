import {apiGet} from "@/app/api/database";

export async function GET(req: Request, { params }: { params: { wordset_id: string } }) {
    const wordset_id = params.wordset_id;
    const query = `
        SELECT * FROM word where wordset_id=${wordset_id} ;
    `;

    let status, body;
    try {
        await apiGet(query)
            .then((res) => {
                status = 200;
                body = res;
            })
            .catch((err) => {
                status = 400;
                body = { error: err };
            });

        return Response.json(body, {
            status,
        });
    } catch (error: any) {
        console.error(error.message);
        return Response.json(
            {error},
            {
                status: 400,
            }
        );
    }
}
