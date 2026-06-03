import { createAgent, defineTool, Type, configureProvider } from '@flue/runtime';

// Helper to strip HTML tags for the webpage fetcher
function cleanHtml(html: string): string {
  // Strip script and style tags and their contents
  let text = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');
  // Strip other HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Normalize whitespace
  return text.replace(/\s+/g, ' ').trim();
}

// Define the agent factory
export default createAgent(({ id, env }) => {
  // Configure Google provider with GEMINI_API_KEY if present
  if (env && env.GEMINI_API_KEY) {
    configureProvider('google', {
      apiKey: String(env.GEMINI_API_KEY),
    });
  } else if (typeof process !== 'undefined' && process.env.GEMINI_API_KEY) {
    configureProvider('google', {
      apiKey: String(process.env.GEMINI_API_KEY),
    });
  }

  // Define tools inside the factory so they can bind to the environment variables (`env`)
  const searchWeb = defineTool({
    name: 'search_web',
    description: 'Search the web for information about a business, reviews, competitors, or industry trends.',
    parameters: Type.Object({
      query: Type.String({ description: 'The search query (e.g. "Acme Corp customer reviews" or "Acme Corp competitors")' }),
    }),
    execute: async ({ query }) => {
      const q = String(query).toLowerCase();
      
      // We resolve API keys checking both the factory env parameter (Workers target) and process.env (Node target fallback)
      const serperKey = env?.SERPER_API_KEY || (typeof process !== 'undefined' ? process.env.SERPER_API_KEY : undefined);
      const tavilyKey = env?.TAVILY_API_KEY || (typeof process !== 'undefined' ? process.env.TAVILY_API_KEY : undefined);
      const exaKey = env?.EXA_API_KEY || (typeof process !== 'undefined' ? process.env.EXA_API_KEY : undefined);

      // Check for Serper API Key
      if (serperKey) {
        try {
          const response = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
              'X-API-KEY': String(serperKey),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ q: query }),
          });
          const data: any = await response.json();
          const results = data.organic?.map((item: any) => `Title: ${item.title}\nLink: ${item.link}\nSnippet: ${item.snippet}`).join('\n\n') || 'No organic results found.';
          return `Search results for "${query}":\n\n${results}`;
        } catch (err: any) {
          return `Error searching with Serper: ${err.message}`;
        }
      }

      // Check for Tavily API Key
      if (tavilyKey) {
        try {
          const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              api_key: String(tavilyKey),
              query: query,
              include_answer: true,
            }),
          });
          const data: any = await response.json();
          const results = data.results?.map((item: any) => `Title: ${item.title}\nLink: ${item.url}\nContent: ${item.content}`).join('\n\n') || 'No results found.';
          return `Search results for "${query}":\n\n${results}`;
        } catch (err: any) {
          return `Error searching with Tavily: ${err.message}`;
        }
      }

      // Check for Exa API Key
      if (exaKey) {
        try {
          const response = await fetch('https://api.exa.ai/search', {
            method: 'POST',
            headers: {
              'x-api-key': String(exaKey),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query, numResults: 5 }),
          });
          const data: any = await response.json();
          const results = data.results?.map((item: any) => `Title: ${item.title}\nLink: ${item.url}\nScore: ${item.score}`).join('\n\n') || 'No results found.';
          return `Search results for "${query}":\n\n${results}`;
        } catch (err: any) {
          return `Error searching with Exa: ${err.message}`;
        }
      }

      // Default mock behavior if no keys are provided
      console.log(`[biz-intel] Mocking search for query: "${query}"`);
      
      if (q.includes('review') || q.includes('sentiment') || q.includes('customer')) {
        return `Mock Search Results for "${query}" (Set TAVILY_API_KEY or SERPER_API_KEY or EXA_API_KEY for real results):
        
  1. Yelp Review - 4.5/5 stars: "Great service, but the waiting times are a bit long on weekends. The staff is extremely friendly!"
  2. Google Review - 5/5 stars: "Amazing quality! Highly recommend them. I've been a loyal customer for 2 years."
  3. Local Blog Article: "Customer feedback highlights their unique product selection but notes that their online ordering system can sometimes be slow."
  4. Glassdoor: "Friendly team, good culture, but sometimes disorganized management."`;
      }

      if (q.includes('competitor') || q.includes('vs') || q.includes('alternative')) {
        return `Mock Search Results for "${query}" (Set TAVILY_API_KEY or SERPER_API_KEY or EXA_API_KEY for real results):
        
  1. Competitor A (Apex Solutions): Offers similar services with a fully integrated mobile app and 24/7 support. They are priced slightly higher.
  2. Competitor B (Zenith Corp): Operates in the same area. They specialize in cheap, bulk deals but have lower rating (3.8 stars) due to poor customer service.
  3. Industry Report: Zenith Corp dominates local search engine visibility, followed by Apex Solutions. The business is ranked 3rd in online presence.`;
      }

      return `Mock Search Results for "${query}" (Set TAVILY_API_KEY or SERPER_API_KEY or EXA_API_KEY for real results):
      
  1. Homepage: "Welcome to our business page! We offer premium local services designed to meet your specific needs."
  2. Press Release: The company recently announced plans to expand its service area and upgrade its customer service portal.
  3. Directory Listing: Active since 2021, opening hours 9 AM - 6 PM Monday to Friday.`;
    },
  });

  const fetchWebpage = defineTool({
    name: 'fetch_webpage',
    description: 'Fetch the text content of a specific webpage or URL to extract information.',
    parameters: Type.Object({
      url: Type.String({ description: 'The absolute URL of the webpage to fetch (e.g. "https://example.com/about")' }),
    }),
    execute: async ({ url }) => {
      try {
        const response = await fetch(String(url), {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
        });
        if (!response.ok) {
          return `Failed to fetch webpage. HTTP Status: ${response.status} ${response.statusText}`;
        }
        const html = await response.text();
        const text = cleanHtml(html);
        return `Webpage content for ${url} (truncated to 5000 chars):\n\n${text.substring(0, 5000)}`;
      } catch (err: any) {
        return `Error fetching webpage: ${err.message}`;
      }
    },
  });

  const scrapeWebsite = defineTool({
    name: 'scrape_website',
    description: 'Scrape a specific URL (like a competitor website) and convert its full text to clean Markdown.',
    parameters: Type.Object({
      url: Type.String({ description: 'The absolute URL to scrape' }),
    }),
    execute: async ({ url }) => {
      const apiKey = env?.FIRECRAWL_API_KEY || (typeof process !== 'undefined' ? process.env.FIRECRAWL_API_KEY : undefined);
      if (!apiKey) return "Firecrawl key missing. Falling back to native fetch.";

      try {
        const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            url, 
            formats: ['markdown'],
            onlyMainContent: true
          }),
        });
        const data: any = await response.json();
        return data.data?.markdown || "Could not extract content from page.";
      } catch (err: any) {
        return `Scraping error: ${err.message}`;
      }
    }
  });

  const getGooglePlacesInfo = defineTool({
    name: 'get_google_places_info',
    description: 'Use as a fallback to get official business hours, address, phone number, and rating if web search fails.',
    parameters: Type.Object({
      businessName: Type.String({ description: 'The name of the business' }),
      location: Type.String({ description: 'Optional location context (e.g. Chalfont, PA)' })
    }),
    execute: async ({ businessName, location }) => {
      const apiKey = env?.GOOGLE_PLACES_API_KEY || (typeof process !== 'undefined' ? process.env.GOOGLE_PLACES_API_KEY : undefined);
      if (!apiKey) return "Google Places key is not configured.";

      try {
        // 1. Find Place ID
        const query = encodeURIComponent(`${businessName} ${location || ''}`);
        const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id&key=${apiKey}`;
        const findRes = await fetch(findUrl);
        const findData: any = await findRes.json();
        
        const placeId = findData.candidates?.[0]?.place_id;
        if (!placeId) return "Business not found on Google Maps.";

        // 2. Fetch Place Details
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,rating,user_ratings_total,opening_hours&key=${apiKey}`;
        const detailsRes = await fetch(detailsUrl);
        const detailsData: any = await detailsRes.json();
        const place = detailsData.result;

        if (!place) return "Could not retrieve details for this business.";

        return JSON.stringify({
          name: place.name,
          address: place.formatted_address,
          phone: place.formatted_phone_number,
          rating: place.rating,
          totalReviews: place.user_ratings_total,
          isOpenNow: place.opening_hours?.open_now,
          weekdayText: place.opening_hours?.weekday_text
        }, null, 2);
      } catch (err: any) {
        return `Google Places error: ${err.message}`;
      }
    }
  });

  return {
    model: 'google/gemini-3-flash-preview',
    tools: [searchWeb, fetchWebpage, scrapeWebsite, getGooglePlacesInfo],
    instructions: `You are an autonomous Business Intelligence Agent. Your goal is to analyze small businesses and generate comprehensive intelligence reports.

Given a business name or Google Business Profile, follow this process:
1. Search for the business name to understand its offerings, branding, and location. Always try to find business hours, address, and ratings using free search_web first. Only call get_google_places_info if the search results are incomplete, missing reviews, or rate-limited.
2. Search for customer reviews and feedback (e.g., Google, Yelp, Trustpilot) to analyze sentiment and identify common praise or complaints.
3. Search for local or direct competitors and analyze what they offer, their pricing, strengths, and weaknesses. Maximize efficiency: do not scrape a competitor website if search snippets already provide the required facts. Only use scrape_website on target competitor homepages or services pages to compile a detailed feature-comparison matrix and identify service gaps.
4. Identify missed opportunities (e.g., lacking a mobile app, slow response times, missing services, weak online visibility).
5. Generate the following assets to help the business:
   - Review responses: A template response for a 5-star review, and a professional, constructive response to a 1-star review.
   - Marketing Campaign: Two tailored marketing ideas (e.g., social media promotions, loyalty program).
   - Customer Outreach: An email/SMS template for reaching out to lapsed customers.

Produce a detailed, beautifully structured report in Markdown. Maintain a professional, encouraging, and highly actionable tone.`,
  };
});
