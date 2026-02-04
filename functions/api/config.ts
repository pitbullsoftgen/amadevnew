
// FIX: Define KVNamespace interface as it is missing in the global scope
interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

// FIX: Define PagesFunction type as it is missing in the global scope
type PagesFunction<Env = any> = (context: {
  request: Request;
  env: Env;
  params: Record<string, string>;
  next: () => Promise<Response>;
  data: Record<string, unknown>;
}) => Response | Promise<Response>;

interface Env {
  APP_DB: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    // Fetch the JSON string of links from KV
    const links = await context.env.APP_DB.get('amz_wave_links');
    
    // Fallback if the database is empty
    if (!links) {
      const defaultLinks = [
        { id: 'default', label: 'Default Amazon', url: 'https://amazon.com', isPrimary: true, createdAt: Date.now() }
      ];
      return new Response(JSON.stringify(defaultLinks), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(links, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch from KV' }), { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const links = await context.request.json();
    
    // Save the entire array as a JSON string for the Dashboard to remain functional
    await context.env.APP_DB.put('amz_wave_links', JSON.stringify(links));
    
    // Also save the specific primary URL to a dedicated key if requested for other external tools
    const primary = (links as any[]).find(l => l.isPrimary);
    if (primary) {
      await context.env.APP_DB.put('destination_url', primary.url);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to update KV' }), { status: 500 });
  }
};
