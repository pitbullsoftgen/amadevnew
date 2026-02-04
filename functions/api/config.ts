interface Env {
  APP_DB: KVNamespace;
}

// GET: Fetch the links for the frontend or dashboard
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const links = await context.env.APP_DB.get('amz_wave_links');
    
    // If database is empty, return a default structured array
    if (!links) {
      const defaultLinks = [
        { 
          id: 'default', 
          label: 'Default Amazon', 
          url: 'https://amazon.com', 
          isPrimary: true, 
          createdAt: Date.now() 
        }
      ];
      return new Response(JSON.stringify(defaultLinks), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(links, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'KV Fetch Error' }), { status: 500 });
  }
};

// POST: Save new links from the admin dashboard
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const links = await context.request.json();
    
    // 1. Save the full array for the dashboard
    await context.env.APP_DB.put('amz_wave_links', JSON.stringify(links));
    
    // 2. Extract and save the primary URL to 'destination_url' for the landing page button
    const primary = (links as any[]).find(l => l.isPrimary);
    if (primary) {
      await context.env.APP_DB.put('destination_url', primary.url);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'KV Update Error' }), { status: 500 });
  }
};
