/**
 * Hashnode GraphQL API Client
 * Fetches blog posts from Hashnode's GraphQL API
 */

import sanitizeHtml from "sanitize-html";

type HashNodePost = {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  subtitle: string;
  brief: string;
  content: string;
  coverImage?: {
    url: string;
  };
  tags: Array<{
    name: string;
    slug: string;
  }>;
};

// Sanitization options for Hashnode HTML content
const sanitizeOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "blockquote",
    "a",
    "img",
    "code",
    "pre",
    "div",
    "span",
    "table",
    "thead",
    "tbody",
    "tr",
    "td",
    "th",
    "hr",
  ],
  allowedAttributes: {
    a: ["href", "title"],
    img: ["src", "alt", "title", "width", "height"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https"],
};

export async function fetchHashnodePosts(): Promise<HashNodePost[]> {
  const username = process.env.NEXT_PUBLIC_HASHNODE_USERNAME;
  const apiKey = process.env.HASHNODE_API_KEY;
  const apiUrl = process.env.HASHNODE_API_URL || "https://gql.hashnode.com/";

  if (!username || !apiKey) {
    console.warn(
      "Hashnode credentials not configured. Ensure NEXT_PUBLIC_HASHNODE_USERNAME and HASHNODE_API_KEY are set.",
    );
    return [];
  }

  const query = `
    query GetUserPosts($username: String!) {
      user(username: $username) {
        publications(first: 5) {
          edges {
            node {
              posts(first: 50) {
                edges {
                  node {
                    id
                    title
                    slug
                    publishedAt
                    updatedAt
                    subtitle
                    brief
                    content {
                      html
                    }
                    coverImage {
                      url
                    }
                    tags {
                      name
                      slug
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      // Webhook-based revalidation handles cache invalidation on new posts
      // See: app/api/webhooks/hashnode/route.ts
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Hashnode API error ${response.status}:`,
        errorText.substring(0, 300),
      );
      throw new Error(`Hashnode API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error("Hashnode GraphQL errors:", data.errors);
      throw new Error(
        `Hashnode GraphQL error: ${data.errors[0]?.message || "Unknown error"}`,
      );
    }

    // Extract posts from nested publications structure
    const publications = data.data?.user?.publications?.edges;
    if (!publications || publications.length === 0) {
      console.warn("No publications found in Hashnode response");
      return [];
    }

    const posts = publications[0]?.node?.posts?.edges || [];
    if (posts.length === 0) {
      console.warn("No posts found in Hashnode response");
      return [];
    }

    // Transform Hashnode GraphQL edges to flat array
    return posts.map((edge) => {
      const post = edge.node;
      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        publishedAt: post.publishedAt,
        subtitle: post.subtitle,
        brief: post.brief,
        content: sanitizeHtml(post.content?.html || "", sanitizeOptions),
        coverImage: post.coverImage,
        tags: post.tags,
      };
    });
  } catch (error) {
    console.error("Failed to fetch Hashnode posts:", error);
    return [];
  }
}
