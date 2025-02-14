import { Client } from '@neondatabase/serverless';

export async function onRequestPost(context) {
    const client = new Client(context.env.DATABASE_URL);
    const [_, searchEvent] = await Promise.all([
        await client.connect(),
        await context.request.json(),
    ]);

    const resp = await client.query('INSERT INTO search_events (timestamp, version, origin, term) VALUES (current_timestamp, $1, $2, $3);', [
        searchEvent.version,
        searchEvent.origin,
        searchEvent.term
    ]);
    if (resp.rowCount !== 1) {
        console.log('Error writing search event', searchEvent);
    }
    return new Response();
}
