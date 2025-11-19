import { file, serve } from "bun";

const server = serve({
    port: 8000,
    routes: {
        "/api": () => new Response("Api"),
    },
    async fetch(req: Request): Promise<Response> {
        const url = new URL(req.url);

        if (url.pathname === "/") {
            return new Response(file("public/index.html"));
        }

        const filePath = `public${url.pathname}`;
        const staticFile = file(filePath);

        if (await staticFile.exists()) {
            return new Response(staticFile);
        }

        return new Response('Not found', { status: 404 });
    },
});

console.log(`Listening on ${server.url}`);
